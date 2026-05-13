import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Clock, Plus, Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addBookToUserList } from "../../api/books";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUserBooks } from "../../hooks/useUserBooks";
import { bookDetailsRoute } from "../../routes/routes";
import { getFullExternalBook } from "../../api/externalBooks";
import type { ExternalBookDisplayData } from "../../@types/externalBooks";
import type { BookStatus } from "../../@types/books";
import { BookCover } from "../../components/Book/BookCover";
import { BookHeaderInfo } from "../../components/Book/BookHeaderInfo";
import { Button } from "../../components/ui/button";
import { BookSummary } from "@/components/Book/BookSummary";
import { ReviewSection } from "@/components/Book/ReviewSection";
import type { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";

const BookDetails = () => {
  const router = useRouter();
  const { isbn } = bookDetailsRoute.useParams();
  const { data: currentUser } = useCurrentUser();

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery<ExternalBookDisplayData>({
    queryKey: ["external-book", isbn],
    queryFn: () => getFullExternalBook(isbn),
    enabled: !!isbn,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  const {
    books: userBooks,
    refetch,
    updateStatus,
    isUpdatingStatus,
  } = useUserBooks(currentUser?.id);

  const formatDateForDB = (dateString: string): string => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      const yearMatch = /\d{4}/.exec(dateString);
      return yearMatch
        ? `${yearMatch[0]}-01-01`
        : new Date().toISOString().split("T")[0];
    }
    return date.toISOString().split("T")[0];
  };

  const addBookMutation = useMutation({
    mutationFn: async (bookData: ExternalBookDisplayData) => {
      if (!currentUser?.id) throw new Error("User not logged in");
      const payload = {
        name: bookData.title,
        coverUrl: bookData.cover ?? "",
        author: bookData.authors[0],
        description: bookData.description || "No description provided",
        isbn: bookData.isbn,
        publishingHouse: bookData.publisher,
        publishedAt: formatDateForDB(bookData.publishedAt),
        categories: bookData.categories,
      };
      return addBookToUserList(currentUser.id, payload);
    },
    onSuccess: () => {
      refetch();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.error("Backend error:", err);
      const message =
        err.response?.data?.message || err.message || "Failed to add book.";
      alert(`Error: ${message}`);
    },
  });

  const handleAddToLibrary = () => {
    if (!currentUser) {
      router.navigate({
        to: "/login",
        search: { redirect: globalThis.location.pathname },
      });
      return;
    }
    if (book) addBookMutation.mutate(book);
  };

  const handleChangeStatus = (newStatus: BookStatus) => {
    const userBook = userBooks.find((b) => b.isbn === book?.isbn);
    if (userBook?.internalId !== undefined && userBook?.internalId !== null)
      updateStatus({
        bookId: userBook.internalId,
        status: newStatus,
        currentBook: userBook,
      });
  };

  // Check if book is already in user's library
  const isBookInLibrary = userBooks.some((b) => b.isbn === book?.isbn);
  const userBookData = userBooks.find((b) => b.isbn === book?.isbn);
  const isConnected = !!currentUser?.id;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <output className="flex items-center" aria-live="polite">
          <Loader2
            className="h-10 w-10 animate-spin text-foreground font-sans"
            aria-hidden="true"
          />
          <span className="ml-3 text-foreground">Chargement...</span>
        </output>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-sans text-lg" role="alert">
          Oups !{" "}
          {(error as Error)?.message || "Impossible de charger ce livre."}
        </p>
        <Button variant="outline" onClick={() => router.history.back()}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background animate-in fade-in zoom-in-95 duration-500">
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container px-4 sm:px-6 py-4">
          <Button
            onClick={() => router.history.back()}
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
            <span className="text-foreground">Retour</span>
          </Button>
        </div>
      </div>
      <div className="container px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="md:col-span-1">
            <div className="flex flex-col gap-4">
              <div className="relative group shadow-lg rounded-lg overflow-hidden mx-auto md:mx-0 w-48 sm:w-56 md:w-full">
                <BookCover
                  src={book.cover}
                  alt={book.title}
                  className="w-full aspect-2/3 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <BookHeaderInfo
                      title={book.title}
                      author={book.authors[0]}
                    />
                  </div>
                  {isConnected && isBookInLibrary && (
                    <div className="inline-flex sm:justify-end">
                      <div className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
                        <span className="text-sm font-semibold text-primary capitalize">
                          {userBookData?.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {isConnected && isBookInLibrary && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-foreground">
                    {[
                      {
                        status: "À lire" as BookStatus,
                        icon: Clock,
                        label: "À lire",
                      },
                      {
                        status: "En cours" as BookStatus,
                        icon: Clock,
                        label: "En cours",
                      },
                      {
                        status: "Lu" as BookStatus,
                        icon: Check,
                        label: "Lu",
                      },
                    ].map(({ status, icon: Icon, label }) => (
                      <Button
                        key={status}
                        variant={
                          userBookData?.status === status
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleChangeStatus(status)}
                        disabled={isUpdatingStatus}
                        className="w-full gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </Button>
                    ))}
                  </div>
                )}

                <Separator />
              </div>

              <div>
                <BookSummary description={book.description} />
              </div>

              {!isConnected && (
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <p className="text-foreground font-sans text-sm leading-relaxed">
                    Veuillez{" "}
                    <button
                      onClick={() =>
                        router.navigate({
                          to: "/login",
                          search: { redirect: globalThis.location.pathname },
                        })
                      }
                      className="text-primary hover:underline font-semibold"
                    >
                      vous connecter
                    </button>{" "}
                    pour ajouter ce livre à votre bibliothèque et gérer votre
                    lecture.
                  </p>
                </div>
              )}

              {isConnected && !isBookInLibrary && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-4">
                    Ce livre n'est pas encore dans votre bibliothèque
                  </p>
                  <Button
                    onClick={handleAddToLibrary}
                    disabled={addBookMutation.isPending}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {addBookMutation.isPending
                      ? "Ajout en cours..."
                      : "Ajouter à ma bibliothèque"}
                  </Button>
                </div>
              )}

              <ReviewSection
                book={book}
                currentUserId={currentUser?.id}
                isConnected={isConnected}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
