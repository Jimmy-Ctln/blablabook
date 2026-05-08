import CarouselDisplay from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import { getBooks, getRandomBooks } from "@/api/books";
import type { BookRow, BooksByCategory } from "@/@types/books";
import { mapBookRowToDisplay } from "@/lib/bookDisplayMapper";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const categories = [
    "aventure",
    "romance",
    "fantasy",
    "science-fiction",
    "horreur",
    "mystère",
    "thriller",
  ];

  const { data: randomBooks = [], isLoading: isLoadingRandom } = useQuery<
    BookRow[]
  >({
    queryKey: ["random-books"],
    queryFn: () => getRandomBooks(20),
  });

  const { data: books = {}, isFetching } = useQuery<BooksByCategory>({
    queryKey: ["books-carousel"],
    queryFn: () => getBooks(categories),
  });

  const content = (
    <>
      <CarouselDisplay
        title={"SUGGESTIONS ALEATOIRE"}
        books={randomBooks.map(mapBookRowToDisplay)}
        isLoading={isLoadingRandom}
      />

      {categories.map((categoryTitle) => {
        const categoryKey = categoryTitle.toLowerCase();
        const title = categoryTitle.toUpperCase();
        const categoryBooks = books[categoryKey] ?? [];
        const isLoading = isFetching || categoryBooks.length === 0;

        return (
          <CarouselDisplay
            key={categoryTitle}
            title={title}
            books={categoryBooks.map(mapBookRowToDisplay)}
            isLoading={isLoading}
          />
        );
      })}
    </>
  );

  return (
    <div className="w-full">
      <Hero />
      <div className="relative z-20 -mt-20 md:-mt-16 lg:-mt-20 container mx-auto px-4 sm:px-6 md:px-8">
        {content}
      </div>
    </div>
  );
}
