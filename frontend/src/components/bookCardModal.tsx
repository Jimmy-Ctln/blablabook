import type { BookDisplay } from "@/@types/books";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

type BookCardModalProps = {
  book: BookDisplay;
};

export default function BookCardModal({ book }: BookCardModalProps) {
  return (
    <Card>
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
        <Button className="glass">
          <Plus />
        </Button>
      </CardContent>
    </Card>
  );
}
