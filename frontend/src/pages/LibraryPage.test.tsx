import { expect, it, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BookRow } from "@/@types/books";
import LibraryPage from "@/pages/LibraryPage";

vi.mock("@/components/AddBookModal", () => ({
  AddBookModal: () => <div data-testid="add-book-modal" />,
}));

vi.mock("@/components/BookCard", () => ({
  BookCard: ({ book }: { book: { name: string } }) => <div>{book.name}</div>,
}));

vi.mock("@/stores/authStore", () => ({
  useAuthStore: () => ({ user: { id: 1 } }),
}));

// Static test data
const { useUserBooksMock } = vi.hoisted(() => {
  // Factory function to create BookRow test data
  const createBookRow = (overrides?: Partial<BookRow>): BookRow => ({
    id: 1,
    name: "Test Book",
    coverId: "cover.jpg",
    author: "Test Author",
    description: "Test description",
    isbn: "123",
    publishingHouse: "Test Publisher",
    publishedAt: "2023-01-01",
    categories: [],
    readStart: null,
    readEnd: null,
    addedAt: new Date(),
    status: "À lire",
    ...overrides,
  });

  const booksFixture: BookRow[] = [
    createBookRow({
      id: 1,
      name: "Alpha",
      status: "Lu",
      description: "A great book",
      coverId: "cover1.jpg",
      author: "Author 1",
      isbn: "111",
      publishingHouse: "Publisher 1",
      publishedAt: "2023-01-01",
    }),
    createBookRow({
      id: 2,
      name: "Beta",
      status: "En cours",
      description: "An interesting book",
      coverId: "cover2.jpg",
      author: "Author 2",
      isbn: "222",
      publishingHouse: "Publisher 2",
      publishedAt: "2023-02-01",
    }),
    createBookRow({
      id: 3,
      name: "Gamma",
      status: "À lire",
      description: "A book to read",
      coverId: "cover3.jpg",
      author: "Author 3",
      isbn: "333",
      publishingHouse: "Publisher 3",
      publishedAt: "2023-03-01",
    }),
  ];

  const useUserBooksMock = vi.fn(() => ({
    books: booksFixture,
    refetch: vi.fn(),
    removeBook: vi.fn(),
    updateStatus: vi.fn(),
  }));

  return { booksFixture, useUserBooksMock };
});

vi.mock("@/hooks/useUserBooks", () => ({
  useUserBooks: useUserBooksMock,
}));

describe("LibraryPage", () => {
  it("shows status counters", () => {
    render(<LibraryPage />);

    expect(screen.getByText(/Lus/)).toBeInTheDocument();
    expect(screen.getByText(/En cours/)).toBeInTheDocument();
    expect(screen.getByText(/À lire/)).toBeInTheDocument();
  });

  it("filters by search input", async () => {
    const user = userEvent.setup();
    render(<LibraryPage />);

    const input = screen.getByPlaceholderText("Rechercher un livre...");
    await user.type(input, "Alpha");

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });

  it("renders all cards when search is empty", () => {
    render(<LibraryPage />);

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("shows empty state when no books", async () => {
    useUserBooksMock.mockImplementationOnce(() => ({
      books: [],
      refetch: vi.fn(),
      removeBook: vi.fn(),
      updateStatus: vi.fn(),
    }));

    render(<LibraryPage />);

    expect(screen.getByText("Aucun livre trouvé.")).toBeInTheDocument();
  });

  it("opens AddBookModal when clicking add button", async () => {
    const user = userEvent.setup();
    render(<LibraryPage />);

    const addButton = screen.getByRole("button", { name: /ajouter/i });
    await user.click(addButton);

    expect(screen.getByTestId("add-book-modal")).toBeInTheDocument();
  });
});
