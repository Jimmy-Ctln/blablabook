import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Swaps the size suffix on an OpenLibrary cover URL.
// S ≈ 38px wide, M ≈ 180px wide, L ≈ 300px wide.
// Pass through any non-OpenLibrary URL unchanged.
export function resizeOpenLibraryCover(
  url: string | null | undefined,
  size: "S" | "M" | "L",
): string | undefined {
  if (!url) return undefined;
  if (!url.includes("covers.openlibrary.org")) return url;
  return url.replace(/-[SML]\.jpg$/, `-${size}.jpg`);
}

export function getRandomQuery() {
  const words = [
    "Science",
    "Fantasy",
    "Adventure",
    "Mystery",
    "Biography",
    "Travel",
    "Comics",
    "Romance",
    "History",
    "Children",
    "Young adult",
    "Cooking",
    "Music",
    "Technology",
    "Nature",
    "Animals",
    "Space",
    "Friendship",
    "Family",
    "Crime",
    "Humor",
    "Drama",
    "Science fiction",
    "Horror",
    "Magic",
    "Mythology",
    "Education",
  ];
  return words[Math.floor(Math.random() * words.length)];
}
