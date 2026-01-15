import { AlertCircle } from "lucide-react";
import { useId, type ReactNode } from "react";

type ControlA11yProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  name?: string;
  children: (controlProps: ControlA11yProps) => ReactNode;
}

export function FormField({
  label,
  error,
  required,
  hint,
  name,
  children,
}: FormFieldProps) {
  const uid = useId();
  const id = name ?? `field-${uid}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const controlProps: ControlA11yProps = {
    id,
    ...(error ? { "aria-invalid": true as const } : {}),
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
  };

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-900">
        {label}
        {required && (
          <span className="ml-1 text-red-600" aria-label="obrigatório">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}

      {children(controlProps)}

      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1 text-xs text-red-600"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
