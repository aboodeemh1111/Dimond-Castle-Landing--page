import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
}

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    BaseInputProps {
  as?: "input";
}

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseInputProps {
  as: "textarea";
}

type Props = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  (
    { label, error, helperText, className = "", as = "input", ...props },
    ref
  ) => {
    const baseClasses =
      "w-full px-4 py-2 border rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-admin-primary/40 focus:border-admin-primary disabled:bg-gray-50 disabled:cursor-not-allowed";
    const errorClasses = error
      ? "border-admin-danger focus:ring-admin-danger/40 focus:border-admin-danger"
      : "border-admin-border";

    const inputElement =
      as === "textarea" ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={`${baseClasses} ${errorClasses} ${className} min-h-[100px] resize-y`}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-admin-text mb-2">
            {label}
          </label>
        )}
        {inputElement}
        {error && <p className="mt-1 text-sm text-admin-danger">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-admin-textLight">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
