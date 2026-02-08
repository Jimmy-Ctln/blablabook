import React from "react";
import { CheckCircle, BookOpen, Clock, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import type { BookStatus } from "../../@types/books";

interface BookStatusDropdownProps {
  status: BookStatus;
  onChangeStatus?: (status: BookStatus) => void;
  isUpdatingStatus?: boolean;
}

export const BookStatusDropdown: React.FC<BookStatusDropdownProps> = ({
  status,
  onChangeStatus,
  isUpdatingStatus = false,
}) => {
  // configuration for each status
  const statusConfig: Record<BookStatus, { icon: React.ElementType }> = {
    "Lu": { icon: CheckCircle },
    "En cours": { icon: BookOpen },
    "À lire": { icon: Clock },
  };

  const badgeVariantMap: Record<BookStatus, "success" | "warning" | "default"> = {
    "Lu": "success",
    "En cours": "warning",
    "À lire": "default",
  };

  const Icon = statusConfig[status].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant={badgeVariantMap[status]}
          className="cursor-pointer flex items-center gap-2 px-3 py-2 text-foreground font-sans"
        >
          <Icon size={18} strokeWidth={2.2} />
          {isUpdatingStatus && (
            <Loader2 className="mr-1 h-4 w-4 animate-spin inline" />
          )}
          {status}
        </Badge>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {(["À lire", "En cours", "Lu"] as BookStatus[]).map((s) => (
          <DropdownMenuItem
            key={s}
            onSelect={() => {
                onChangeStatus?.(s);
            }}
            disabled={isUpdatingStatus || s === status} // Disable if updating or same status
          >
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};