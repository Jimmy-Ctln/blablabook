import { expect, it, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BookRow } from "@/@types/books";
import { BookCard } from "@/components/BookCard";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate: navigateMock }),
}));

/**
 * Factory function to create BookRow test data matching Drizzle types.
 */
const createBookRow = (overrides?: Partial<BookRow>): BookRow => ({
  id: 1,
  name: "Test Book",
  coverId: "cover.jpg",
  author: "Author",
  description: "Description",
  isbn: "123",
  publishingHouse: "Publisher",
  publishedAt: "2024-01-01",
  categories: [],
  status: "À lire",
  readStart: null,
  readEnd: null,
  addedAt: new Date(),
  ...overrides,
});

describe("BookCard", () => {
  it("renders the first category", () => {
    render(
      <BookCard
        book={createBookRow({
          categories: ["Fantasy", "Drama"],
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
        book={createBookRow({
          categories: ["Fantasy"],
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
        book={createBookRow({
          categories: [],
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
        book={createBookRow({
          categories: ["Fantasy"],
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
        book={createBookRow({
          status: "À lire",
          categories: ["Fantasy"],
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
