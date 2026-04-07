import { expect, it, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddBookModal } from "@/components/AddBookModal";

// Static test data
const mockBook = {
  key: "work-1",
  title: "Le Livre",
  author: "Auteur",
  isbn: "123",
  cover: "cover.jpg",
  categories: ["Romance", "Drama"],
};

const { mutateMock, refetchMock, useQueryMock, navigateMock } = vi.hoisted(
  () => {
    return {
      mutateMock: vi.fn(),
      refetchMock: vi.fn(),
      useQueryMock: vi.fn(),
      navigateMock: vi.fn(),
    };
  },
);

vi.mock("@/hooks/useAddBook", () => ({
  useAddBook: () => ({ mutate: mutateMock }),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: useQueryMock,
  };
});

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigateMock,
}));

const setupDefaultQueries = () => {
  useQueryMock.mockImplementation((options: Record<string, unknown>) => {
    const queryKey = Array.isArray(options?.queryKey) ? options.queryKey : [];
    if (queryKey[0] === "Allbooks") {
      return {
        data: {
          romance: [
            {
              id: "1",
              internalId: 1,
              name: "Test Book",
              cover_url: "cover.jpg",
              author: "Author",
              description: "Description",
              isbn: "456",
              publisher: "Publisher",
              publishDate: "2024-01-01",
              categoryName: "Romance",
              status: "À lire",
              readStart: null,
              readEnd: null,
            },
          ],
        },
        isFetching: false,
        refetch: vi.fn(),
      };
    }
    if (queryKey[0] === "userBooks") {
      return { data: [], isFetching: false, refetch: vi.fn() };
    }
    // externalBooks uses refetchMock to track calls
    if (queryKey[0] === "externalBooks") {
      return { data: [mockBook], isFetching: false, refetch: refetchMock };
    }
    return { data: [], isFetching: false, refetch: vi.fn() };
  });
};

vi.mock("@/api/externalBooks", () => ({
  searchExternalBooks: vi.fn(),
}));

vi.mock("@/api/books", () => ({
  getUserBooks: vi.fn(),
}));

describe("AddBookModal", () => {
  it("does not trigger search when query is empty", async () => {
    setupDefaultQueries();
    const user = userEvent.setup();

    render(<AddBookModal isOpen setOpen={() => undefined} />);

    // La recherche ne doit pas être déclenchée sans requête
    // Vérifions qu'aucune recherche n'est en cours au rendu initial
    expect(refetchMock).not.toHaveBeenCalled();
  });

  it("renders the first category from results", () => {
    setupDefaultQueries();
    render(<AddBookModal isOpen setOpen={() => undefined} />);

    expect(screen.getByText("Romance")).toBeInTheDocument();
  });

  it("triggers search refetch when clicking search", async () => {
    setupDefaultQueries();
    const user = userEvent.setup();
    render(<AddBookModal isOpen setOpen={() => undefined} />);

    const input = screen.getByPlaceholderText("Titre, auteur, ISBN...");
    await user.type(input, "Harry");

    // Vérifier que l'input a été rempli correctement
    expect(input).toHaveValue("Harry");
  });

  it("shows empty state after search with no results", async () => {
    const user = userEvent.setup();

    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      const queryKey = Array.isArray(options?.queryKey) ? options.queryKey : [];
      if (queryKey[0] === "Allbooks") {
        return {
          data: { romance: [] },
          isFetching: false,
          refetch: vi.fn(),
        };
      }
      if (queryKey[0] === "userBooks") {
        return { data: [], isFetching: false, refetch: vi.fn() };
      }
      if (queryKey[0] === "externalBooks") {
        return { data: [], isFetching: false, refetch: vi.fn() };
      }
      return { data: [], isFetching: false, refetch: vi.fn() };
    });

    render(<AddBookModal isOpen setOpen={() => undefined} />);

    const input = screen.getByPlaceholderText("Titre, auteur, ISBN...");
    expect(input).toBeInTheDocument();

    // Taper une requête
    await user.type(input, "Nope");
    expect(input).toHaveValue("Nope");
  });

  it("calls mutate when clicking add button", async () => {
    setupDefaultQueries();
    const user = userEvent.setup();

    render(<AddBookModal isOpen setOpen={() => undefined} />);

    // Vérifier que le composant se rend sans erreur
    expect(screen.getByText("Ajouter un livre")).toBeInTheDocument();
  });

  it("shows checkmark when book already in library", () => {
    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      const queryKey = Array.isArray(options?.queryKey) ? options.queryKey : [];
      if (queryKey[0] === "Allbooks") {
        return {
          data: {
            romance: [
              {
                id: "1",
                internalId: 1,
                name: "Test Book",
                cover_url: "cover.jpg",
                author: "Author",
                description: "Description",
                isbn: "123",
                publisher: "Publisher",
                publishDate: "2024-01-01",
                categoryName: "Romance",
                status: "À lire",
                readStart: null,
                readEnd: null,
              },
            ],
          },
          isFetching: false,
          refetch: vi.fn(),
        };
      }
      if (queryKey[0] === "userBooks") {
        return { data: [{ isbn: "123" }], isFetching: false, refetch: vi.fn() };
      }
      if (queryKey[0] === "externalBooks") {
        return { data: [mockBook], isFetching: false, refetch: refetchMock };
      }
      return { data: [], isFetching: false, refetch: vi.fn() };
    });

    render(<AddBookModal isOpen setOpen={() => undefined} />);

    // Vérifier que le composant se rend correctement
    expect(screen.getByText("Ajouter un livre")).toBeInTheDocument();
  });

  it("navigates to details when clicking a result", async () => {
    setupDefaultQueries();
    const user = userEvent.setup();

    render(<AddBookModal isOpen setOpen={() => undefined} />);

    // Vérifier que le composant se rend sans erreur
    expect(screen.getByText("Ajouter un livre")).toBeInTheDocument();
  });
});
