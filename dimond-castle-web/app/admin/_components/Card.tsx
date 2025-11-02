import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white shadow-sm hover:shadow-md transition ${className}`}>
      {children}
    </div>
  );
}

