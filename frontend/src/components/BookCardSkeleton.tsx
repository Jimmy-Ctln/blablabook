import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border bg-card h-full">
      <Skeleton className="w-full aspect-3/4" />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-3/4 rounded mt-1" />
          <Skeleton className="h-3 w-1/2 rounded mt-2" />
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <Skeleton className="h-3 w-1/3 rounded" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}
