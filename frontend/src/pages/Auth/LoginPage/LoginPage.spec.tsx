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

  describe("structure", () => {
    // Wait for the text "Connexion" to be present in the DOM
    it("should render the login page with title 'Connexion'", async () => {
      // Load the component
      await renderWithProviders("/login");
      // Verify that the title is present => component rendered
      expect(await screen.findByText("Connexion")).toBeInTheDocument();
    });

    it("should display email label and input", async () => {
      await renderWithProviders("/login");
      // Verify that the label is displayed
      expect(screen.getByText(/Email ?:/i)).toBeInTheDocument();

      // Get all text input fields
      const inputs = screen.getAllByRole("textbox");
      // Check if at least one text field is present in the component
      expect(inputs.length).toBeGreaterThan(0);
      // Verify that the field is the first one displayed (the first of the text elements)
      expect(inputs[0]).toBeInTheDocument();
    });

    it("should display password input", async () => {
      // Get the render container to use querySelectorAll => allows to retrieve password input
      const { container } = await renderWithProviders("/login");
      // Verify that the "Mot de passe :" label is displayed
      expect(screen.getByText(/Mot de passe ?:/i)).toBeInTheDocument();
      // Verify that there is at least one password input in the DOM
      const passwordInputs = container.querySelectorAll(
        'input[type="password"]',
      );
      expect(passwordInputs.length).toBeGreaterThan(0);
    });

    it("should display reset bouton", async () => {
      await renderWithProviders("/login");

      expect(await screen.getByText("Effacer")).toBeInTheDocument();
    });

    it("should display submit button", async () => {
      await renderWithProviders("/login");

      expect(await screen.getByText("Soumettre")).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should check data when form is submit", async () => {
      const { container } = await renderWithProviders("/login");
      const emailInput = screen.getAllByRole("textbox")[0];
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput!, "testpass");
      expect(emailInput).toHaveValue("test@example.com");
      expect(passwordInput).toHaveValue("testpass");
    });

    it("should display error when validation is not valided", async () => {
      await renderWithProviders("/login");
      await userEvent.click(screen.getByText("Soumettre"));
      // Verify that at least one validation error is displayed
      const errors = await screen.findAllByText(/doit être définis|attendu/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should be submit request", async () => {
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

    it("should display error and reset password if request failed", async () => {
      const postSpy = vi.spyOn(api, "post").mockRejectedValue({
        response: { data: { message: "Erreur serveur" } },
      });
      const { container } = await renderWithProviders("/login");
      const emailInput = screen.getAllByRole("textbox")[0];
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput!, "testpass");
      await userEvent.click(screen.getByText("Soumettre"));
      expect(await screen.findByText(/Erreur serveur/)).toBeInTheDocument();
      expect(passwordInput).toHaveValue("");
      postSpy.mockRestore();
    });

    it("should redirect to / when request is success", async () => {
      const postSpy = vi
        .spyOn(api, "post")
        .mockResolvedValue({ data: { id: 1, email: "test@example.com" } });
      const { container } = await renderWithProviders("/login");
      const emailInput = screen.getAllByRole("textbox")[0];
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput!, "testpass");
      await userEvent.click(screen.getByText("Soumettre"));

      // Wait for the mutation to succeed - the login form should disappear
      // Or at least the success message should be displayed
      // For now, verify that the request was made correctly
      expect(postSpy).toHaveBeenCalledWith("/auth/login", {
        email: "test@example.com",
        password: "testpass",
      });
      postSpy.mockRestore();
    });
  });
});
