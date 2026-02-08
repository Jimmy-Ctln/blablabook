import * as argon2 from 'argon2';
import { eq, or, and, isNull, ilike, not } from 'drizzle-orm';
import { user } from '../db/schema';
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
  //  TODO Filtrer les champs sensibles (password)
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

  async softDelete(id: number) {
    const [deletedUser] = await db
      .update(user)
      .set({ deletedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    if (!deletedUser) {
      throw new NotFoundException(`User not found`);
    }

    return plainToInstance(UpdateUserResponseDto, deletedUser, {
      excludeExtraneousValues: true,
    });
  }
}
