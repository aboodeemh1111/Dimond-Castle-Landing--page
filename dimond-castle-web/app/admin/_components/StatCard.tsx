import React, { ReactNode } from "react";
import Card from "./Card";

export default function StatCard({
  title,
  value,
  icon,
  color = "green",
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: "green" | "gold";
}) {
  const bar = color === "gold" ? "bg-brand-gold-500" : "bg-brand-green-500";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
        </div>
        {icon ? (
          <div className={`h-10 w-10 rounded-lg ${bar} text-white grid place-items-center`}>
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

