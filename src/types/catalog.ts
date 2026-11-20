export type ItemType = 'app' | 'website';

export type FilterType = 'all' | ItemType;

export interface DemoReviewPreview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  type: ItemType;
  categoryId: string;
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  publisherName: string;
  verifiedPublisher: boolean;
  officialDomain: string;
  trendDelta?: string;
  isTrending?: boolean;
  isFeatured?: boolean;
  badgeText?: string;
  iconGlyph: 'shield' | 'terminal' | 'bolt' | 'globe' | 'layers' | 'cpu' | 'lock' | 'radar';
  sampleReviews: DemoReviewPreview[];
}

export interface CategoryItem {
  id: string;
  name: string;
  code: string;
  description: string;
  appCount: number;
  websiteCount: number;
}
