import { useState } from "react";
import { NotebookPen, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookDisplay } from "@/@types/books";

interface BookNoteSectionProps {
  userBookData: BookDisplay;
  updateNote: (args: { bookId: number; comment: string | null }) => void;
  isUpdatingNote: boolean;
}

export function BookNoteSection({
  userBookData,
  updateNote,
  isUpdatingNote,
}: BookNoteSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(userBookData.comment ?? "");
  const [prevComment, setPrevComment] = useState(userBookData.comment);

  if (prevComment !== userBookData.comment) {
    setPrevComment(userBookData.comment);
    setNoteText(userBookData.comment ?? "");
  }

  const handleSave = () => {
    if (!userBookData.internalId) return;
    updateNote({
      bookId: userBookData.internalId,
      comment: noteText.trim() || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNoteText(userBookData.comment ?? "");
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <NotebookPen className="h-4 w-4 text-muted-foreground" />
          Ma note privée
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/10"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
            Modifier
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            id="book-note"
            name="note"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Écris ta note ici..."
            rows={4}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdatingNote}
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {noteText || "Aucune note pour l'instant..."}
        </p>
      )}
    </div>
  );
}
