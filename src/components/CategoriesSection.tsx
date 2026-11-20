import type { CategoryItem } from '../types/catalog';

interface CategoriesSectionProps {
  categories: CategoryItem[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoriesSection({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoriesSectionProps) {
  return (
    <section id="categories" className="section-block" aria-labelledby="categories-heading">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="section-kicker">02 // TAXONOMY SECTORS (STATIC DEMO)</p>
            <h2 id="categories-heading" className="section-title">
              Explore Categories
            </h2>
          </div>
          {selectedCategoryId ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onSelectCategory(null)}
            >
              Show All Categories
            </button>
          ) : (
            <p className="section-desc">যেকোনো ক্যাটাগরিতে ক্লিক করে নিচের Featured তালিকা ফিল্টার করুন।</p>
          )}
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const isActive = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                className={`glass-panel category-card ${isActive ? 'category-card--active' : ''}`}
                onClick={() => onSelectCategory(isActive ? null : category.id)}
              >
                <span className="category-card__head">
                  <span className="category-card__code">{category.code}</span>
                  <span className="cyber-badge">{isActive ? 'ACTIVE' : 'FILTER'}</span>
                </span>
                <span className="category-card__title">{category.name}</span>
                <span className="category-card__desc">{category.description}</span>
                <span className="category-card__counts">
                  <span>{category.appCount} Demo Apps</span>
                  <span>{category.websiteCount} Demo Websites</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
