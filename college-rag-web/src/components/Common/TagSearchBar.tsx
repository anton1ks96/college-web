import type {FC} from "react";
import {useState} from "react";

interface TagSearchBarProps {
  onSearch: (tag: string) => void;
  onClear: () => void;
  isSearching?: boolean;
}

export const TagSearchBar: FC<TagSearchBarProps> = ({
  onSearch,
  onClear,
  isSearching = false,
}) => {
  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setIsActive(true);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsActive(false);
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "Escape" && isActive) {
      handleClear();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Поиск по тегу..."
          className="pl-9 pr-3 py-2 w-56 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={!query.trim() || isSearching}
        className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Найти
      </button>
      {isActive && (
        <button
          onClick={handleClear}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Сбросить
        </button>
      )}
    </div>
  );
};
