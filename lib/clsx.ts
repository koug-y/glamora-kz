type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | ClassDictionary
  | ClassValue[];

type ClassDictionary = Record<string, boolean | undefined | null>;

function toString(value: ClassValue): string[] {
  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toString);
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .filter(([, active]) => Boolean(active))
      .map(([key]) => key);
  }

  return [];
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.flatMap(toString).filter(Boolean).join(" ");
}

