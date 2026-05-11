import CarouselDisplay from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import { getBooks, getRandomBooks } from "@/api/books";
import type { BookRow, BooksByCategory } from "@/@types/books";
import {
  mapBookRowToDisplay,
  mapExternalBookToDisplay,
} from "@/lib/bookDisplayMapper";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Loader } from "@/components/Loader";

export default function HomePage() {
  const [searchText, setSearchText] = useState<string>("");
  const categories = [
    "aventure",
    "romance",
    "fantasy",
    "science-fiction",
    "horreur",
  ];

  const { data: randomBooks = [], isLoading: isLoadingRandom } = useQuery<
    BookRow[]
  >({
    queryKey: ["random-books"],
    queryFn: () => getRandomBooks(20),
    staleTime: 0,
    gcTime: 0,
  });

  const { data: books = {}, isFetching } = useQuery<BooksByCategory>({
    queryKey: ["books-carousel"],
    queryFn: () => getBooks(categories),
  });

  // Search external books
  const {
    data: externalSearchResults = [],
    isLoading: isSearching,
    error: searchError,
  } = useExternalBooks({
    mode: "search",
    param: searchText,
    enabled: searchText.length > 0,
  });

  // Ensure randomBooks is always an array
  const randomBooksArray = Array.isArray(randomBooks) ? randomBooks : [];

  const content = searchText ? (
    // Display search results
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Résultats de recherche pour "{searchText}"
        </h2>

        {isSearching && (
          <div className="flex justify-center py-8">
            <Loader text="Recherche en cours..." size="md" />
          </div>
        )}

        {searchError && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Erreur lors de la recherche. Veuillez réessayer.</p>
          </div>
        )}

        {!isSearching && !searchError && externalSearchResults.length === 0 && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-muted-foreground">
              Aucun livre trouvé pour "{searchText}"
            </p>
          </div>
        )}

        {!isSearching && !searchError && externalSearchResults.length > 0 && (
          <CarouselDisplay
            title="Résultats"
            books={externalSearchResults.map(mapExternalBookToDisplay)}
            isLoading={false}
          />
        )}
      </div>
    </div>
  ) : (
    // Display carousels when no search
    <>
      <CarouselDisplay
        title={"SUGGESTIONS ALEATOIRE"}
        books={randomBooksArray.map(mapBookRowToDisplay)}
        isLoading={isLoadingRandom || randomBooksArray.length === 0}
      />

      {categories.map((categoryTitle) => {
        const categoryKey = categoryTitle.toLowerCase();
        const title = categoryTitle.toUpperCase();
        const categoryBooks = books[categoryKey] ?? [];
        const isLoading = isFetching || categoryBooks.length === 0;

        return (
          <CarouselDisplay
            key={categoryTitle}
            title={title}
            books={categoryBooks.map(mapBookRowToDisplay)}
            isLoading={isLoading}
          />
        );
      })}
    </>
  );

  return (
    <div className="w-full">
      <Hero />
      <div className="relative z-20 -mt-20 md:-mt-16 lg:-mt-20 container mx-auto px-4 sm:px-6 md:px-8">
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <Input
            type="text"
            placeholder="Rechercher un livre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {content}
      </div>
    </div>
  );
}
