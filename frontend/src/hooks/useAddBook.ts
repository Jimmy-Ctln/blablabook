/**
 * Provides a mutation to add an external book to the user's library.
 * Maps data coming from the external API to the backend `CreateBookDto`
 * and invalidates the related TanStack Query cache on success.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBookToUserList } from "@/api/books";
import type { CreateBookDto, BookRow, BookDisplay } from "@/@types/books";
import { getOpenLibIsbnData, getOpenLibWorkData } from "@/api/externalBooks";

/**
 * Normalize various `publishDate` shapes (full date, year-only, invalid) to
 * a stable `YYYY-MM-DD` format expected by the backend.
 */
const toIsoDate = (publishDate?: string): string => {
  if (!publishDate) return new Date().toISOString().split("T")[0];

  // Try parsing as date
  const parsed = new Date(publishDate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  // If year only (YYYY), pad with -01-01
  const yearMatch = /^(\d{4})$/.exec(publishDate);
  if (yearMatch) return `${yearMatch[1]}-01-01`;

  // Default to today
  return new Date().toISOString().split("T")[0];
};

export const useAddBook = (userId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<BookRow, Error, BookDisplay>({
    // Map the book display payload into our backend DTO, then call the API
    mutationFn: async (bookDisplay) => {
      if (!userId) throw new Error("UserId is required");

      // Fetch description only when adding the book
      let description = bookDisplay.description || "";

      if (!description && bookDisplay.isbn) {
        try {
          const dataIsbn = await getOpenLibIsbnData(bookDisplay.isbn);
          const workKey = dataIsbn.works?.[0]?.key;

          if (workKey) {
            const dataWork = await getOpenLibWorkData(workKey);
            if (dataWork.description) {
              description =
                typeof dataWork.description === "string"
                  ? dataWork.description
                  : dataWork.description.value || "";
            }
          }
        } catch (err) {
          console.warn(
            `Failed to fetch description for ${bookDisplay.isbn}:`,
            err,
          );
        }
      }

      const createBookDto: CreateBookDto = {
        // Fallbacks ensure minimal valid payloads if external fields are missing
        name: bookDisplay.name || "Unknown Title",
        author: bookDisplay.author || "Unknown Author",
        isbn: bookDisplay.isbn || "N/A",
        coverUrl:
          bookDisplay.cover_url || bookDisplay.cover || "default_cover.png",
        description: description || "Pas de description pour ce livre",
        publishingHouse: bookDisplay.publisher || "Unknown publisher",
        publishedAt: toIsoDate(bookDisplay.publishDate),
        categories: bookDisplay.categories || [],
      };

      return addBookToUserList(userId, createBookDto);
    },
    onSuccess: () => {
      // Invalidate and refetch the user's library so UI reflects the change
      queryClient.invalidateQueries({
        queryKey: ["userBooks", userId],
        refetchType: "active",
      });
    },
  });
};
