// BookCard renders a single book in the user's library with a cover,
// optional status badge, basic metadata, and a delete action.
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, ChevronDown } from "lucide-react";
import type { BookDisplay } from "../@types/books";
import { useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";

type Props = {
  readonly book: BookDisplay;
  readonly onRemove: () => void;
  readonly onStatusChange?: (newStatus: "Lu" | "En cours" | "À lire") => void;
};

export function BookCard({ book, onRemove, onStatusChange }: Props) {
  const statuses: Array<"Lu" | "En cours" | "À lire"> = [
    "À lire",
    "En cours",
    "Lu",
  ];

  const router = useRouter();

  function goToBookDetails() {
    router.navigate({
      to: "/books/$isbn",
      params: { isbn: book.isbn },
    });
  }

  const renderStatusBadge = () => {
    if (!book.status) return null;

    if (onStatusChange) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow bg-chart-2 glass transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label={`Statut de lecture: ${book.status}. Cliquer pour changer`}
            >
              {book.status}
              <ChevronDown size={12} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(status);
                }}
                className="cursor-pointer"
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Static badge
    return (
      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow bg-chart-2 text-foreground">
        {book.status}
      </span>
    );
  };

  return (
    <div
      className="w-full max-w-sm min-h-115 transform hover:scale-101 transition-transform duration-500 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 rounded-xl"
      onClick={() => goToBookDetails()}
      role="article"
    >
      <Card className="w-full shadow-lg relative rounded-xl overflow-hidden p-0 gap-2 flex flex-col h-full bg-chart-2">
        <div className="relative shrink-0">
          {book.cover ? (
            <img
              src={book.cover}
              alt={`Couverture de ${book.name}`}
              width="320"
              height="192"
              className="w-full h-78 object-cover"
            />
          ) : (
            <div className="bg-gray-200 w-full h-56 animate-pulse" />
          )}

          {book.categories && book.categories.length > 0 && (
            <span className="absolute bottom-3 border glass right-3 px-3 py-1.5 text-xs font-semibold rounded-full shadow bg-chart-2 text-foreground">
              {book.categories[0]}
            </span>
          )}
          {renderStatusBadge()}
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="group absolute top-3 right-3 p-1 bg-secondary rounded-full shadow transition hover:bg-destructive focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-label={`Supprimer ${book.name} de la bibliothèque`}
          >
            <Trash2
              size={16}
              className="text-red-600 transition-colors group-hover:text-white"
              aria-hidden="true"
            />
          </Button>
        </div>

        <CardContent className="px-4 pt-0 pb-4 flex flex-col items-start">
          <div className="text-left w-full flex flex-col gap-2">
            <h3 className="font-semibold text-lg">{book.name}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
            {book.description && (
              <div className="mt-3 max-h-20 overflow-y-auto overflow-x-hidden pr-2">
                <p className="text-sm text-muted-foreground text-justify">
                  {book.description}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
