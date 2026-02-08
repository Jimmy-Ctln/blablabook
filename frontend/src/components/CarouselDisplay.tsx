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
    <div className="flex flex-col items-center rounded-xl overflow-hidden shadow w-full h-full p-0 max-h-96 min-h-96 animate-pulse bg-[#f9f6f2]">
      <div className="w-full flex flex-col items-center p-4">
        <Skeleton className="h-48 w-32 object-cover mb-2 rounded shadow bg-gray-200" />
        <Skeleton className="h-5 w-24 mb-1 rounded bg-gray-200" />
        <Skeleton className="h-4 w-20 mb-1 rounded bg-gray-200" />
      </div>
      <div className="w-full flex flex-col items-center px-4 pb-4">
        <Skeleton className="h-3 w-16 mb-1 rounded bg-gray-200" />
        <Skeleton className="h-3 w-24 mb-1 rounded bg-gray-200" />
        <Skeleton className="h-3 w-20 mb-1 rounded bg-gray-200" />
      </div>
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
      className="w-full mx-auto my-8 animate-in fade-in duration-500"
    >
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex gap-2 items-center">
          <CarouselPrevious className="sm:flex w-8 h-8 hover:bg-primary hover:text-secondary" />
          <CarouselNext className="sm:flex w-8 h-8 hover:bg-primary hover:text-secondary" />
        </div>
      </div>
      <CarouselContent className="mt-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <CarouselItem
                key={i}
                className="basis-full md:basis-1/3 lg:basis-1/4"
              >
                <BookCardSkeleton />
              </CarouselItem>
            ))
          : books.map((book) => (
              <CarouselItem
                key={book.key}
                className="basis-full md:basis-1/3 lg:basis-1/4"
              >
                <BookCardCarousel book={book} />
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
}
