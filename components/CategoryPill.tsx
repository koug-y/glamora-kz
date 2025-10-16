import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/clsx";

type CategoryPillProps = {
  href: string;
  title: string;
  description: ReactNode;
  className?: string;
};

export function CategoryPill({
  href,
  title,
  description,
  className,
}: CategoryPillProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-full bg-brand px-6 py-4 text-brandInk shadow-soft transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:-translate-y-0.5",
        className
      )}
      aria-label={title}
    >
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold leading-tight">{title}</span>
        <span className="text-sm font-medium leading-snug text-brandInk/85">
          {description}
        </span>
      </div>
    </Link>
  );
}

