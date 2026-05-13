import { Trash2, UserRound } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Review } from "@/@types/reviews";
import { Button } from "@/components/ui/button";

type ReviewCardProps = {
  review: Review;
  currentUserId?: number;
  onDelete?: (reviewId: number) => void;
  isDeleting?: boolean;
};

export function ReviewCard({ review, currentUserId, onDelete, isDeleting }: ReviewCardProps) {
  const isOwner = currentUserId != null && review.userId === currentUserId;
  const date = new Date(review.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex gap-3 p-4 rounded-xl bg-muted/40 border border-border">
      <div className="shrink-0">
        {review.avatar_url ? (
          <img
            src={review.avatar_url}
            alt={review.username ?? "Utilisateur"}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <UserRound className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {review.username ?? "Utilisateur supprimé"}
            </p>
            <StarRating value={review.rating} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">{date}</span>
            {isOwner && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(review.id)}
                disabled={isDeleting}
                aria-label="Supprimer ma review"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {review.review_text && (
          <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
            {review.review_text}
          </p>
        )}
      </div>
    </div>
  );
}
