import { vi } from "vitest";
import { expect, it, describe, beforeEach } from "vitest";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/routes/routes";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import api from "@/api/axios";
import { Toaster } from "@/components/ui/sonner";

describe("Register Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithProviders = async (initialPath = "/register") => {
    await router.navigate({ to: initialPath });
    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>,
    );
  };

  describe("form", () => {
    it("should render the register page with title", async () => {
      await renderWithProviders("/register");
      expect(await screen.findByText("Créer un compte")).toBeInTheDocument();
    });

    it("should submit registration request", async () => {
      const postSpy = vi
        .spyOn(api, "post")
        .mockResolvedValue({ data: { id: 1, username: "testuser" } });
      const { container } = await renderWithProviders("/register");
      const inputs = screen.getAllByRole("textbox");
      const passwordInput = container.querySelector('input[type="password"]');
      expect(passwordInput).not.toBeNull();
      await userEvent.type(inputs[0], "testuser");
      await userEvent.type(inputs[1], "test@email.com");
      await userEvent.type(passwordInput!, "Password123!");
      const confirmInput = container.querySelectorAll(
        'input[type="password"]',
      )[1];
      await userEvent.type(confirmInput!, "Password123!");
      await userEvent.click(screen.getByText("Créer mon compte →"));
      expect(postSpy).toHaveBeenCalledWith("/auth/register", {
        email: "test@email.com",
        username: "testuser",
        password: "Password123!",
        confirmPassword: "Password123!",
      });
      postSpy.mockRestore();
    });

    it("should handle registration error", async () => {
      const postSpy = vi.spyOn(api, "post").mockRejectedValue({
        response: { data: { message: "email is already in use" } },
        message: "Error",
      });
      const { container } = await renderWithProviders("/register");
      const inputs = screen.getAllByRole("textbox");
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(inputs[0], "user");
      await userEvent.type(inputs[1], "existing@email.com");
      await userEvent.type(passwordInput!, "Password123!");
      const confirmInput = container.querySelectorAll(
        'input[type="password"]',
      )[1];
      await userEvent.type(confirmInput!, "Password123!");
      await userEvent.click(screen.getByText("Créer mon compte →"));
      expect(await screen.findByText("Cette adresse email est déjà utilisée")).toBeInTheDocument();
      postSpy.mockRestore();
    });
  });
});
