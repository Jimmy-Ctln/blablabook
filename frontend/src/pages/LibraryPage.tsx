import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import {
  Plus,
  BookOpen,
  Clock,
  CheckCircle2,
  LayoutGrid,
  Library,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useUserBooks } from "@/hooks/useUserBooks";
import SearchBar from "@/components/SearchBar";
import type { BookDisplay } from "../@types/books";
import { AddBookModal } from "@/components/AddBookModal";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type FilterStatus = "all" | "En cours" | "À lire" | "Lu";

export default function LibraryPage() {
  const { user } = useAuthStore();
  const userId = user?.id;

  const { books, refetch, removeBook, updateStatus } = useUserBooks(userId);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  const filteredBooks: BookDisplay[] =
    books?.filter((b: BookDisplay) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        b.name.toLowerCase().includes(searchLower) ||
        (b.author ?? "").toLowerCase().includes(searchLower);
      const matchesFilter = activeFilter === "all" || b.status === activeFilter;
      return matchesSearch && matchesFilter;
    }) || [];

  const readCount =
    books?.filter((b: BookDisplay) => b.status === "Lu").length || 0;
  const readingCount =
    books?.filter((b: BookDisplay) => b.status === "En cours").length || 0;
  const toReadCount =
    books?.filter((b: BookDisplay) => b.status === "À lire").length || 0;
  const totalCount = books?.length || 0;

  const stats = [
    {
      label: "Total",
      count: totalCount,
      icon: LayoutGrid,
      status: "all" as FilterStatus,
    },
    {
      label: "En cours",
      count: readingCount,
      icon: BookOpen,
      status: "En cours" as FilterStatus,
    },
    {
      label: "À lire",
      count: toReadCount,
      icon: Clock,
      status: "À lire" as FilterStatus,
    },
    {
      label: "Lus",
      count: readCount,
      icon: CheckCircle2,
      status: "Lu" as FilterStatus,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <AddBookModal isOpen={open} setOpen={setOpen} />

      <div className="container px-6 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10">
        {/* En-tête principal */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex glass-accent h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <Library className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Ma bibliothèque
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  {totalCount} livre{totalCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="shrink-0 gap-2 rounded-lg h-10 sm:h-11"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </Button>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez votre collection et suivez vos lectures
          </p>
        </div>

        {/* Statistiques - Stats cards */}
        <div className="flex gap-2 sm:gap-3 mb-8 flex-wrap">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isActive = activeFilter === stat.status;
            return (
              <button
                key={stat.status}
                onClick={() => setActiveFilter(stat.status)}
                className={`flex flex-col items-center justify-center rounded-lg transition-all duration-200 h-20 w-20 sm:h-24 sm:w-24 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary/50 text-foreground border border-border/50 hover:bg-secondary hover:border-primary/30"
                }`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                <span className="text-lg sm:text-xl font-bold">
                  {stat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recherche */}
        <div className="mb-8">
          <SearchBar
            onSearch={setSearch}
            placeholder="Rechercher par titre ou auteur..."
          />
        </div>

        <Separator className="mb-8" />

        {/* Grille de livres */}
        <div className="w-full">
          {filteredBooks.length === 0 ? (
            <Card className="col-span-full p-8 sm:p-12 text-center rounded-2xl border-dashed">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    {totalCount === 0
                      ? "Votre bibliothèque est vide"
                      : "Aucun livre ne correspond"}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    {totalCount === 0
                      ? "Ajoutez des livres pour commencer votre aventure de lecture."
                      : "Essayez une autre recherche ou modifiez les filtres."}
                  </p>
                  {totalCount === 0 && (
                    <Button
                      onClick={() => setOpen(true)}
                      className="gap-2 rounded-lg"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter un livre
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredBooks.map((book) => (
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
