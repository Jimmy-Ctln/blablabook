import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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

  const { data: Allbooks = [] } = useQuery({
    queryKey: ["Allbooks"],
    queryFn: () => getBooks(),
    enabled: isOpen,
  });

  const handleOpenChange = () => {
    if (!open) {
      setQuery("");
      setHasSearched(false);
    }
    setOpen(false);
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

  const tenBooks = Allbooks.slice(0, 10).map(mapBookRowToDisplay);

  let content;
  if (hasSearched && query.length > 0) {
    content = (
      <div className="mt-6 flex flex-col gap-4">
        {externalBookResult.map(mapExternalBookToDisplay).map((book) => (
          <BookCardModal book={book} />
        ))}
      </div>
    );
  } else {
    content = tenBooks.map((book) => <BookCardModal book={book} />);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="mx-auto max-h-210 rounded-4xl text-foreground lg:max-w-3xl h-full sm:h-auto">
        <DialogHeader className="">
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
          <SearchBar onSearch={setQuery} />
        </DialogHeader>
        <Separator />

        <div className="max-h-110 overflow-y-auto">
          <span className="text-muted-foreground text-sm">
            {hasSearched && query.length > 0
              ? `Résultat pour "${query}"`
              : `${tenBooks.length} proposition de livre`}
          </span>
          <div className="mt-6 flex flex-col gap-4">{content}</div>
        </div>

        {isFetching && <Loader className="text-sm" />}

        {!isFetching && hasSearched && externalBookResult.length === 0 && (
          <p className="mt-4 text-sm text-gray-600 w-full">
            Aucun livre trouvé.
          </p>
        )}

        <Separator />
        <DialogFooter className="flex items-center">
          <span className="w-full text-sm text-muted-foreground">
            Parcourez le catalogue pour enrichir votre collection
          </span>
          <Button onClick={() => handleOpenChange()}>Terminer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
