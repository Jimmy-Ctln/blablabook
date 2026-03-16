import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/api/books";
import type { ExternalBook } from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
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
  const [hasSearched, setHasSearched] = useState(false);

  const { data: allBooks = [] } = useQuery({
    queryKey: ["Allbooks"],
    queryFn: () => getBooks(),
    enabled: isOpen,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setQuery("");
      setHasSearched(false);
    }
    setOpen(nextOpen);
  };
  // TanStack Query to look external books
  const {
    data: externalBookResult = [],
    isFetching,
    refetch: refetchExternalBooks,
  } = useQuery<ExternalBook[]>({
    enabled: false, // don't fetch on mount
    queryKey: ["externalBooks", query],
    queryFn: () =>
      searchExternalBooks({ type: "searchText", searchText: query }),
  });

  useEffect(() => {
    if (query.trim().length >= 2) {
      refetchExternalBooks();
      setHasSearched(true);
    } else if (query.trim().length === 0) {
      setHasSearched(false);
    }
  }, [query, refetchExternalBooks]);

  const tenBooks = allBooks.slice(0, 10).map(mapBookRowToDisplay);
  const normalizedQuery = query.trim();
  const showExternalResults = hasSearched && normalizedQuery.length > 0;
  const displayedBooks = showExternalResults
    ? externalBookResult.map(mapExternalBookToDisplay)
    : tenBooks;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-none overflow-hidden rounded-3xl border p-0 text-foreground sm:w-[calc(100vw-3rem)] sm:max-w-2xl lg:max-w-3xl">
        <div className="flex max-h-[84dvh] min-h-[65dvh] flex-col bg-background sm:min-h-144">
          <DialogHeader className="space-y-3 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
            <DialogTitle className="flex items-start gap-3 text-foreground font-semibold">
              <div className="glass-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg leading-tight sm:text-xl">
                  Ajouter un livre
                </h3>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Recherchez et ajoutez des livres a votre bibliotheque.
                </p>
              </div>
            </DialogTitle>
            <SearchBar
              onSearch={setQuery}
              placeholder="Titre, auteur, ISBN..."
            />
          </DialogHeader>

          <Separator />

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <span className="text-xs text-muted-foreground sm:text-sm">
              {showExternalResults
                ? `Resultats pour "${normalizedQuery}"`
                : `${tenBooks.length} suggestions de livres`}
            </span>

            <div className="mt-4 min-h-72 space-y-3 sm:min-h-80">
              {isFetching ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-24 animate-pulse rounded-xl border bg-muted/30"
                  />
                ))
              ) : !isFetching &&
                showExternalResults &&
                displayedBooks.length === 0 ? (
                <div className="flex h-full min-h-72 items-center justify-center rounded-xl border border-dashed px-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Aucun livre trouve. Essayez un autre mot-cle.
                  </p>
                </div>
              ) : (
                displayedBooks.map((book) => (
                  <BookCardModal
                    key={`${book.isbn ?? "book"}-${book.name}`}
                    book={book}
                  />
                ))
              )}
            </div>
          </div>

          <Separator />
          <DialogFooter className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
            <span className="w-full text-xs text-muted-foreground sm:text-sm">
              Parcourez le catalogue pour enrichir votre collection.
            </span>
            <Button className="w-full sm:w-auto" onClick={() => setOpen(false)}>
              Terminer
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
