import { useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Badge,
  Heart,
  Loader2,
  Calendar,
  Tag,
  Bookmark,
  Clock,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addBookToUserList } from "../../api/books";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUserBooks } from "../../hooks/useUserBooks";
import { bookDetailsRoute } from "../../routes/routes";
import { getFullExternalBook } from "../../api/externalBooks";
import type { ExternalBookDisplayData } from "../../@types/externalBooks";
import { BookCover } from "../../components/Book/BookCover";
import { BookHeaderInfo } from "../../components/Book/BookHeaderInfo";
import { BookDataGrid } from "../../components/Book/BookDataGrid";
import { BookStatusAction } from "../../components/Book/BookStatusAction";
import { Button } from "../../components/ui/button";
import type { BookStatus } from "@/@types/books";
import { BookSummary } from "@/components/Book/BookSummary";
import type { AxiosError } from "axios";
import { Card } from "@/components/ui/card";
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
        coverId: bookData.cover,
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
    if (userBook?.id)
      updateStatus({
        bookId: userBook.id,
        status: newStatus,
        currentBook: userBook,
      });
  };

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
    <div className="container px-6 py-4 w-full min-h-[80vh] animate-in fade-in zoom-in-95 duration-500">
      <div className="flex mb-6">
        <Button
          onClick={() => router.history.back()}
          variant={"ghost"}
          className="inline-flex items-center text-sm font-sans text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Retour
        </Button>
      </div>

      <div className="w-full">
        <div className="flex gap-6 w-full">
          <div className="flex flex-col gap-4 items-center">
            <div className="relative group shadow-2xl rounded-lg">
              <BookCover
                src={book.cover}
                alt={book.title}
                className="w-full md:w-65 aspect-2/3 object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex gap-4">
              <Button>
                <Heart /> Aime
              </Button>
              <Button>
                <Bookmark className="h-4 w-4" /> Enregistrer
              </Button>
            </div>
          </div>
          <div className="px-8">
            <BookHeaderInfo title={book.title} author={book.authors[0]} />
            <Separator />
            <BookSummary description={book.description} />
            <div className="mt-6 text-foreground">
              <h3 className="text-xl">Changer le status</h3>
              <div className="flex gap-2 mt-4">
                <Button>
                  <Clock />A lire
                </Button>
                <Button>
                  <Clock />
                  En cours de lecture
                </Button>
                <Button>
                  <Clock />
                  Lu
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-6 xl:order-last xl:col-span-1 w-full xl:sticky xl:top-6 flex flex-col">
              <BookStatusAction
                status={userBooks.find((b) => b.isbn === book.isbn)?.status}
                onAddToLibrary={handleAddToLibrary}
                isAdding={addBookMutation.isPending}
                onChangeStatus={handleChangeStatus}
                isUpdatingStatus={isUpdatingStatus}
                isConnected={!!currentUser?.id}
              />
            </div> */}
        {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full items-start">
          <div className="xl:col-span-2 w-full">
            <BookDataGrid
              publisher={book.publisher}
              publishedAt={book.publishedAt}
              pages={book.pages}
              isbn={book.isbn}
              language={book.language}
              categories={book.categories.slice(0, 5)}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BookDetails;
