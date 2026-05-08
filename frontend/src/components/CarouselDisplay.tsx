import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselProps } from "../@types/carouselProps";
import { Skeleton } from "@/components/ui/skeleton";
import BookCardCarousel from "./BookCardCarousel";

function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="max-w-[80%] h-80 rounded-lg" />
    </div>
  );
}

export default function CarouselDisplay({
  books,
  isLoading,
  title,
}: Readonly<CarouselProps>) {
  return (
    <Carousel
      orientation="horizontal"
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full mx-auto my-8 px-8 animate-in fade-in duration-500"
    >
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2 items-center">
          <CarouselPrevious className="sm:flex w-8 h-8" />
          <CarouselNext className="sm:flex w-8 h-8" />
        </div>
      </div>
      <CarouselContent className="mt-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <CarouselItem
                key={i}
                className="basis-full md:basis-1/2 lg:basis-1/4"
              >
                <BookCardSkeleton />
              </CarouselItem>
            ))
          : books.map((book) => (
              <CarouselItem
                key={book.id}
                className="basis-full md:basis-1/3 lg:basis-1/6"
              >
                <BookCardCarousel book={book} />
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
}
