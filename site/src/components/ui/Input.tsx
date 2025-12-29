import { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function Input({
  label,
  error,
  className = '',
  onChange,
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-foreground">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 rounded-lg
          border border-border
          bg-card text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-danger focus:ring-danger' : ''}
          ${className}
        `}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
