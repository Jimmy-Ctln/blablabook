// LibraryPage displays the user's personal book collection with basic
// filtering, counters by reading status, and a modal to add new books.
// Data is fetched via TanStack Query and updates automatically after mutations.
import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import type { BookRow } from "../@types/books";
import { AddBookModal } from "@/components/AddBookModal";
import { useAuthStore } from "@/stores/authStore";
import { useUserBooks } from "@/hooks/useUserBooks";
import SearchBar from "@/components/SearchBar";

export default function LibraryPage() {
  const { user } = useAuthStore();
  const userId = user?.id;

  // Use custom hook for all book operations
  const { books, refetch, removeBook, updateStatus } = useUserBooks(userId);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Load books when a userId is set (or changes)
  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  // Client-side filtering by title or author
  const filteredBooks: BookRow[] =
    books?.filter((b: BookRow) => {
      const searchLower = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(searchLower) ||
        (b.author ?? "").toLowerCase().includes(searchLower)
      );
    }) || [];

  // Reading status counters for quick stats
  const readCount =
    books?.filter((b: BookRow) => b.status === "Lu").length || 0;
  const readingCount =
    books?.filter((b: BookRow) => b.status === "En cours").length || 0;
  const toReadCount =
    books?.filter((b: BookRow) => b.status === "À lire").length || 0;

  return (
    <div className="flex w-full flex-col gap-6 px-4 pb-10 md:px-6">
      {/* Banner: page title + open AddBook modal */}
      <div className="w-full py-8 rounded-xl shadow-xl bg-card flex flex-col items-center bg-chart-2">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 text-foreground">
          Ma Bibliothèque
        </h1>
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="w-[80%] sm:w-auto whitespace-normal text-center mt-2"
        >
          <Plus size={16} />
          Ajouter un livre
        </Button>
        {/* AddBook modal controlled by `open` state */}
        <AddBookModal
          isOpen={open}
          onClose={() => setOpen(false)}
          userId={userId}
        />
      </div>

      {/* Status: counters by reading status */}
      <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
        <span className="px-3 py-1.5 bg-muted/60 border border-border rounded-md shadow-sm text-foreground bg-primary text-primary-foreground">
          Lus : <strong>{readCount}</strong>
        </span>

        <span className="px-3 py-1.5 bg-muted/60 border border-border rounded-md shadow-sm text-foreground bg-primary text-primary-foreground">
          En cours : <strong>{readingCount}</strong>
        </span>

        <span className="px-3 py-1.5 bg-muted/60 border border-border rounded-md shadow-sm text-foreground bg-primary text-primary-foreground">
          À lire : <strong>{toReadCount}</strong>
        </span>
      </div>

      {/* SearchBar (client-side filtering only) */}
      <SearchBar
        onSearch={setSearch}
        spacingClassName="mt-2 mb-2"
        placeholder="Rechercher dans ma bibliothèque..."
      />

      {/* Books list: show empty state when no results */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.length === 0 ? (
          <p
            className="text-muted-foreground text-center col-span-full"
            role="status"
            aria-live="polite"
          >
            Aucun livre trouvé.
          </p>
        ) : (
          filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRemove={() => removeBook(book.id)}
              onStatusChange={(newStatus) =>
                updateStatus({
                  bookId: book.id,
                  status: newStatus,
                  currentBook: book,
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
