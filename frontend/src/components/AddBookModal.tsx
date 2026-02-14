import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Plus } from "lucide-react";
import { Loader } from "@/components/Loader";

import { useQuery } from "@tanstack/react-query";
import { getBooks, getUserBooks } from "@/api/books";
import type { ExternalBook } from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";
import { useAddBook } from "@/hooks/useAddBook";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import BookCardModal from "./bookCardModal";
import { mapBookRowToDisplay } from "@/lib/bookDisplayMapper";

type AddBookModalProps = {
  readonly isOpen: boolean;
  readonly onClose?: () => void;
  readonly userId?: number;
};

export function AddBookModal({ isOpen, userId }: AddBookModalProps) {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: userBooks = [] } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId!),
    enabled: !!userId,
  });

  const { data: Allbooks = [] } = useQuery({
    queryKey: ["Allbooks"],
    queryFn: () => getBooks(),
    enabled: isOpen,
  });

  // Mutation hook to add a book to the user's list
  const addBookMutation = useAddBook(userId);

  // Reset query and results when modal closes
  const handleClose = () => {
    setQuery("");
    setHasSearched(false);
  };

  // TanStack Query to look for books
  const {
    data: results = [],
    isFetching,
    refetch,
  } = useQuery<ExternalBook[]>({
    enabled: false, // don't fetch on mount
    queryKey: ["externalBooks", query],
    queryFn: () =>
      searchExternalBooks({ type: "searchText", searchText: query }),
  });

  // Trigger a search only when input is non-empty
  const handleSearch = () => {
    if (!query.trim()) return;
    setHasSearched(true);
    refetch();
  };

  const navigate = useNavigate();

  // Navigate to internal book details page using the ISBN
  const handleCardClick = (book: ExternalBook) => {
    if (!book.isbn) return;
    navigate({ to: `/books/${book.isbn}` });
  };

  // Check if a book result is already in the library
  const isInLibrary = (externalBook: ExternalBook) => {
    if (!externalBook.isbn?.length) return false;

    return userBooks.some((b) => externalBook.isbn.includes(b.isbn));
  };

  const tenBooks = Allbooks.slice(0, 10).map(mapBookRowToDisplay);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="mx-auto max-h-210 overflow-y-auto rounded-4xl text-foreground lg:max-w-3xl h-full sm:h-auto">
        <DialogHeader>
          <DialogTitle className="flex gap-2 text-xl mb-4 text-foreground font-semibold">
            <div className="glass-accent flex h-10 w-10 items-center justify-center rounded-xl">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col gap-2">
              <h3>Ajouter un livre</h3>
              <p className="text-sm text-muted-foreground">
                Recherchez et ajoutez des livres a votre bibliotheque
              </p>
            </div>
          </DialogTitle>
          <SearchBar onSearch={handleSearch} />
        </DialogHeader>

        <Separator />

        <div>
          <span className="text-muted-foreground text-sm">
            {Allbooks.length} livres disponible
          </span>
          <div className="mt-6 flex flex-col gap-4">
            {tenBooks.map((book) => (
              <BookCardModal book={book} />
            ))}
          </div>
        </div>

        {isFetching && <Loader className="text-sm" />}

        {!isFetching && hasSearched && results.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">Aucun livre trouvé.</p>
        )}

        <div className="max-h-125 overflow-y-auto mt-4 pr-4">
          {results.map((book) => {
            const alreadyInLibrary = isInLibrary(book);

            // Keyboard support for the whole clickable row (Enter/Space)
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCardClick(book);
              }
            };

            return (
              <div
                key={book.key}
                tabIndex={0}
                onClick={() => handleCardClick(book)}
                onKeyDown={handleKeyDown}
                className={`
                  relative w-full bg-white flex items-center gap-4
                  mb-4 p-3 border rounded-xl shadow-sm text-left
                  focus-visible:ring-2 focus-visible:ring-offset-2
                  transition-transform hover:scale-101 cursor-pointer
                  ${alreadyInLibrary ? "opacity-60" : ""}
                `}
              >
                {/* ✔️ Already in library */}
                {alreadyInLibrary && (
                  <Check
                    data-testid="check-icon"
                    className="absolute top-2 right-2 text-green-600"
                    size={22}
                  />
                )}

                {/* ➕ Add to library */}
                {!alreadyInLibrary && (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addBookMutation.mutate(book);
                    }}
                    className="
                      absolute top-2 right-2 border
                      flex items-center justify-center
                      rounded-full
                      sm:flex w-8 h-8 hover:bg-primary hover:text-secondary
                    "
                    aria-label="Ajouter à la librairie"
                  >
                    +
                  </Button>
                )}

                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`Couverture de ${book.title}`}
                    className="w-20 h-32 object-cover rounded shrink-0"
                  />
                ) : (
                  <div className="w-20 h-32 rounded shrink-0" />
                )}

                <div>
                  <p className="font-semibold text-lg">{book.title}</p>
                  <p className="text-sm ">{book.author || "Unknown"}</p>
                  {book.publishDate && (
                    <p className="text-xs ">{book.publishDate}</p>
                  )}
                  {book.categories && book.categories.length > 0 && (
                    <span className="inline-block mt-2 px-3 py-1.5 text-xs font-semibold rounded-full border">
                      {book.categories[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
