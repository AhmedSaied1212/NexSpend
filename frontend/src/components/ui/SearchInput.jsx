import { Search } from 'lucide-react';
import React from 'react';

const SearchInput = ({ search, setSearch, type }) => {
  return (
    <div className='p-3 w-full relative'>
      <input 
        onChange={(e) => setSearch(e.target.value)} 
        value={search} 
        type="text" 
        placeholder={`Search ${type}...`} 
        className='text-base bg-card border border-border w-full pl-11 pr-4 py-2.5 rounded-lg outline-none focus:shadow-md focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-300'
      />
      <Search className='absolute z-10 top-6 left-6 text-muted-foreground' size={18} />
    </div>
  );
};

export default SearchInput;