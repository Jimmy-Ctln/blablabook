import { useSearch } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { mapExternalBookToDisplay } from "@/lib/bookDisplayMapper";
import BookCardCarousel from "@/components/BookCardCarousel";
import { Loader } from "@/components/Loader";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type SearchParams = {
  q?: string;
};

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: "/search" }) as SearchParams;
  const searchText = searchParams.q || "";

  const {
    data: externalSearchResults = [],
    isLoading: isSearching,
    isFetching: isSearchFetching,
    error: searchError,
    numFound,
    hasMore,
    handleLoadMore,
    hasReceivedData,
  } = useExternalBooks({
    mode: "search",
    param: searchText,
    enabled: searchText.length >= 3,
  });

  if (!searchText) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Pas de recherche fournie</p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        {/* Header */}
        <div className="flex-col">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Résultats de recherche
            </h1>
            <p className="text-muted-foreground">
              "{searchText}" • {numFound.toLocaleString("fr-FR")} résultats
              trouvés
            </p>
          </div>
        </div>

        {/* Error State */}
        {searchError && (
          <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive mb-8">
            <AlertCircle className="h-5 w-5" />
            <p>Erreur lors de la recherche. Veuillez réessayer.</p>
          </div>
        )}

        {/* Loading State */}
        {!hasReceivedData && (isSearching || isSearchFetching) && (
          <div className="flex justify-center py-16">
            <Loader text="Recherche en cours..." size="lg" />
          </div>
        )}

        {/* Results Grid */}
        {externalSearchResults.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {externalSearchResults.map((book) => (
                <BookCardCarousel
                  key={book.isbn}
                  book={mapExternalBookToDisplay(book)}
                />
              ))}
            </div>

            {/* Skeleton Loaders while fetching */}
            {isSearchFetching && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="aspect-3/4 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isSearchFetching}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSearchFetching
                    ? "Chargement..."
                    : "Charger plus de résultats"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isSearching &&
          !isSearchFetching &&
          !searchError &&
          hasReceivedData &&
          externalSearchResults.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Aucun livre trouvé pour "{searchText}"
                </p>
                <button
                  onClick={() => navigate({ to: "/" })}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à l'accueil
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
