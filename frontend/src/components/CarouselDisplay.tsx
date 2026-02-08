import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselProps } from "../@types/carouselProps";
import { Button } from "./ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BookCardCarousel from "./BookCardCarousel";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
  title,
  books,
  isLoading,
  seeAllButton,
}: Readonly<CarouselProps>) {
  return (
    <section className="my-8">
      <div className="flex mb-4 items-center justify-between">
        <h2 className="text-lg foreground-secondary">{title}</h2>
        {seeAllButton && (
          <Button
            disabled={!!isLoading}
            asChild
            variant="link"
            className="text-lg flex items-center gap-2"
          >
            <Link
              to="/see-all"
              className={`${isLoading ? "opacity-40 pointer-events-none" : ""} transition-opacity underline-none duration-200 flex items-center gap-2`}
              search={{ title, books }}
            >
              <div className="flex items-center gap-2 text-black">
                <p className="text-foreground">Voir tout</p>
                <ArrowRight />
              </div>
            </Link>
          </Button>
        )}
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto animate-in fade-in duration-500"
      >
        <CarouselContent>
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
        <CarouselPrevious className="sm:flex w-8 h-8 hover:bg-primary hover:text-secondary" />
        <CarouselNext className="sm:flex w-8 h-8 hover:bg-primary hover:text-secondary" />
      </Carousel>
    </section>
  );
}
