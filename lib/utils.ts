import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const round = (number: number, precision: number = 0) => {
  return +number.toFixed(precision);
};

export async function api(input: string | URL | Request, init?: RequestInit) {
  const res = await fetch(input, init);
  const data = await res.json();
  return Response.json({ data });
}
