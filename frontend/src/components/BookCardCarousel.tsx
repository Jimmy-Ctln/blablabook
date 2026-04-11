import type { BookDisplay } from "@/@types/books";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "@tanstack/react-router";

export default function BookCardCarousel({
  book,
}: {
  readonly book: BookDisplay;
}) {
  const router = useRouter();

  return (
    <Card
      className="flex flex-col rounded-3xl h-full p-0 cursor-pointer"
      onClick={() =>
        book.isbn &&
        router.navigate({
          to: "/books/$isbn",
          params: { isbn: book.isbn },
        })
      }
      role="article"
    >
      <CardContent className="w-full h-full items-center p-0">
        <img
          src={book.cover_url || book.cover}
          alt={`Couverture de ${book.name}`}
          width="128"
          height="192"
          className="h-full w-full object-cover rounded-3xl"
        />
      </CardContent>
    </Card>
  );
}
