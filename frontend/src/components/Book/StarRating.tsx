import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps =
  | { interactive?: false; value: number; onChange?: never }
  | { interactive: true; value: number; onChange: (value: number) => void };

export function StarRating({ interactive = false, value, onChange }: StarRatingProps) {
  return (
    <div className="flex gap-0.5" role={interactive ? "radiogroup" : undefined} aria-label="Note">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          aria-label={interactive ? `${star} étoile${star > 1 ? "s" : ""}` : undefined}
          className={cn(
            "transition-colors",
            interactive && "cursor-pointer hover:scale-110",
            !interactive && "cursor-default pointer-events-none",
          )}
        >
          <Star
            className={cn(
              "h-5 w-5",
              star <= value ? "fill-yellow-400 text-yellow-400" : "fill-none text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
}
