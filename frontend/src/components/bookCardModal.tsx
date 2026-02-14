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
      <CardContent>
        <div className="flex">
          <div className="w-full">
            {book.cover && <img src={book.cover} width={30} height={30} />}
          </div>
          <div>
            <h4>{book.title}</h4>
            <span>{book.author}</span>
          </div>
        </div>
        <Button>
          <Plus />
        </Button>
      </CardContent>
    </Card>
  );
}
