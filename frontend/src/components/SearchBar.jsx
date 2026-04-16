import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = ['All', 'breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts'];

const SearchBar = ({ onSearch, onFilter, placeholder = 'Search hotels or dishes...' }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  const handleSearch = (val) => {
    setQuery(val);
    onSearch?.(val);
  };

  const applyFilter = (cat, veg) => {
    onFilter?.({ category: cat === 'All' ? '' : cat, isVeg: veg });
  };

  const handleCat = (cat) => {
    setActiveCategory(cat);
    applyFilter(cat, vegOnly);
  };

  const handleVeg = () => {
    setVegOnly((p) => {
      applyFilter(activeCategory, !p);
      return !p;
    });
  };

  return (
    <div className="w-full">
      <div className="flex gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="input pl-10 pr-10"
          />
          {query && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={`btn-secondary gap-2 px-4 ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-600 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-400' : ''}`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-3 p-4 card animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 self-center mr-1">Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              onClick={handleVeg}
              className={`w-10 h-5 rounded-full transition-colors relative ${vegOnly ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${vegOnly ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-300">Veg only</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
