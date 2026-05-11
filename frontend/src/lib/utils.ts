import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
