import type { SeeAllPageProps } from "@/@types/seeAllPageProps";
import BookCardCarousel from "@/components/BookCardCarousel";
import SearchBar from "@/components/SearchBar";
import { seeAllRoute } from "@/routes/routes";
import { useMemo, useState } from "react";
import type { BookDisplay } from "@/@types/books";

export default function SeeAllPage() {
  const searchParams = seeAllRoute.useSearch() as SeeAllPageProps;
  const title = searchParams.title;

  const [query, setQuery] = useState("");

  const booksDisplay: BookDisplay[] = searchParams.books ?? [];

  const filteredBooksDisplay = useMemo(() => {
    if (!query.trim()) return booksDisplay;
    const lowerQuery = query.toLowerCase();
    return booksDisplay.filter(
      (book) =>
        book.title?.toLowerCase().includes(lowerQuery) ||
        book.author?.toLowerCase().includes(lowerQuery),
    );
  }, [booksDisplay, query]);

  let content;
  if (filteredBooksDisplay.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooksDisplay.map((book) => (
          <BookCardCarousel key={book.key} book={book} />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="text-center text-gray-500 py-12">
        Aucun résultat trouvé.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-center flex flex-col rounded-4xl">
      <div className="sticky top-0">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <SearchBar onSearch={setQuery} />
        </div>
      </div>
      <div className="flex-1 min-h-0 max-w-5xl mx-auto w-full px-4 py-6">
        {content}
      </div>
    </div>
  );
}
