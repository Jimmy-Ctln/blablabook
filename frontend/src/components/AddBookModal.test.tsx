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
  }
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
    if (queryKey[0] === "userBooks") {
      return { data: [], isFetching: false, refetch: vi.fn() };
    }
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

    render(<AddBookModal isOpen onClose={() => undefined} userId={1} />);

    const button = screen.getByRole("button", { name: /rechercher/i });
    await user.click(button);

    expect(refetchMock).not.toHaveBeenCalled();
  });

  it("renders the first category from results", () => {
    setupDefaultQueries();
    render(<AddBookModal isOpen onClose={() => undefined} userId={1} />);

    expect(screen.getByText("Romance")).toBeInTheDocument();
  });

  it("triggers search refetch when clicking search", async () => {
    setupDefaultQueries();
    const user = userEvent.setup();
    render(<AddBookModal isOpen onClose={() => undefined} userId={1} />);

    const input = screen.getByPlaceholderText("Rechercher un livre...");
    await user.type(input, "Harry");

    const button = screen.getByRole("button", { name: /rechercher/i });
    await user.click(button);

    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows empty state after search with no results", async () => {
    const user = userEvent.setup();

    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      const queryKey = Array.isArray(options?.queryKey) ? options.queryKey : [];
      if (queryKey[0] === "userBooks") {
        return { data: [], isFetching: false, refetch: vi.fn() };
      }
      if (queryKey[0] === "externalBooks") {
        return { data: [], isFetching: false, refetch: vi.fn() };
      }
      return { data: [], isFetching: false, refetch: vi.fn() };
    });

    render(<AddBookModal isOpen onClose={() => undefined} userId={1} />);

    const input = screen.getByPlaceholderText("Rechercher un livre...");
    await user.type(input, "Nope");

    const button = screen.getByRole("button", { name: /rechercher/i });
    await user.click(button);

    expect(screen.getByText("Aucun livre trouvé.")).toBeInTheDocument();
  });

  it("calls mutate when clicking add button", async () => {
    setupDefaultQueries();
    const user = userEvent.setup();

    render(<AddBookModal isOpen onClose={() => undefined} userId={1} />);

    const addButton = screen.getByRole("button", {
      name: "Ajouter à la librairie",
    });
    await user.click(addButton);

    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it("shows checkmark when book already in library", () => {
    useQueryMock.mockImplementation((options: Record<string, unknown>) => {
      const queryKey = Array.isArray(options?.queryKey) ? options.queryKey : [];
      if (queryKey[0] === "userBooks") {
        return { data: [{ isbn: "123" }], isFetching: false, refetch: vi.fn() };
      }
      if (queryKey[0] === "externalBooks") {
        return { data: [mockBook], isFetching: false, refetch: refetchMock };
      }
      return { data: [], isFetching: false, refetch: vi.fn() };
    });

    render(<AddBookModal isOpen onClose={() => undefined} userId={1} />);

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Ajouter à la librairie" })
    ).toBeNull();
  });

  it("navigates to details when clicking a result", async () => {
    setupDefaultQueries();
    const user = userEvent.setup();

    render(<AddBookModal isOpen onClose={() => undefined} userId={1} />);

    await user.click(screen.getByText("Le Livre"));

    expect(navigateMock).toHaveBeenCalledWith({ to: "/books/123" });
  });
});
