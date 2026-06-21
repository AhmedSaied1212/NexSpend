import React, { useEffect, useState } from 'react';
import Cards from '@/components/categories/Cards';
import useTransactions from '@/hooks/useTransactions';
import SearchInput from '@/components/ui/SearchInput';

const Categories = () => {
  const [search, setSearch] = useState("");
  const { getTransactions, transactions, isLoading } = useTransactions();

  useEffect(() => { getTransactions(); }, []);

  const filterdTransaction = transactions.filter((t) =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );
  const categories = [...new Set(filterdTransaction.map((t) => t.category))];

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-200">
      {/* Page header */}
      <div className="px-4 md:px-6 pt-5 pb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground">Overview of spending by category</p>
      </div>

      {/* Search */}
      <div className="px-4 md:px-6 pb-2">
        <SearchInput search={search} setSearch={setSearch} type="Categories" />
      </div>

      <Cards categories={categories} transactions={transactions} isLoading={isLoading} />
    </div>
  );
};

export default Categories;