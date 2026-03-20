import CarouselDisplay from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { getBooks, getRandomBooks } from "@/api/books";
import type { BookRow, BooksByCategory } from "@/@types/books";
import {
  mapBookRowToDisplay,
  mapExternalBookToDisplay,
} from "@/lib/bookDisplayMapper";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const [search] = useState("");
  const [randomBooks, setRandomBooks] = useState<BookRow[]>();

  const categories = [
    "aventure",
    "romance",
    "fantasy",
    "science-fiction",
    "horreur",
    "mystère",
    "thriller",
  ];

  const { data: books = {}, isFetching } = useQuery<BooksByCategory>({
    queryKey: ["books-carousel"],
    queryFn: () => getBooks(categories),
  });

  useEffect(() => {
    getRandomBooks(20).then((fetchedBooks) => {
      setRandomBooks(fetchedBooks);
    });
  }, []);

  const { data: searchResults = [], isLoading: isSearchLoading } =
    useExternalBooks({
      mode: "search",
      param: search,
    });

  let content;
  if (search) {
    if (isSearchLoading) {
      content = (
        <CarouselDisplay
          title={"Recherche en cours..."}
          books={[]}
          isLoading={true}
          seeAllButton={false}
        />
      );
    } else if (searchResults.length === 0) {
      content = (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">
            Aucun résultat trouvé pour "{search}"
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Essayez avec d'autres mots-clés
          </p>
        </div>
      );
    } else {
      content = (
        <CarouselDisplay
          title={`Résultats pour "${search}"`}
          books={searchResults.map(mapExternalBookToDisplay)}
          isLoading={false}
          seeAllButton={false}
        />
      );
    }
  } else {
    content = (
      <>
        <CarouselDisplay
          title={"SUGGESTIONS ALEATOIRE"}
          books={(randomBooks || []).map(mapBookRowToDisplay)}
          isLoading={!randomBooks}
        />

        {categories.map((categoryTitle) => {
          const categoryKey = categoryTitle.toLowerCase();
          const title = categoryTitle.toUpperCase();
          const categoryBooks = books[categoryKey] ?? [];

          return (
            <CarouselDisplay
              key={categoryTitle}
              title={title}
              books={categoryBooks.map(mapBookRowToDisplay)}
              isLoading={isFetching}
            />
          );
        })}
      </>
    );
  }

  return (
    <div className="flex-col w-full mx-auto">
      <Hero />
      <div className="absolute w-full bg-card">{content}</div>
    </div>
  );
}
