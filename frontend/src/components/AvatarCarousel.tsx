import useEmblaCarousel from "embla-carousel-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type AvatarCarouselProps = {
  images: (string | undefined)[];
  selectedImage?: string;
  onSelect: (img: string | undefined) => void;
};

export default function AvatarCarousel({
  images,
  selectedImage,
  onSelect,
}: AvatarCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative w-full flex justify-center items-center">
      {/* Flèche gauche */}
      <Button
        type="button"
        onClick={scrollPrev}
        aria-label="Avatar précédent"
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8"
      >
        <ArrowLeft aria-hidden="true" />
      </Button>

      {/* Carousel container */}
      <div ref={emblaRef} className="overflow-hidden w-50">
        <div className="flex gap-x-1">
          {images.map((img, i) => (
            <div
              key={i}
              className="flex-none w-20 h-20 flex items-center justify-center"
            >
              <Avatar
                className={`w-15 h-15 cursor-pointer border ${
                  selectedImage === img
                    ? "ring-2 ring-blue-400"
                    : "opacity-80 hover:opacity-100"
                }`}
                onClick={() => onSelect(img)}
              >
                {img ? (
                  <AvatarImage src={`/images/${img}`} alt={`Avatar ${i + 1}`} />
                ) : (
                  <AvatarFallback>X</AvatarFallback>
                )}
              </Avatar>
            </div>
          ))}
        </div>
      </div>

      {/* Flèche droite */}
      <Button
        type="button"
        onClick={scrollNext}
        aria-label="Avatar suivant"
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8"
      >
        <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}
