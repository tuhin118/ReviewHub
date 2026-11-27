import type { D1Client } from '../client';

export interface DbCategoryRow {
  id: string;
  slug: string;
  name: string;
  code: string;
  description: string;
}

export interface DbPublicListingRow {
  id: string;
  slug: string;
  type: 'app' | 'website';
  title: string;
  tagline: string;
  avg_rating: number;
  review_count: number;
}

export async function listActiveCategories(db: D1Client): Promise<DbCategoryRow[]> {
  return db.queryAll<DbCategoryRow>(
    `SELECT id, slug, name, code, description
     FROM categories
     WHERE is_active = 1
     ORDER BY sort_order ASC, name ASC`,
  );
}

export async function listApprovedListingsPage(
  db: D1Client,
  type: 'app' | 'website',
  limit: number,
  offset: number,
): Promise<DbPublicListingRow[]> {
  return db.queryAll<DbPublicListingRow>(
    `SELECT id, slug, type, title, tagline, avg_rating, review_count
     FROM listings
     WHERE status = 'Approved' AND type = ?
     ORDER BY avg_rating DESC, review_count DESC
     LIMIT ? OFFSET ?`,
    [type, limit, offset],
  );
}
