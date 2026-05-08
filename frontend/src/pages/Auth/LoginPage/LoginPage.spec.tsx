import { vi } from "vitest";
// Partial mock of @tanstack/react-router to override only useNavigate
vi.mock("@tanstack/react-router", async (importActual) => {
  const actual = await importActual();
  return {
    ...actual!,
    useNavigate: () => vi.fn(),
  };
});

// Import testing tools
import { expect, it, describe, beforeEach } from "vitest";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/routes/routes";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import api from "@/api/axios";

describe("Login Page", async () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  // Utility function to render the page with all necessary providers (QueryClientProvider and RouterProvider)
  // Navigate first to /login so the correct route is displayed
  const renderWithProviders = async (initialPath: string) => {
    await router.navigate({ to: initialPath });
    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
  };

  it("should render the login page with title 'Connexion'", async () => {
    await renderWithProviders("/login");
    expect(await screen.findByText("Connexion")).toBeInTheDocument();
  });

  it("should submit login request with credentials", async () => {
    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValue({ data: { id: 1, email: "test@example.com" } });
    const { container } = await renderWithProviders("/login");
    const emailInput = screen.getAllByRole("textbox")[0];
    const passwordInput = container.querySelector('input[type="password"]');
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput!, "testpass");
    await userEvent.click(screen.getByText("Soumettre"));
    expect(postSpy).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "testpass",
    });
    postSpy.mockRestore();
  });

  it("should handle login error and show message", async () => {
    const postSpy = vi.spyOn(api, "post").mockRejectedValue({
      response: { data: { message: "Email ou mot de passe incorrect" } },
      message: "Error",
    });
    const { container } = await renderWithProviders("/login");
    const emailInput = screen.getAllByRole("textbox")[0];
    const passwordInput = container.querySelector('input[type="password"]');
    await userEvent.type(emailInput, "wrong@example.com");
    await userEvent.type(passwordInput!, "wrongpass");
    await userEvent.click(screen.getByText("Soumettre"));
    expect(
      await screen.findByText("Email ou mot de passe incorrect"),
    ).toBeInTheDocument();
    postSpy.mockRestore();
  });
});
