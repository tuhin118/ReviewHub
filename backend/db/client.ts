import { ConflictError, ServiceUnavailableError } from '../lib/errors';

export type SqlParam = string | number | null;

function isUniqueConstraintError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /UNIQUE constraint failed/i.test(message);
}

export class D1Client {
  private readonly db: D1Database;

  constructor(db: D1Database | undefined) {
    if (!db) {
      throw new ServiceUnavailableError('D1 database binding is not configured');
    }
    this.db = db;
  }

  prepare(sql: string, params: readonly SqlParam[] = []): D1PreparedStatement {
    return this.db.prepare(sql).bind(...params);
  }

  async queryFirst<T>(sql: string, params: readonly SqlParam[] = []): Promise<T | null> {
    try {
      const statement = this.prepare(sql, params);
      const result = await statement.first<T>();
      return result ?? null;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError('A conflicting record already exists');
      }
      throw new ServiceUnavailableError('Database read operation failed');
    }
  }

  async queryAll<T>(sql: string, params: readonly SqlParam[] = []): Promise<T[]> {
    try {
      const statement = this.prepare(sql, params);
      const result = await statement.all<T>();
      return result.results ?? [];
    } catch {
      throw new ServiceUnavailableError('Database list query failed');
    }
  }

  async execute(sql: string, params: readonly SqlParam[] = []): Promise<D1Result> {
    try {
      const statement = this.prepare(sql, params);
      return await statement.run();
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError('A conflicting record already exists');
      }
      throw new ServiceUnavailableError('Database write operation failed');
    }
  }

  async batch(statements: readonly D1PreparedStatement[]): Promise<D1Result[]> {
    try {
      return await this.db.batch([...statements]);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictError('A conflicting record already exists');
      }
      throw new ServiceUnavailableError('Database atomic batch failed');
    }
  }

  async healthCheck(): Promise<boolean> {
    const row = await this.queryFirst<{ ok: number }>('SELECT 1 AS ok');
    return row?.ok === 1;
  }
}

export function createDbClient(db: D1Database | undefined): D1Client {
  return new D1Client(db);
}
