import React, { useMemo } from 'react';

// ─── Strength computation helper ──────────────────────────────────────────────
export const getPasswordStrength = (pw) => {
  if (!pw) return null;
  const checks = {
    length: pw.length >= 8,
    upper:  /[A-Z]/.test(pw),
    number: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  if (passed <= 1) return { level: 1, label: 'Weak',        bar: 'bg-red-500',    text: 'text-red-500'    };
  if (passed === 2) return { level: 2, label: 'Good',        bar: 'bg-orange-400', text: 'text-orange-400' };
  if (passed === 3) return { level: 3, label: 'Strong',      bar: 'bg-blue-500',   text: 'text-blue-500'   };
  return              { level: 4, label: 'Very Strong',  bar: 'bg-green-500',  text: 'text-green-500'  };
};

const RULES = [
  { label: '8+ characters',      test: (pw) => pw.length >= 8 },
  { label: '1 uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: '1 number',           test: (pw) => /[0-9]/.test(pw) },
  { label: '1 symbol (!@#$…)',   test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

/**
 * PasswordStrength Component
 * Renders the strength indicator bars and the criteria list below the password input field.
 */
const PasswordStrength = ({ password, touched }) => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2 select-none animate-[fadeIn_.15s_ease]">
      {/* Four segments */}
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-300 ${
              i <= strength.level ? strength.bar : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Strength level label */}
      <p className={`text-[11px] font-bold tracking-wide uppercase ${strength.text}`}>
        Strength: {strength.label}
      </p>

      {/* Rules list */}
      {touched && (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
          {RULES.map(({ label, test }) => {
            const ok = test(password);
            return (
              <li
                key={label}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-200
                  ${ok ? 'text-green-500 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}
              >
                <span className="text-[10px]">{ok ? '✓' : '○'}</span>
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrength;
