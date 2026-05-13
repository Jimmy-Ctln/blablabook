import type { BookDisplay } from "@/@types/books";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, Check, Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { getUserBooks } from "@/api/books";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAddBook } from "@/hooks/useAddBook";
import { Loader } from "./Loader";

type BookCardModalProps = {
  book: BookDisplay;
};

export default function BookCardModal({ book }: BookCardModalProps) {
  const navigate = useNavigate();

  const currentUser = useCurrentUser();
  const userId = currentUser.data?.id;

  const { data: userBooksData } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId!),
    enabled: !!userId,
  });

  const userBooks = userBooksData?.books ?? [];

  const handleCardClick = (book: BookDisplay) => {
    navigate({ to: `/books/${book.isbn}` });
  };

  const isInLibrary = (book: BookDisplay) => {
    if (!book.isbn?.length) return false;
    return userBooks.some((b) => book.isbn?.includes(b.isbn));
  };

  const addBook = useAddBook(userId);
  const inLibrary = isInLibrary(book);

  return (
    <Card
      className="cursor-pointer border bg-background/80 transition-all hover:border-primary/40 hover:shadow-sm active:scale-[0.99]"
      onClick={() => handleCardClick(book)}
    >
      <CardContent className="flex items-center gap-3 p-3">
        {/* Cover */}
        <div className="shrink-0">
          {book.cover ? (
            <img
              src={book.cover}
              alt={`Couverture de ${book.name}`}
              className="h-16 w-11 rounded-md object-cover sm:h-18 sm:w-12.5"
            />
          ) : (
            <div className="flex h-16 w-11 items-center justify-center rounded-md bg-muted sm:h-18 sm:w-12.5">
              <BookOpen className="h-5 w-5 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
            {book.name}
          </h4>
          <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
            {book.author ?? "Auteur inconnu"}
          </p>
          {book.categories?.length ? (
            <span className="mt-1.5 inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {book.categories[0]}
            </span>
          ) : null}
        </div>

        {/* Action */}
        <div className="shrink-0">
          {inLibrary ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-4 w-4 text-primary" data-testid="check-icon" />
            </div>
          ) : (
            <Button
              className="h-9 w-9 rounded-full p-0"
              disabled={addBook.isPending}
              aria-label="Ajouter à la bibliothèque"
              onClick={(e) => {
                e.stopPropagation();
                addBook.mutate(book);
              }}
            >
              {addBook.isPending ? <Loader text="" /> : <Plus className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
