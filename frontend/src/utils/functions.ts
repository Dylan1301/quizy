export function toSixDigits(input: number | null | undefined) {
  return (input || 0).toString().padStart(6, "0");
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
