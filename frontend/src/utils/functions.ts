export function toDigits(input: number | null | undefined) {
  return (input || 0).toString().padStart(4, "0");
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
