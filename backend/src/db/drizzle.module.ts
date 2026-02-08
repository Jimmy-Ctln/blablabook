import { Module, Global, DynamicModule } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export interface DrizzleModuleOptions {
  connectionString: string;
  name?: string;
}

// Makes this module global so its providers (like the Drizzle DB instance)
// can be injected in any other module without importing DrizzleModule everywhere
@Global()
@Module({})
export class DrizzleModule {
  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    const pool = new Pool({ connectionString: options.connectionString });
    const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

    return {
      module: DrizzleModule,
      providers: [
        {
          provide: options.name ?? 'DRIZZLE',
          useValue: db,
        },
      ],
      exports: [options.name ?? 'DRIZZLE'],
    };
  }
}
