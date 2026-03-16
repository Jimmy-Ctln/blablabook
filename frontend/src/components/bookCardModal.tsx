import type { BookDisplay } from "@/@types/books";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";
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

  const { data: userBooks = [] } = useQuery({
    queryKey: ["userBooks", userId],
    queryFn: () => getUserBooks(userId!),
    enabled: !!userId,
  });

  // Navigate to internal book details page using the ISBN
  const handleCardClick = (book: BookDisplay) => {
    navigate({ to: `/books/${book.isbn}` });
  };

  // Check if a book result is already in the library
  const isInLibrary = (book: BookDisplay) => {
    if (!book.isbn?.length) return false;
    return userBooks.some((b) => book.isbn?.includes(b.isbn));
  };

  // Mutation hook to add a book to the user's list
  const addBook = useAddBook(userId);

  return (
    <Card
      className="cursor-pointer border bg-background/80 transition hover:border-primary/40"
      onClick={() => handleCardClick(book)}
    >
      <CardContent className="flex items-start justify-between gap-3 p-3 sm:items-center sm:p-4">
        <div className="flex w-full min-w-0 gap-3">
          {book.cover && (
            <img
              src={book.cover}
              alt={`Couverture de ${book.name}`}
              width={50}
              height={72}
              className="h-18 w-13 shrink-0 rounded-lg object-cover"
            />
          )}
          <div className="min-w-0">
            <h4 className="line-clamp-2 text-sm font-semibold leading-tight sm:text-base">
              {book.name}
            </h4>
            <span className="mt-1 block truncate text-xs text-muted-foreground sm:text-sm">
              {book.author}
            </span>
            {book.categories?.length ? (
              <span className="mt-2 inline-flex rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground sm:text-xs">
                {book.categories[0]}
              </span>
            ) : null}
          </div>
        </div>
        {isInLibrary(book) ? (
          <Check
            className="mt-1 shrink-0 text-primary sm:mt-0"
            data-testid="check-icon"
          />
        ) : (
          <Button
            className="glass h-9 w-9 shrink-0 p-0"
            disabled={addBook.isPending}
            aria-label="Ajouter a la bibliotheque"
            onClick={(e) => {
              e.stopPropagation();
              addBook.mutate(book);
            }}
          >
            {addBook.isPending ? <Loader text="" /> : <Plus />}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
