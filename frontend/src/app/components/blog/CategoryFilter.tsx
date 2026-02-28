interface CategoryFilterProps {
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  activeCategory = "All",
  onCategoryChange 
}: CategoryFilterProps) {
  
  // Handle category click
  const handleCategoryClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-12 justify-center">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => handleCategoryClick(category)}
          className={`px-6 py-2 rounded-full transition-colors ${
            category === activeCategory 
              ? 'bg-sky-700 text-white' 
              : 'bg-white text-gray-600 hover:bg-sky-50 border border-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
} 