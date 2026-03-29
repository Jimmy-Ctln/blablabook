import React from "react";
import type { BookStatus } from "../../@types/books";
import { BookLoginCTA } from "./BookLoginCTA";
import { BookAddAction } from "./BookAddAction";
import { BookStatusDropdown } from "./BookStatusDropdown";

interface BookStatusActionProps {
  status?: BookStatus;
  onAddToLibrary: () => void;
  isAdding?: boolean;
  onChangeStatus?: (status: BookStatus) => void;
  isUpdatingStatus?: boolean;
  isConnected?: boolean; // if the user is connected
}

// Component to display the book status and allow adding/updating
export const BookStatusAction: React.FC<BookStatusActionProps> = ({
  status,
  onAddToLibrary,
  isAdding = false,
  onChangeStatus,
  isUpdatingStatus = false,
  isConnected,
}) => {
  if (!isConnected) {
    return <BookLoginCTA onClick={onAddToLibrary} />;
  }

  if (status) {
    return (
      <BookStatusDropdown
        status={status}
        onChangeStatus={onChangeStatus}
        isUpdatingStatus={isUpdatingStatus}
      />
    );
  }

  // 3. Connected case (book not in library)
  return <BookAddAction onAdd={onAddToLibrary} isAdding={isAdding} />;
};
