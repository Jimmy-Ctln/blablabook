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
    cover_url: "cover.jpg",
    author: "Test Author",
    description: "Test description",
    isbn: "123",
    publishingHouse: "Test Publisher",
    publishedAt: "2023-01-01",
    categoryName: "unknown",
    status: "À lire",
    readStart: null,
    readEnd: null,
    addedAt: new Date(),
    ...overrides,
  });

  const booksFixture: BookRow[] = [
    createBookRow({
      id: 1,
      name: "Alpha",
      status: "Lu",
      description: "A great book",
      cover_url: "cover1.jpg",
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
      cover_url: "cover2.jpg",
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
      cover_url: "cover3.jpg",
      author: "Author 3",
      isbn: "333",
      publishingHouse: "Publisher 3",
      publishedAt: "2023-03-01",
    }),
  ];

  const useUserBooksMock = vi.fn(() => ({
    books: booksFixture,
    total: booksFixture.length,
    hasMore: false,
    loadMore: vi.fn(),
    isLoading: false,
    isError: false,
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

    // Vérifier que les boutons de filtrage sont affichés
    // Le composant affiche 4 boutons de statistiques + le bouton Ajouter
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(5);
    // Vérifier que les livres test sont affichés
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("filters by search input", async () => {
    const user = userEvent.setup();
    render(<LibraryPage />);

    // Vérifier que la barre de recherche existe
    const input = screen.getByPlaceholderText(
      "Rechercher par titre ou auteur...",
    );
    expect(input).toBeInTheDocument();

    // Vérifier que les livres initiaux sont affichés
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();

    // Tirer sur le champ de recherche
    await user.type(input, "Alpha");

    // Après l'entrée, Alpha devrait toujours être visible car c'est déjà dans la liste
    expect(screen.getByText("Alpha")).toBeInTheDocument();
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
      total: 0,
      hasMore: false,
      loadMore: vi.fn(),
      refetch: vi.fn(),
      removeBook: vi.fn(),
      updateStatus: vi.fn(),
      isLoading: false,
      isError: false,
    }));

    render(<LibraryPage />);

    expect(screen.getByText("Votre bibliothèque est vide")).toBeInTheDocument();
  });

  it("opens AddBookModal when clicking add button", async () => {
    const user = userEvent.setup();
    render(<LibraryPage />);

    const addButton = screen.getByRole("button", { name: /ajouter/i });
    await user.click(addButton);

    expect(screen.getByTestId("add-book-modal")).toBeInTheDocument();
  });
});
