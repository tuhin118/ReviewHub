import { useMemo, useRef, useState } from 'react';
import { CategoriesSection } from '../components/CategoriesSection';
import { FeaturedSection } from '../components/FeaturedSection';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { ItemPreviewModal } from '../components/ItemPreviewModal';
import { Navbar } from '../components/Navbar';
import { TopRatedSection } from '../components/TopRatedSection';
import { TrendingSection } from '../components/TrendingSection';
import { DEMO_CATALOG_ITEMS, DEMO_CATEGORIES } from '../data/homepageDemoData';
import type { CatalogItem, FilterType } from '../types/catalog';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const trendingItems = useMemo(
    () => DEMO_CATALOG_ITEMS.filter((item) => item.isTrending).slice(0, 4),
    [],
  );

  const topRatedItems = useMemo(
    () =>
      [...DEMO_CATALOG_ITEMS]
        .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
        .slice(0, 5),
    [],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DEMO_CATALOG_ITEMS.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }
      if (selectedCategoryId && item.categoryId !== selectedCategoryId) {
        return false;
      }
      if (!query) {
        return true;
      }

      const haystack = [
        item.name,
        item.tagline,
        item.description,
        item.categoryLabel,
        item.publisherName,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchQuery, typeFilter, selectedCategoryId]);

  const selectedCategoryLabel = useMemo(() => {
    if (!selectedCategoryId) return null;
    return DEMO_CATEGORIES.find((cat) => cat.id === selectedCategoryId)?.name ?? null;
  }, [selectedCategoryId]);

  const totalDemoReviews = useMemo(
    () => DEMO_CATALOG_ITEMS.reduce((sum, item) => sum + item.reviewCount, 0),
    [],
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setSelectedCategoryId(null);
  };

  const handleFocusSearch = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <>
      <Navbar onFocusSearch={handleFocusSearch} />

      <main className="main-content">
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          searchInputRef={searchInputRef}
          totalDemoItems={DEMO_CATALOG_ITEMS.length}
          totalDemoReviews={totalDemoReviews}
        />

        <TrendingSection items={trendingItems} onSelectItem={setSelectedItem} />

        <CategoriesSection
          categories={DEMO_CATEGORIES}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <FeaturedSection
          items={filteredItems}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          selectedCategoryLabel={selectedCategoryLabel}
          onResetFilters={handleResetFilters}
          onSelectItem={setSelectedItem}
        />

        <TopRatedSection items={topRatedItems} onSelectItem={setSelectedItem} />
      </main>

      <Footer />

      <ItemPreviewModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
