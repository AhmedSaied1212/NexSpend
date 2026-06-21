import { formatCurrency } from '@/utils/FormateCurrency';
import { Loader2 } from 'lucide-react';
import { CATEGORIES, getCategoryIcon, getCategoryColor } from '@/data/categories';

const Cards = ({ transactions, isLoading, categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 px-4 md:px-6 pb-10 pt-2">
      {isLoading ? (
        <div className="col-span-full flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-blue-500" size={28} />
        </div>
      ) : categories.length === 0 ? (
        <h1 className="col-span-full text-center mt-10 text-xl text-muted-foreground">
          No categories found
        </h1>
      ) : (
        categories.map((category) => {
          const categoryTransactions = transactions.filter((t) => t.category === category);
          const count = categoryTransactions.length;
          const categoryType = categoryTransactions[0]?.type;
          const totalAmount = categoryTransactions.reduce((sum, item) => sum + Number(item.amount), 0);

          const CategoryIcon = getCategoryIcon(category);
          const categoryColor = getCategoryColor(category);
          const isDefault = CATEGORIES.some(c => c.name.toLowerCase() === category.toLowerCase());

          const displayColor = isDefault
            ? categoryColor
            : (categoryType === "expense" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500");

          return (
            <div
              className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-black/40 transition-all duration-300"
              key={category}
            >
              <div className="flex items-center mb-5">
                <CategoryIcon size={38} className={`p-2 rounded-xl shrink-0 ${displayColor}`} />
                <h1 className="ml-3 text-base font-bold text-foreground truncate">{category}</h1>
              </div>

              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className={`font-bold text-base ${categoryType === "expense" ? "text-red-500" : "text-green-500"}`}>
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Transactions</span>
                <span className="font-semibold text-foreground">{count}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Cards;