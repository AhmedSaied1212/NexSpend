import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * FormField — reusable labeled field wrapper with live validation feedback.
 *
 * Props:
 *  label    — string, the field label
 *  icon     — Lucide icon component shown beside the label
 *  error    — string, error message (empty string = no error)
 *  touched  — boolean, whether the user has interacted with this field
 *  hint     — optional string, static helper text shown below the input when
 *             there is no validation message yet
 *  children — the actual <input> / <div> element(s)
 */
const FormField = ({ label, icon: Icon, error, touched, hint, children }) => {
  const hasError   = touched && !!error;
  const hasSuccess = touched && !error;

  return (
    <div className="flex flex-col gap-1.5 mb-1">
      {/* Label row */}
      <label className="flex items-center gap-2 select-none">
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-200
            ${hasError   ? 'bg-red-100   text-red-500   dark:bg-red-950/60   dark:text-red-400'   : ''}
            ${hasSuccess ? 'bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400' : ''}
            ${!touched   ? 'bg-slate-100 text-slate-500 dark:bg-slate-800    dark:text-slate-400' : ''}
          `}
        >
          <Icon size={14} strokeWidth={2.2} />
        </span>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide">
          {label}
        </span>
      </label>

      {/* Input slot */}
      <div className="relative">
        {children}
      </div>

      {/* Feedback row — animated slide-in */}
      <div className="min-h-[18px] overflow-hidden">
        {hasError && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 animate-[fadeIn_.18s_ease] font-medium">
            <AlertCircle size={12} strokeWidth={2.5} className="shrink-0" />
            {error}
          </p>
        )}
        {hasSuccess && (
          <p className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 animate-[fadeIn_.18s_ease] font-medium">
            <CheckCircle2 size={12} strokeWidth={2.5} className="shrink-0" />
            Looks good!
          </p>
        )}
        {!touched && hint && (
          <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
        )}
      </div>
    </div>
  );
};

export default FormField;
