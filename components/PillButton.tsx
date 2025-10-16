"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/clsx";

type Variant = "primary" | "secondary" | "outline";

type SharedProps = {
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorProps = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

const baseStyles =
  "inline-flex h-14 items-center justify-center rounded-full px-6 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

const variantStyles: Record<Variant, string> = {
  primary: "bg-brand text-brandInk shadow-soft",
  secondary: "bg-surface text-brand border border-brand",
  outline: "bg-surface text-ink border border-border",
};

export const PillButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps | AnchorProps
>(function PillButton(
  { variant = "primary", fullWidth = true, className, children, ...props },
  ref
) {
  const composedClassName = cn(
    baseStyles,
    variantStyles[variant],
    fullWidth && "w-full",
    className
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={composedClassName}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={composedClassName}
      {...(props as ButtonProps)}
    >
      {children}
    </button>
  );
});
