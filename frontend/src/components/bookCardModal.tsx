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
    <Card className="cursor-pointer" onClick={() => handleCardClick(book)}>
      <CardContent className="flex justify-between items-center">
        <div className="w-full flex gap-2">
          {book.cover && (
            <img
              src={book.cover}
              width={50}
              height={50}
              className="rounded-xl"
            />
          )}
          <div>
            <h4>{book.title}</h4>
            <span>{book.author}</span>
          </div>
        </div>
        {isInLibrary(book) ? (
          <Check className="text-primary" />
        ) : (
          <Button
            className="glass"
            disabled={addBook.isPending}
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
