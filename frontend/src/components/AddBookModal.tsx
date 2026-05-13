import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books";
import type { BooksByCategory } from "@/@types/books";
import type { SearchBooksResponse } from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";
import SearchBar from "./SearchBar";
import { Separator } from "@/components/ui/separator";
import BookCardModal from "./bookCardModal";
import {
  mapBookRowToDisplay,
  mapExternalBookToDisplay,
} from "@/lib/bookDisplayMapper";

type AddBookModalProps = {
  readonly isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function AddBookModal({ isOpen, setOpen }: AddBookModalProps) {
  const [query, setQuery] = useState("");

  const { data: booksByCategory = {} } = useQuery<BooksByCategory>({
    queryKey: ["Allbooks"],
    queryFn: () => getBooks(),
    enabled: isOpen,
  });

  const allBooks = Object.values(booksByCategory).flat();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery("");
    }
    setOpen(nextOpen);
  };

  const {
    data: externalBooksResponse,
    isFetching,
    refetch: refetchExternalBooks,
  } = useQuery<SearchBooksResponse>({
    enabled: false,
    queryKey: ["externalBooks", query],
    queryFn: () =>
      searchExternalBooks({ type: "searchText", searchText: query }),
  });

  const externalBookResult = externalBooksResponse?.books ?? [];

  useEffect(() => {
    if (query.trim().length >= 2) {
      refetchExternalBooks();
    }
  }, [query, refetchExternalBooks]);

  const tenBooks = allBooks.slice(0, 10).map(mapBookRowToDisplay);
  const normalizedQuery = query.trim();
  const isTyping = normalizedQuery.length === 1;
  const hasSearched = normalizedQuery.length >= 2;
  const displayedBooks = hasSearched
    ? externalBookResult.map(mapExternalBookToDisplay)
    : tenBooks;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col p-0 sm:max-w-md"
      >
        {/* Header */}
        <SheetHeader className="shrink-0 space-y-3 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
          <SheetTitle className="flex items-center gap-3 text-foreground font-semibold">
            <div className="glass-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-base leading-tight sm:text-lg">
                Ajouter un livre
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                Recherchez parmi des milliers de livres
              </p>
            </div>
          </SheetTitle>
          <SearchBar
            onSearch={setQuery}
            placeholder="Titre, auteur, ISBN..."
          />
        </SheetHeader>

        <Separator />

        {/* Results */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
          {/* Label */}
          <p className="mb-3 text-xs text-muted-foreground">
            {hasSearched
              ? isFetching
                ? "Recherche en cours…"
                : `${displayedBooks.length} résultat${displayedBooks.length !== 1 ? "s" : ""} pour "${normalizedQuery}"`
              : isTyping
                ? "Continuez à taper…"
                : `${tenBooks.length} suggestions`}
          </p>

          {/* Content */}
          {isTyping ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
              <Search className="h-8 w-8 opacity-30" />
              <p className="text-sm">Entrez au moins 2 caractères</p>
            </div>
          ) : isFetching ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-20 animate-pulse rounded-xl border bg-muted/30"
                />
              ))}
            </div>
          ) : hasSearched && displayedBooks.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-10 text-center">
              <Search className="h-8 w-8 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">
                Aucun résultat pour &quot;{normalizedQuery}&quot;
              </p>
              <p className="text-xs text-muted-foreground/70">
                Essayez un autre titre ou auteur
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayedBooks.map((book) => (
                <BookCardModal
                  key={`${book.isbn ?? "book"}-${book.name}`}
                  book={book}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
