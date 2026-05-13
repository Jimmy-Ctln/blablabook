import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Loader2 } from "lucide-react";
import { getReviewsByIsbn, createReview, deleteReview } from "@/api/reviews";
import type { ExternalBookDisplayData } from "@/@types/externalBooks";
import { ReviewCard } from "./ReviewCard";
import { StarRating } from "./StarRating";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ReviewSectionProps = {
  book: ExternalBookDisplayData;
  currentUserId?: number;
  isConnected: boolean;
};

export function ReviewSection({ book, currentUserId, isConnected }: ReviewSectionProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [formError, setFormError] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", book.isbn],
    queryFn: () => getReviewsByIsbn(book.isbn),
    staleTime: 1000 * 60,
  });

  const hasUserReviewed = reviews.some((r) => r.userId === currentUserId);

  const createMutation = useMutation({
    mutationFn: () =>
      createReview({
        isbn: book.isbn,
        rating,
        review_text: text.trim(),
        bookName: book.title,
        bookCoverUrl: book.cover ?? "",
        bookAuthor: book.authors[0] ?? "Auteur inconnu",
        bookDescription: book.description || "Aucune description",
        bookPublishingHouse: book.publisher || "Éditeur inconnu",
        bookPublishedAt: book.publishedAt || new Date().toISOString().split("T")[0],
        bookCategories: book.categories,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", book.isbn] });
      setRating(0);
      setText("");
      setFormError("");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      const msg = err.response?.data?.message;
      if (msg === "You have already reviewed this book") {
        setFormError("Vous avez déjà écrit une review pour ce livre.");
      } else {
        setFormError("Une erreur est survenue. Veuillez réessayer.");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews", book.isbn] }),
  });

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setFormError("");
    if (rating === 0) {
      setFormError("Veuillez sélectionner une note avant de publier.");
      return;
    }
    if (!text.trim()) {
      setFormError("Veuillez écrire un avis avant de publier.");
      return;
    }
    createMutation.mutate();
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h2 id="reviews-heading" className="text-lg font-semibold text-foreground">
            Avis des lecteurs
          </h2>
          {reviews.length > 0 && (
            <span className="text-sm text-muted-foreground">({reviews.length})</span>
          )}
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(averageRating)} />
            <span className="text-sm font-medium text-foreground">
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {isConnected && !hasUserReviewed && (
        <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border">
          <p className="text-sm font-medium text-foreground">Écrire un avis</p>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Votre note *</p>
            <StarRating interactive value={rating} onChange={setRating} />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Partagez votre avis sur ce livre... *"
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />

          {formError && <p className="text-xs text-destructive">{formError}</p>}

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Publication...</>
              ) : (
                "Publier mon avis"
              )}
            </Button>
          </div>
        </form>
      )}

      {isConnected && hasUserReviewed && (
        <p className="text-sm text-muted-foreground italic">
          Vous avez déjà publié un avis pour ce livre.
        </p>
      )}

      {!isConnected && (
        <p className="text-sm text-muted-foreground">
          Connectez-vous pour laisser un avis.
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Aucun avis pour l'instant. Soyez le premier à donner votre avis !
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onDelete={(id) => deleteMutation.mutate(id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </section>
  );
}
