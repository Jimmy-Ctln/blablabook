import { expect, it, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BookDisplay } from "@/@types/books";
import { BookCard } from "@/components/BookCard";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate: navigateMock }),
}));

/**
 * Factory function to create BookDisplay test data.
 */
const createBook = (overrides?: Partial<BookDisplay>): BookDisplay => ({
  id: "1",
  internalId: 1,
  name: "Test Book",
  cover_url: "cover.jpg",
  cover: "cover.jpg",
  author: "Author",
  description: "Description",
  isbn: "123",
  publisher: "Publisher",
  publishDate: "2024-01-01",
  categoryName: "",
  status: "À lire",
  readStart: null,
  readEnd: null,
  ...overrides,
});

describe("BookCard", () => {
  it("renders the first category", () => {
    render(
      <BookCard
        book={createBook({
          categoryName: "Fantasy",
        })}
        onRemove={() => undefined}
      />,
    );

    expect(screen.getByText("Fantasy")).toBeInTheDocument();
  });

  it("calls onRemove when clicking the delete button", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <BookCard
        book={createBook({
          categoryName: "Fantasy",
        })}
        onRemove={onRemove}
      />,
    );

    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not render category badge when empty", () => {
    render(
      <BookCard
        book={createBook({
          categoryName: "",
        })}
        onRemove={() => undefined}
      />,
    );

    expect(screen.queryByText("Fantasy")).not.toBeInTheDocument();
  });

  it("navigates to book details on card click", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <BookCard
        book={createBook({
          isbn: "123",
        })}
        onRemove={() => undefined}
      />,
    );

    const card = container.firstElementChild as HTMLElement;
    await user.click(card);

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/books/$isbn",
      params: { isbn: "123" },
    });
  });

  it("renders dropdown status options when onStatusChange is provided", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <BookCard
        book={createBook({
          status: "À lire",
          categoryName: "Fantasy",
        })}
        onRemove={() => undefined}
        onStatusChange={onStatusChange}
      />,
    );

    await user.click(screen.getByText("À lire"));
    await user.click(screen.getByText("En cours"));

    expect(onStatusChange).toHaveBeenCalledWith("En cours");
  });
});
