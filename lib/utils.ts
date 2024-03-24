import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToSlug(text: string): string {
  return text
    .toLowerCase() // convert the whole string to lowercase
    .trim() // remove whitespace from both ends of a string
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}
