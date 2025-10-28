interface BadgeProps {
  children: React.ReactNode;
  variant?: "draft" | "published" | "default";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantClasses = {
    draft: "bg-gray-100 text-gray-700",
    published: "bg-green-100 text-green-700",
    default: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
