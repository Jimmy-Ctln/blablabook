import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useUserBooks } from "@/hooks/useUserBooks";
import SearchBar from "@/components/SearchBar";
import type { BookRow } from "../@types/books";
import { AddBookModal } from "@/components/AddBookModal";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  LayoutGrid,
  Library,
} from "lucide-react";

export default function LibraryPage() {
  const { user } = useAuthStore();
  const userId = user?.id;

  const { books, refetch, removeBook, updateStatus } = useUserBooks(userId);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  const filteredBooks: BookRow[] =
    books?.filter((b: BookRow) => {
      const searchLower = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(searchLower) ||
        (b.author ?? "").toLowerCase().includes(searchLower)
      );
    }) || [];

  const readCount =
    books?.filter((b: BookRow) => b.status === "Lu").length || 0;
  const readingCount =
    books?.filter((b: BookRow) => b.status === "En cours").length || 0;
  const toReadCount =
    books?.filter((b: BookRow) => b.status === "À lire").length || 0;

  return (
    <div className="flex w-full flex-col gap-6 px-4 pb-10 md:px-6">
      <AddBookModal isOpen={open} setOpen={setOpen} />
      <div className="flex flex-col gap-8 mt-12">
        <div className="flex gap-2 ">
          <div className="glass-accent flex h-10 w-10 items-center justify-center rounded-xl">
            <Library className="h-5 w-5 text-primary" />
          </div>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-foreground text-4xl">Ma bibliothèque</h2>
            <Button variant={"secondary"} onClick={() => setOpen(true)}>
              <Plus />
              Ajouter un livre
            </Button>
          </div>
        </div>
        <p className="text-lg w-1/2 text-muted-foreground">
          Gerez votre collection de livres. Filtrez par statut et retrouvez{" "}
          <br />
          facilement vos lectures.
        </p>
      </div>
      <div className="flex items-center mt-6 justify-between">
        <div className="flex flex-col sm:gap-4 sm:flex-row sm:justify-start">
          <Button className="px-3 py-1.5  border-border rounded-md shadow-sm text-foreground">
            <LayoutGrid />
            Tous : <strong>{books?.length || 0}</strong>
          </Button>
          <Button className="px-3 py-1.5  border-border rounded-md shadow-sm text-foreground">
            <BookOpen />
            En cours : <strong>{readingCount}</strong>
          </Button>
          <Button className="px-3 py-1.5  border-border rounded-md shadow-sm text-foreground">
            <Clock /> À lire : <strong>{toReadCount}</strong>
          </Button>
          <Button className="px-3 py-1.5  border-border rounded-md shadow-sm text-foreground">
            <CheckCircle2 />
            Lus : <strong>{readCount}</strong>
          </Button>
        </div>
        <SearchBar onSearch={setSearch} placeholder="Rechercher..." />
      </div>

      <div className="grid mt-8 w-full sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredBooks.length === 0 ? (
          <p
            className="text-muted-foreground text-center"
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
