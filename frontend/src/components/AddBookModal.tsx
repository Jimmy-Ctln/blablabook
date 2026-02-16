import { useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
  setOpen: Dispatch<SetStateAction<boolean>>;
  readonly userId?: number;
};

export function AddBookModal({ isOpen, setOpen, userId }: AddBookModalProps) {
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

  const handleOpenChange = () => {
    if (!open) {
      setQuery("");
      setHasSearched(false);
    }
    setOpen(false);
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="mx-auto max-h-210 rounded-4xl text-foreground lg:max-w-3xl h-full sm:h-auto">
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

        <div className="max-h-110 overflow-y-auto">
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

        <Separator />
        <DialogFooter className="flex items-center">
          <span className="w-full text-sm text-muted-foreground">
            Parcourez le catalogue pour enrichir votre collection
          </span>
          <Button onClick={() => handleOpenChange}>Terminer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
