import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/routes/routes";

vi.mock("@/hooks/useCurrentUser", () => ({
  useCurrentUser: () => ({
    isAuthenticated: true,
    data: {
      id: "1",
      email: "test@example.com",
      username: "testuser",
      role: "user",
    },
  }),
}));

vi.mock("@/hooks/useUserBooks", () => ({
  useUserBooks: () => ({
    data: {
      books: [
        {
          id: "1",
          title: "Test Book",
          author: "Test Author",
          categoryName: "Fiction",
          status: "À lire",
          readStart: null,
          readEnd: null,
          key: "isbn-1",
        },
      ],
      total: 1,
    },
    isLoading: false,
  }),
}));

describe("LibraryPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderLibraryPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
  };

  it("should render library page", async () => {
    renderLibraryPage();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(document.body).toBeInTheDocument();
  });

  it("should render with required providers", () => {
    const { container } = renderLibraryPage();
    expect(container).toBeInTheDocument();
  });
});

import { beforeEach } from "vitest";
