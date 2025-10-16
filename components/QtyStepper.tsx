"use client";

import { cn } from "@/lib/clsx";

type QtyStepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
};

export function QtyStepper({
  value,
  min = 1,
  max,
  onChange,
  className,
}: QtyStepperProps) {
  const decrementDisabled = value <= min;
  const incrementDisabled = typeof max === "number" && value >= max;

  const handleUpdate = (next: number) => {
    if (next < min) return;
    if (typeof max === "number" && next > max) return;
    onChange(next);
  };

  return (
    <div
      className={cn(
        "inline-flex h-10 items-center rounded-full border border-border bg-surface p-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-lg font-semibold text-ink transition-colors hover:bg-brand hover:text-brandInk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
        onClick={() => handleUpdate(value - 1)}
        disabled={decrementDisabled}
      >
        &minus;
      </button>
      <span className="min-w-[2ch] px-3 text-center text-base font-semibold tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid h-8 w-8 place-items-center rounded-full text-lg font-semibold text-ink transition-colors hover:bg-brand hover:text-brandInk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-surface disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
        onClick={() => handleUpdate(value + 1)}
        disabled={incrementDisabled}
      >
        +
      </button>
    </div>
  );
}
