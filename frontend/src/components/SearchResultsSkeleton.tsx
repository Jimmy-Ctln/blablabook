import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResultsSkeleton() {
  return (
    <Carousel
      orientation="horizontal"
      opts={{
        align: "start",
        loop: false,
      }}
      className="w-full mx-auto my-8 px-8 animate-in fade-in duration-500"
    >
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-xl font-bold text-foreground">Résultats</h2>
        <div className="flex gap-2 items-center">
          <CarouselPrevious className="sm:flex w-8 h-8" />
          <CarouselNext className="sm:flex w-8 h-8" />
        </div>
      </div>
      <CarouselContent className="mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CarouselItem
            key={i}
            className="basis-full md:basis-1/2 lg:basis-1/4"
          >
            <div className="flex flex-col gap-4 w-full">
              <Skeleton className="max-w-[80%] h-80 rounded-lg" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
