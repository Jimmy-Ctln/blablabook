import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useUserBooks } from "@/hooks/useUserBooks";
import SearchBar from "@/components/SearchBar";
import type { BookDisplay } from "../@types/books";
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

  const filteredBooks: BookDisplay[] =
    books?.filter((b: BookDisplay) => {
      const searchLower = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(searchLower) ||
        (b.author ?? "").toLowerCase().includes(searchLower)
      );
    }) || [];

  const readCount =
    books?.filter((b: BookDisplay) => b.status === "Lu").length || 0;
  const readingCount =
    books?.filter((b: BookDisplay) => b.status === "En cours").length || 0;
  const toReadCount =
    books?.filter((b: BookDisplay) => b.status === "À lire").length || 0;

  return (
    <div className="flex w-full flex-col gap-5 px-4 pb-10 md:px-6">
      <AddBookModal isOpen={open} setOpen={setOpen} />

      {/* En-tête */}
      <div className="flex flex-col gap-3 mt-6 md:mt-12">
        <div className="flex items-center gap-2">
          <div className="glass-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Library className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl">
            Ma bibliothèque
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-prose">
            Gérez votre collection de livres. Filtrez par statut et retrouvez
            facilement vos lectures.
          </p>
          <Button
            variant={"secondary"}
            onClick={() => setOpen(true)}
            className="w-full sm:w-auto shrink-0"
          >
            <Plus />
            Ajouter un livre
          </Button>
        </div>
      </div>

      {/* Filtres + recherche */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button className="px-3 py-1.5 border-border rounded-md shadow-sm text-foreground">
            <LayoutGrid />
            Tous : <strong>{books?.length || 0}</strong>
          </Button>
          <Button className="px-3 py-1.5 border-border rounded-md shadow-sm text-foreground">
            <BookOpen />
            En cours : <strong>{readingCount}</strong>
          </Button>
          <Button className="px-3 py-1.5 border-border rounded-md shadow-sm text-foreground">
            <Clock /> À lire : <strong>{toReadCount}</strong>
          </Button>
          <Button className="px-3 py-1.5 border-border rounded-md shadow-sm text-foreground">
            <CheckCircle2 />
            Lus : <strong>{readCount}</strong>
          </Button>
        </div>
        <div className="w-full md:max-w-xs">
          <SearchBar onSearch={setSearch} placeholder="Rechercher..." />
        </div>
      </div>

      {/* Grille de livres */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredBooks.length === 0 ? (
          <p
            className="col-span-full text-muted-foreground text-center py-10"
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
              onRemove={() => {
                if (book.internalId !== undefined) {
                  removeBook(book.internalId);
                }
              }}
              onStatusChange={(newStatus) => {
                if (book.internalId !== undefined) {
                  updateStatus({
                    bookId: book.internalId,
                    status: newStatus,
                    currentBook: book,
                  });
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
