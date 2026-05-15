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

const statusConfig: Record<
  BookStatus,
  { icon: React.ElementType; label: string; description: string }
> = {
  "À lire": {
    icon: Clock,
    label: "À lire",
    description: "Dans votre liste de lecture",
  },
  "En cours": {
    icon: BookOpen,
    label: "En cours",
    description: "Lecture en cours",
  },
  Lu: {
    icon: CheckCircle,
    label: "Lu",
    description: "Lecture terminée",
  },
};

const badgeVariantMap: Record<BookStatus, "success" | "warning" | "default"> =
  {
    Lu: "success",
    "En cours": "warning",
    "À lire": "default",
  };

export const BookStatusDropdown: React.FC<BookStatusDropdownProps> = ({
  status,
  onChangeStatus,
  isUpdatingStatus = false,
}) => {
  const { icon: Icon } = statusConfig[status];

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

      <DropdownMenuContent align="start" className="w-52">
        {(["À lire", "En cours", "Lu"] as BookStatus[]).map((s) => {
          const { icon: ItemIcon, label, description } = statusConfig[s];
          return (
            <DropdownMenuItem
              key={s}
              onSelect={() => onChangeStatus?.(s)}
              disabled={isUpdatingStatus || s === status}
              className="flex items-center gap-3 py-2.5 cursor-pointer"
            >
              <ItemIcon size={16} className="shrink-0 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
