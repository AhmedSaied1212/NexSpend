import { cn } from "@/lib/utils";

/**
 * Generic card shell used to wrap every chart panel.
 */
const ChartCard = ({ title, description, className, children, action }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default ChartCard;
