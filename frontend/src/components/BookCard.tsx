import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, ChevronDown, Clock, BookOpen, CheckCircle } from "lucide-react";
import type { BookDisplay } from "../@types/books";
import { useRouter } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { BookCoverImage } from "@/components/BookCoverImage";

const statusConfig = {
  "À lire": { icon: Clock, description: "Dans votre liste de lecture" },
  "En cours": { icon: BookOpen, description: "Lecture en cours" },
  Lu: { icon: CheckCircle, description: "Lecture terminée" },
} as const;

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
      const { icon: CurrentIcon } = statusConfig[book.status as keyof typeof statusConfig] ?? {};
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full shadow bg-primary transition-colors flex flex-col items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label={`Statut de lecture: ${book.status}. Cliquer pour changer`}
            >
              <span className="flex items-center gap-1">
                {CurrentIcon && <CurrentIcon size={11} aria-hidden="true" />}
                {book.status}
                <ChevronDown size={11} aria-hidden="true" />
              </span>
              <span className="text-[9px] font-normal opacity-80 leading-none">
                Modifier
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {statuses.map((status) => {
              const { icon: Icon, description } = statusConfig[status];
              return (
                <DropdownMenuItem
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(status);
                  }}
                  className="flex items-center gap-3 py-2.5 cursor-pointer"
                >
                  <Icon size={16} className="shrink-0 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-xs text-muted-foreground">{description}</span>
                  </div>
                </DropdownMenuItem>
              );
            })}
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
      className="w-full transform hover:scale-101 transition-transform duration-500 cursor-pointer focus-within:ring-2 focus-within:ring-offset-2 rounded-xl"
      onClick={() => goToBookDetails()}
      role="article"
    >
      <Card className="w-full shadow-lg relative rounded-xl overflow-hidden p-0 gap-2 flex flex-col h-full bg-chart-2">
        <div className="relative shrink-0">
          <div className="w-full aspect-2/3">
            <BookCoverImage
              src={book.cover_url}
              alt={`Couverture de ${book.name}`}
            />
          </div>

          {book.categoryName && book.categoryName.length > 0 && (
            <span className="absolute bottom-3 bg-primary right-3 px-3 py-1.5 text-xs font-semibold rounded-full shadow bg-chart-2 text-foreground">
              {book.categoryName}
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

        <CardContent className="px-3 pt-0 pb-3 flex flex-col items-start">
          <div className="text-left w-full flex flex-col gap-1">
            <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2">
              {book.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {book.author}
            </p>
            {book.description && (
              <div className="hidden sm:block mt-2 max-h-16 overflow-y-auto overflow-x-hidden pr-1">
                <p className="text-xs text-muted-foreground text-justify line-clamp-3">
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
