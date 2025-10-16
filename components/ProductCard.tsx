import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/clsx";

type ProductCardProps = {
  href: string;
  name: string;
  priceLabel: string;
  description: ReactNode;
  image: string;
  imageAlt: string;
  className?: string;
  unoptimized?: boolean;
};

export function ProductCard({
  href,
  name,
  priceLabel,
  description,
  image,
  imageAlt,
  className,
  unoptimized = false,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        className
      )}
    >
      <div className="relative mb-3 flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-surface-alt">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-contain"
          sizes="(min-width: 768px) 200px, 50vw"
          unoptimized={unoptimized}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-base font-semibold text-ink">
          {name}
        </h3>
        <p className="line-clamp-2 text-sm text-mutedInk">{description}</p>
        <span className="mt-auto text-sm font-medium text-mutedInk">
          {priceLabel}
        </span>
      </div>
    </Link>
  );
}
