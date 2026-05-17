import { useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  Clock,
  BookOpen,
  Plus,
  Check,
  Tag,
  Calendar,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addBookToUserList } from "../../api/books";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useBookByIsbn } from "../../hooks/useBookByIsbn";
import { useUserBooks } from "../../hooks/useUserBooks";
import { bookDetailsRoute } from "../../routes/routes";
import { getFullExternalBook } from "../../api/externalBooks";
import type { ExternalBookDisplayData } from "../../@types/externalBooks";
import type { BookStatus } from "../../@types/books";
import { BookCover } from "../../components/Book/BookCover";
import { BookHeaderInfo } from "../../components/Book/BookHeaderInfo";
import { BookNoteSection } from "../../components/Book/BookNoteSection";
import { Button } from "../../components/ui/button";
import { BookSummary } from "@/components/Book/BookSummary";
import { ReviewSection } from "@/components/Book/ReviewSection";
import { usePageTitle } from "@/hooks/usePageTitle";
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

  const { data: dbBook } = useBookByIsbn(isbn);

  const {
    books: userBooks,
    refetch,
    updateStatus,
    isUpdatingStatus,
    updateNote,
    isUpdatingNote,
  } = useUserBooks(currentUser?.id);

  const formatDateForDB = (dateString: string): string => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      const yearMatch = /\d{4}/.exec(dateString);
      return yearMatch ? `${yearMatch[0]}-01-01` : "";
    }
    return date.toISOString().split("T")[0];
  };

  const addBookMutation = useMutation({
    mutationFn: async (bookData: ExternalBookDisplayData) => {
      if (!currentUser?.id) throw new Error("User not logged in");
      const payload = {
        name: bookData.title,
        coverUrl: bookData.cover || undefined,
        author: bookData.authors[0] || "Auteur inconnu",
        description: bookData.description || undefined,
        isbn: bookData.isbn,
        publishingHouse: bookData.publisher || undefined,
        publishedAt: bookData.publishedAt
          ? formatDateForDB(bookData.publishedAt)
          : undefined,
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

  usePageTitle(book?.title ?? "Détail du livre");

  const isBookInLibrary = userBooks.some((b) => b.isbn === book?.isbn);
  const userBookData = userBooks.find((b) => b.isbn === book?.isbn);
  const isConnected = !!currentUser?.id;

  const publishYear = book?.publishedAt
    ? /\d{4}/.exec(book.publishedAt)?.[0]
    : null;

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
        <div className="container mx-auto px-4 sm:px-6 py-4">
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
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-4">
              <div className="relative group shadow-lg rounded-lg overflow-hidden mx-auto lg:mx-0 w-48 sm:w-56 lg:w-full">
                <BookCover
                  src={book.cover}
                  alt={book.title}
                  className="w-full aspect-2/3 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <BookHeaderInfo
                      title={book.title}
                      author={book.authors[0] || "Auteur inconnu"}
                    />
                  </div>

                  {/* Metadata: genre, year, pages */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    {isBookInLibrary && userBookData?.categoryName ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 capitalize">
                        <Tag className="h-3 w-3 shrink-0" />
                        {userBookData.categoryName}
                      </span>
                    ) : !isBookInLibrary && dbBook?.categoryName ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 capitalize">
                        <Tag className="h-3 w-3 shrink-0" />
                        {dbBook.categoryName}
                      </span>
                    ) : !isBookInLibrary &&
                      !dbBook &&
                      book.categories.length > 0 ? (
                      book.categories.slice(0, 3).map((cat, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                        >
                          <Tag className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-30">{cat}</span>
                        </span>
                      ))
                    ) : null}

                    {publishYear && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {publishYear}
                      </span>
                    )}

                    {book.pages > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        <BookOpen className="h-3 w-3 shrink-0" />
                        {book.pages} pages
                      </span>
                    )}
                  </div>

                  {isConnected && isBookInLibrary && (
                    <div className="flex justify-center lg:justify-start">
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
                        icon: BookOpen,
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
                        <span>{label}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {isConnected && isBookInLibrary && userBookData && (
                  <BookNoteSection
                    userBookData={userBookData}
                    updateNote={updateNote}
                    isUpdatingNote={isUpdatingNote}
                  />
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
