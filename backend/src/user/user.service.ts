import * as argon2 from 'argon2';
import { eq, or, and, isNull, ilike, not } from 'drizzle-orm';
import { user, refreshToken } from '../db/schema';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { db } from '../db/index';
import { plainToInstance } from 'class-transformer';
import { UpdateUserResponseDto } from './dto/update-user.response.dto';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';
import { UserInsert, UserSelect } from './types/user';

@Injectable()
export class UserService {
  async createUser(userInputData: UserInsert): Promise<UserSelect | null> {
    const normalizedEmail = userInputData.email.toLowerCase();

    const result = await db
      .insert(user)
      .values({
        ...userInputData,
        email: normalizedEmail,
      })
      .returning();
    return result[0] ?? null;
  }

  async getUserByUsername(username: string): Promise<UserSelect | null> {
    const result = await db
      .select()
      .from(user)
      .where(and(ilike(user.username, username), isNull(user.deletedAt)));

    return result[0] ?? null;
  }

  async getUserByEmail(email: string): Promise<UserSelect | null> {
    const normalizedEmail = email.toLowerCase();
    const result = await db
      .select()
      .from(user)
      .where(and(eq(user.email, normalizedEmail), isNull(user.deletedAt)));

    return result[0] ?? null;
  }

  async checkUserExisting(
    username: string,
    email: string,
  ): Promise<UserSelect | null> {
    const normalizedEmail = email.toLowerCase();
    const result = await db
      .select()
      .from(user)
      .where(
        and(
          or(
            ilike(user.email, normalizedEmail),
            ilike(user.username, username),
          ),
          isNull(user.deletedAt),
        ),
      );
    return result[0] ?? null;
  }

  async update(id: number, data: UpdateUserRequestDto) {
    const updateData = { ...data };

    if (updateData.email) {
      const emailToCheck = updateData.email.toLowerCase();

      const existingUser = await db
        .select()
        .from(user)
        .where(
          and(
            eq(user.email, emailToCheck),
            isNull(user.deletedAt),
            not(eq(user.id, id)),
          ),
        );

      if (existingUser.length > 0) {
        throw new UnprocessableEntityException('Email already in use');
      }
    }

    if (updateData.username) {
      const existingUser = await db
        .select()
        .from(user)
        .where(
          and(
            ilike(user.username, updateData.username),
            isNull(user.deletedAt),
            not(eq(user.id, id)),
          ),
        );

      if (existingUser.length > 0) {
        throw new UnprocessableEntityException('username is already in use');
      }
    }

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(and(eq(user.id, id), isNull(user.deletedAt)))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }

    return plainToInstance(UpdateUserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number) {
    const [userRow] = await db
      .select()
      .from(user)
      .where(and(eq(user.id, id), isNull(user.deletedAt)))
      .limit(1);

    if (!userRow) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return plainToInstance(UpdateUserResponseDto, userRow, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Fully anonymizes user data according to GDPR Right to be Forgotten (Article 17)
   * Preserves referential integrity (reviews, history) without traceability
   * @param id - User ID to anonymize
   */
  private async anonymizeUser(id: number): Promise<void> {
    // Generate untraceable anonymized data
    const anonymizedEmail = `deleted_${id}@anonymized.local`;
    const anonymizedUsername = `DeletedUser_${id}`;
    // Hash phantom password - invalid but hashed for security
    const anonPhantomPassword = await argon2.hash(`phantom_${id}_deleted`);

    await db
      .update(user)
      .set({
        email: anonymizedEmail,
        username: anonymizedUsername,
        password: anonPhantomPassword,
        avatar_url: null, // Remove avatar
        updatedAt: new Date(),
      })
      .where(eq(user.id, id));
  }

  /**
   * GDPR-compliant soft delete: anonymizes user and marks as deleted
   * - Personal data fully anonymized
   * - DB cascades remove: refreshTokens, userCategories, lists
   * - Reviews preserved (userId = NULL) to maintain public feedback integrity
   * @param id - User ID to delete
   */
  async softDelete(id: number) {
    // Step 1: Verify user exists
    const [userRow] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (!userRow) {
      throw new NotFoundException(`User not found`);
    }

    // Step 2: Fully anonymize user data
    await this.anonymizeUser(id);

    // Step 3: Mark as deleted
    const [deletedUser] = await db
      .update(user)
      .set({ deletedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    return plainToInstance(UpdateUserResponseDto, deletedUser, {
      excludeExtraneousValues: true,
    });
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const [userRow] = await db
      .select()
      .from(user)
      .where(and(eq(user.id, id), isNull(user.deletedAt)))
      .limit(1);

    if (!userRow) {
      throw new NotFoundException(`User not found`);
    }

    // Verify current password
    const isPasswordValid = await argon2.verify(
      userRow.password,
      currentPassword,
    );
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Current password is incorrect');
    }

    // Hash new password and update
    const hashedNewPassword = await argon2.hash(newPassword);
    const [updatedUser] = await db
      .update(user)
      .set({ password: hashedNewPassword })
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException(`User not found`);
    }

    // Invalidate all sessions after password change (security best practice)
    await db.delete(refreshToken).where(eq(refreshToken.userId, id));

    return {
      message: 'Password changed successfully',
    };
  }
}
