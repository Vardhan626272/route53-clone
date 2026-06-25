import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
}

export function InputField({
  label,
  htmlFor,
  hint,
  error,
  className = "",
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-aws-text">
        {label}
      </label>
      <input
        id={htmlFor}
        className={`w-full rounded border px-3 py-2 text-sm text-aws-text outline-none transition focus:border-aws-link focus:ring-1 focus:ring-aws-link ${
          error ? "border-red-500" : "border-aws-border"
        } ${className}`}
        {...props}
      />
      {hint ? <p className="text-xs text-aws-muted">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  htmlFor,
  hint,
  error,
  children,
  className = "",
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-aws-text">
        {label}
      </label>
      <select
        id={htmlFor}
        className={`w-full rounded border px-3 py-2 text-sm text-aws-text outline-none transition focus:border-aws-link focus:ring-1 focus:ring-aws-link ${
          error ? "border-red-500" : "border-aws-border"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint ? <p className="text-xs text-aws-muted">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function TextareaField({
  label,
  htmlFor,
  hint,
  error,
  className = "",
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-aws-text">
        {label}
      </label>
      <textarea
        id={htmlFor}
        className={`min-h-24 w-full rounded border px-3 py-2 text-sm text-aws-text outline-none transition focus:border-aws-link focus:ring-1 focus:ring-aws-link ${
          error ? "border-red-500" : "border-aws-border"
        } ${className}`}
        {...props}
      />
      {hint ? <p className="text-xs text-aws-muted">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export function CheckboxField({
  label,
  htmlFor,
  hint,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="flex items-start gap-2 text-sm text-aws-text">
        <input
          id={htmlFor}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-aws-border text-aws-link focus:ring-aws-link"
          {...props}
        />
        <span>{label}</span>
      </label>
      {hint ? <p className="text-xs text-aws-muted">{hint}</p> : null}
    </div>
  );
}
