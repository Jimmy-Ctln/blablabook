import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import * as schema from 'src/db/schema';
import { eq, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject('DRIZZLE') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  /**
   * Find all categories
   */
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.db
      .select()
      .from(schema.category)
      .where(eq(schema.category.isActive, true))
      .execute();

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
    }));
  }

  /**
   * Find one category by ID
   */
  async findOne(id: number): Promise<CategoryResponseDto> {
    const [category] = await this.db
      .select()
      .from(schema.category)
      .where(
        and(eq(schema.category.id, id), eq(schema.category.isActive, true)),
      )
      .execute();

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      id: category.id,
      name: category.name,
    };
  }

  /**
   * Find a category by name or create it if it doesn't exist
   */
  async findOrCreateByName(name: string): Promise<CategoryResponseDto> {
    const [existingCategory] = await this.db
      .select()
      .from(schema.category)
      .where(eq(schema.category.name, name))
      .execute();

    if (existingCategory) {
      return {
        id: existingCategory.id,
        name: existingCategory.name,
      };
    }

    const [newCategory] = await this.db
      .insert(schema.category)
      .values({ name })
      .returning();

    return {
      id: newCategory.id,
      name: newCategory.name,
    };
  }
}
