import { Loader2, SquarePen, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/FormatDate';
import { formatCurrency } from '@/utils/FormateCurrency';
import { CATEGORIES, getCategoryIcon, getCategoryColor } from '@/data/categories';
import { useNavigate } from 'react-router-dom';

const List = ({ filterdTransacion, isLoading, handleEdit, deleteLoadingId, onDeleteClick }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl mt-4 mx-4 md:mx-6 mb-10 shadow-sm overflow-hidden">
      <h1 className="text-base md:text-lg font-bold p-4 md:p-6 border-b border-border text-foreground">
        Recent Transactions
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      ) : filterdTransacion.length === 0 ? (
        <p className="text-center my-14 text-muted-foreground text-sm">No transactions found</p>
      ) : (
        filterdTransacion.map((t) => {
          const CategoryIcon = getCategoryIcon(t.category);
          const categoryColor = getCategoryColor(t.category);
          const isDefault = CATEGORIES.some(c => c.name.toLowerCase() === t.category.toLowerCase());

          const displayColor = isDefault
            ? categoryColor
            : (t.type === "expense" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500");

          return (
            <div
              key={t._id}
              className="group px-4 py-3 md:px-5 md:py-4 border-b border-border hover:bg-muted/40 transition-colors duration-150 flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/transaction/${t._id}`)}
            >
              {/* Icon */}
              <div className={`p-2 md:p-2.5 rounded-lg shrink-0 ${displayColor}`}>
                <CategoryIcon size={16} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm text-foreground truncate">{t.description}</span>
                  <span className={`font-bold text-sm shrink-0 ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                    {t.type === "income" ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-0.5">
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <span>{t.category}</span>
                    <span className="opacity-30">•</span>
                    <span>{formatDate(t.date)}</span>
                  </div>

                  {/* Edit / delete – always visible on mobile, hover on desktop */}
                  <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      className="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-lg transition-colors duration-150"
                      onClick={(e) => { e.stopPropagation(); handleEdit(t._id); }}
                    >
                      <SquarePen size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteClick(t._id); }}
                      disabled={!!deleteLoadingId}
                      className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors duration-150"
                    >
                      {deleteLoadingId === t._id
                        ? <Loader2 className="animate-spin" size={15} />
                        : <Trash2 size={15} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default List;