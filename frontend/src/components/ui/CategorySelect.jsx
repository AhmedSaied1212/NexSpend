import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus } from 'lucide-react';
import { CATEGORIES, getCategoryIcon, getCategoryColor } from '../../data/categories';

const CategorySelect = ({ category, setCategory, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const defaultCategories = CATEGORIES.filter(c => c.type === type);

  const filteredCategories = defaultCategories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasExactMatch = defaultCategories.some(c => 
    c.name.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const selectedColor = getCategoryColor(category);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (catName) => {
    setCategory(catName);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCreateCustom = () => {
    const cleanValue = searchQuery.trim();
    if (cleanValue) {
      setCategory(cleanValue);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleToggle = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (!next) {
        setSearchQuery("");
      }
      return next;
    });
  };

  return (
    <div className="relative w-full text-foreground" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center justify-between text-base rounded-lg p-2.5 w-full border border-border bg-background text-foreground outline-none focus:border-primary cursor-pointer hover:bg-muted/50 transition duration-200"
      >
        <div className="flex items-center gap-2">
          <span className={`p-1 rounded-md ${selectedColor} flex items-center justify-center shrink-0`}>
            {React.createElement(getCategoryIcon(category), { size: 16 })}
          </span>
          <span className={category ? "text-foreground font-medium" : "text-muted-foreground"}>
            {category || "Select a category"}
          </span>
        </div>
        <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search Box */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
            <Search size={14} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or add category..."
              className="w-full bg-transparent text-sm outline-none border-none text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          {/* Categories List */}
          <div className="overflow-y-auto flex-1 py-1">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isSelected = category.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleSelect(cat.name)}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm cursor-pointer hover:bg-muted transition duration-150 ${
                      isSelected 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'text-foreground'
                    }`}
                  >
                    <span className={`p-1 rounded-md ${cat.color} flex items-center justify-center shrink-0`}>
                      {React.createElement(cat.icon, { size: 14 })}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                );
              })
            ) : searchQuery.trim() === "" ? (
              <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                No categories found.
              </div>
            ) : null}

            {/* Custom Category Creator Option */}
            {searchQuery.trim() !== "" && !hasExactMatch && (
              <button
                type="button"
                onClick={handleCreateCustom}
                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-primary hover:bg-muted font-semibold border-t border-border cursor-pointer"
              >
                <Plus size={14} />
                <span>Add "{searchQuery.trim()}" as custom category</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
