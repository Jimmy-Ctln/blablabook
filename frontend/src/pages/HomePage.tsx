import CarouselDisplay from "@/components/CarouselDisplay";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";
import { useExternalBooks } from "@/hooks/useExternalBooks";
import { getBooks, getRandomBooks } from "@/api/books";
import type { BookRow } from "@/@types/books";
import {
  mapBookRowToDisplay,
  mapExternalBookToDisplay,
} from "@/lib/bookDisplayMapper";
import { horrorKeywords, loveKeywords, fantasyKeywords } from "@/lib/utils";

export default function HomePage() {
  const [search, setSearch] = useState("");

  const [randomBooks, setRandomBooks] = useState<BookRow[]>();
  const [internalBooks, setInternalBooks] = useState<BookRow[]>();

  const horrorBooks: BookRow[] = (internalBooks || []).filter((book) =>
    book.categories?.some((cat) =>
      horrorKeywords.some((keyword) => cat.toLowerCase().includes(keyword)),
    ),
  );

  const loveBooks: BookRow[] = (internalBooks || []).filter((book) =>
    book.categories?.some((cat) =>
      loveKeywords.some((keyword) => cat.toLowerCase().includes(keyword)),
    ),
  );

  const fantasyBooks: BookRow[] = (internalBooks || []).filter((book) =>
    book.categories?.some((cat) =>
      fantasyKeywords.some((keyword) => cat.toLowerCase().includes(keyword)),
    ),
  );

  useEffect(() => {
    getRandomBooks(20).then((books) => {
      setRandomBooks(books);
    });

    getBooks().then((books) => {
      setInternalBooks(books);
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
          title={`Recherche en cours...`}
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
          title={"Suggestions Aléatoire"}
          books={(randomBooks || [])?.map(mapBookRowToDisplay)}
          isLoading={!randomBooks}
        />
        <CarouselDisplay
          title={"Horreur"}
          books={(horrorBooks || [])?.map(mapBookRowToDisplay)}
          isLoading={!horrorBooks}
        />
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
