// AddBookModal lets the user search books from the external API,
// preview results, navigate to details, or add a book directly
// to their library. Uses TanStack Query for fetching and mutation.
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { Loader } from "@/components/Loader";

import { useQuery } from "@tanstack/react-query";
import { getUserBooks } from "@/api/books";
import type { ExternalBook } from "@/@types/externalBooks";
import { searchExternalBooks } from "@/api/externalBooks";
import { useAddBook } from "@/hooks/useAddBook";

type AddBookModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userId?: number;
};

export function AddBookModal({ isOpen, onClose, userId }: AddBookModalProps) {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  // User's current library, used to mark items already added
  const { data: userBooks = [] } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId!),
    enabled: !!userId,
  });

  // Mutation hook to add a book to the user's list
  const addBookMutation = useAddBook(userId);

  // Reset query and results when modal closes
  const handleClose = () => {
    setQuery("");
    setHasSearched(false);
    onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl lg:max-w-3xl h-full sm:h-auto p-6 overflow-y-auto w-full py-8 rounded-xl bg-chart-2">
        <DialogDescription className="sr-only">
          Rechercher un livre.
        </DialogDescription>

        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-semibold">
            Rechercher un livre
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4 mt-2">
          <Input
            placeholder="Nom du livre, auteur..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (hasSearched) setHasSearched(false);
            }}
            className="flex-1 bg-white shadow-sm focus:ring-2 rounded-xl "
          />

          <Button onClick={handleSearch} className="shadow">
            <Search size={18} />
            Rechercher
          </Button>
        </div>

        {isFetching && <Loader className="text-sm" />}

        {/* Empty state: show message only after an explicit search */}
        {!isFetching && hasSearched && results.length === 0 && (
          <p className="mt-4 text-sm text-gray-600">Aucun livre trouvé.</p>
        )}

        <div className="max-h-[500px] overflow-y-auto mt-4 pr-4">
          {results.map((book) => {
            const alreadyInLibrary = isInLibrary(book);

            // Keyboard support for the whole clickable row (Enter/Space)
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCardClick(book);
              }
            };

            return (
              // Use a div with role=button to avoid nesting a button inside a button
              <div
                key={book.key}
                role="button"
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
                  <button
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
                  </button>
                )}

                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`Couverture de ${book.title}`}
                    className="w-20 h-32 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-32 bg-gray-200 rounded flex-shrink-0" />
                )}

                <div>
                  <p className="font-semibold text-lg">{book.title}</p>
                  <p className="text-sm text-gray-600">
                    {book.author || "Unknown"}
                  </p>
                  {book.publishDate && (
                    <p className="text-xs text-gray-500">{book.publishDate}</p>
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
