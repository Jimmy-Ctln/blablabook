import type { BookDisplay } from "./books";

export type CarouselProps = {
  title: string;
  books: BookDisplay[];
  isLoading: boolean;
  seeAllButton?: boolean;
  mode?: "random" | "category";
  categoryName?: string;
};
