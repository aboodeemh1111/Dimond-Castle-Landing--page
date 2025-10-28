import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  header,
  footer,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-admin-border">{header}</div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-admin-border bg-gray-50 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
}
