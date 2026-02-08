import type { BookDisplay } from "@/@types/books";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useRouter } from "@tanstack/react-router";

export default function BookCardCarousel({
  book,
}: {
  readonly book: BookDisplay;
}) {
  const router = useRouter();

  return (
    <Card
      className="flex flex-col bg-chart-2 items-center rounded-xl gap-0 overflow-hidden shadow w-full h-full p-0 min-h-96 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2"
      onClick={() =>
        book.isbn &&
        router.navigate({
          to: "/books/$isbn",
          params: { isbn: book.isbn },
        })
      }
      role="article"
    >
      <CardHeader className="w-full flex flex-col items-center p-4">
        {"cover" in book && book.cover ? (
          <img
            src={book.cover}
            alt={`Couverture de ${book.title}`}
            width="128"
            height="192"
            className="h-48 w-32 object-cover mb-2 rounded shadow"
            style={{ maxHeight: "12rem", minHeight: "12rem" }}
          />
        ) : (
          <div className="h-48 w-32 bg-gray-200 flex items-center justify-center rounded mb-1">
            <span className="text-xs text-gray-500">No cover</span>
          </div>
        )}
        <CardTitle className="font-bold text-base mb-1 text-center line-clamp-2">
          {"title" in book ? book.title : ""}
        </CardTitle>
        <CardDescription className="text-sm text-gray-700 text-center line-clamp-1">
          {book.author ? book.author : "Auteur inconnu"}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center px-4 pb-0">
        <p className="text-xs text-gray-500 mb-1 text-center">
          {"publishDate" in book && book.publishDate
            ? `Première publication : ${book.publishDate}`
            : ""}
        </p>
      </CardContent>
    </Card>
  );
}
