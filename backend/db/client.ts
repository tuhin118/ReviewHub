import { ServiceUnavailableError } from '../lib/errors';

export type SqlParam = string | number | null;

export class D1Client {
  private readonly db: D1Database;

  constructor(db: D1Database | undefined) {
    if (!db) {
      throw new ServiceUnavailableError('D1 database binding is not configured');
    }
    this.db = db;
  }

  async queryFirst<T>(sql: string, params: readonly SqlParam[] = []): Promise<T | null> {
    try {
      const statement = this.db.prepare(sql).bind(...params);
      const result = await statement.first<T>();
      return result ?? null;
    } catch {
      throw new ServiceUnavailableError('Database read operation failed');
    }
  }

  async queryAll<T>(sql: string, params: readonly SqlParam[] = []): Promise<T[]> {
    try {
      const statement = this.db.prepare(sql).bind(...params);
      const result = await statement.all<T>();
      return result.results ?? [];
    } catch {
      throw new ServiceUnavailableError('Database list query failed');
    }
  }

  async execute(sql: string, params: readonly SqlParam[] = []): Promise<D1Result> {
    try {
      const statement = this.db.prepare(sql).bind(...params);
      return await statement.run();
    } catch {
      throw new ServiceUnavailableError('Database write operation failed');
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
