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
import SearchBar from "@/components/SearchBar";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import SearchResultsSkeleton from "@/components/SearchResultsSkeleton";
import notFound from "@/assets/not-found.svg";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>("");
  const categories = [
    "science-fiction",
    "fantasy",
    "aventure",
    "romance",
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

  // Search external books with pagination
  const {
    data: externalSearchResults = [],
    isFetching: isSearchFetching,
    error: searchError,
    numFound,
    hasMore,
    hasReceivedData,
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
          Résultats de recherche pour "{searchText}" ({numFound} résultats)
        </h2>

        {searchError && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Erreur lors de la recherche. Veuillez réessayer.</p>
          </div>
        )}

        {/* Show loading state with skeleton (while fetching and no results yet) */}
        {isSearchFetching && externalSearchResults.length === 0 && (
          <SearchResultsSkeleton />
        )}

        {/* Show results as they come in with skeleton loaders */}
        {externalSearchResults.length > 0 && (
          <div className="space-y-4">
            <CarouselDisplay
              title="Résultats"
              books={externalSearchResults.map((book) => ({
                ...mapExternalBookToDisplay(book),
                editionCount: book.editionCount,
              }))}
              isLoading={isSearchFetching}
            />

            {/* Load More Button - Navigate to full search page */}
            {hasMore && !isSearchFetching && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() =>
                    navigate({ to: "/search", search: { q: searchText } })
                  }
                  disabled={isSearchFetching}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSearchFetching ? "Chargement..." : "Voir plus résultats"}
                </button>
              </div>
            )}
          </div>
        )}

        {hasReceivedData &&
          !isSearchFetching &&
          !searchError &&
          externalSearchResults.length === 0 && (
            <div className="w-full mx-auto my-8 px-8">
              <h2 className="text-xl font-bold text-foreground">Résultats</h2>
              <div className="mt-4 min-h-80 flex flex-col items-center justify-center gap-4 rounded-xl bg-muted/30">
                <img
                  src={notFound}
                  alt="Aucun résultat"
                  className="w-40 h-40 opacity-80"
                />
                <div className="text-center">
                  <p className="text-base font-semibold text-foreground">
                    Aucun livre trouvé pour "{searchText}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Essayez avec d'autres mots-clés ou un titre différent
                  </p>
                </div>
              </div>
            </div>
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
      <div className="relative z-20 -mt-32 md:-mt-28 lg:-mt-32 container mx-auto px-4 sm:px-6 md:px-8">
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <SearchBar
            placeholder="Rechercher un livre..."
            onSearch={setSearchText}
          />
        </div>

        {content}
      </div>
    </div>
  );
}
