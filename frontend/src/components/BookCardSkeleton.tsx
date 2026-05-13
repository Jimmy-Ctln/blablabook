import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border bg-card h-full">
      <Skeleton className="w-full aspect-3/4" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded mt-1" />
        <Skeleton className="h-5 w-16 rounded-md mt-1" />
      </div>
    </div>
  );
}
