import { vi } from 'vitest';
// Mock partiel de @tanstack/react-router pour ne surcharger que useNavigate
vi.mock('@tanstack/react-router', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual!,
    useNavigate: () => vi.fn(),
  };
});

// Import des outils de test
import { expect, it, describe, beforeEach } from 'vitest'
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/routes/routes';
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from '@testing-library/user-event';
import api from '@/api/axios';

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

  // Fonction utilitaire pour rendre la page avec tous les providers nécessaires (QueryClientProvider et RouterProvider)
  // On navigue d'abord vers /login pour que la bonne route soit affichée
  const renderWithProviders = async (initialPath: string) => {
    await router.navigate({ to: initialPath });
    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  };

  describe("structure", () => {
    // On attend que le texte "Connexion" soit présent dans le DOM
    it("should render the login page with title 'Connexion'", async () => {
      // on vient charger le composant
      await renderWithProviders('/login');
      // on vérifie que le titre est bien présent => composant rendu
      expect(await screen.findByText('Connexion')).toBeInTheDocument();
    });

    it("should display username label and input", async () => {
      await renderWithProviders("/login");
      // Vérifie que le label est bien affiché
      expect(screen.getByText(/Nom d'utilisateur ?:/i)).toBeInTheDocument();

      // récupère tous les champs de type text
      const inputs = screen.getAllByRole('textbox');
      // check si au moins un champ text est présent dans le composant
      expect(inputs.length).toBeGreaterThan(0);
      // on vérifie que le champ est le premier afficher (le premier des élément text)
      expect(inputs[0]).toBeInTheDocument();
    });

    it("should display password input", async () => {
      // On récupère le container du rendu pour pouvoir utiliser querySelectorAll => permet de récupérer l'input type password
      const { container } = await renderWithProviders('/login');
      // Vérifie que le label "Mot de passe :" est affiché
      expect(screen.getByText(/Mot de passe ?:/i)).toBeInTheDocument();
      // Vérifie qu'il y a au moins un input de type password dans le DOM
      const passwordInputs = container.querySelectorAll('input[type="password"]');
      expect(passwordInputs.length).toBeGreaterThan(0);
    });

    it("should display reset bouton", async () => {
      await renderWithProviders('/login');

      expect(await screen.getByText('Effacer')).toBeInTheDocument();
    });

    it("should display submit button", async () => {
      await renderWithProviders("/login");

      expect(await screen.getByText('Soumettre')).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should check data when form is submit", async () => {
      const { container } = await renderWithProviders('/login');
      const usernameInput = screen.getAllByRole('textbox')[0];
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput!, 'testpass');
      expect(usernameInput).toHaveValue('testuser');
      expect(passwordInput).toHaveValue('testpass');
    });

    it('should display error when validation is not valided', async () => {
      await renderWithProviders('/login');
      await userEvent.click(screen.getByText('Soumettre'));
      // Vérifie qu'au moins une erreur de validation s'affiche
      const errors = await screen.findAllByText(/doit être définis|attendu/i);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should be submit request", async () => {
      const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1, username: 'testuser' } });
      const { container } = await renderWithProviders('/login');
      const usernameInput = screen.getAllByRole('textbox')[0];
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput!, 'testpass');
      await userEvent.click(screen.getByText('Soumettre'));
      expect(postSpy).toHaveBeenCalledWith('/auth/login', { username: 'testuser', password: 'testpass' });
      postSpy.mockRestore();
    });

    it("should display error and reset password if request failed", async () => {
      const postSpy = vi.spyOn(api, 'post').mockRejectedValue({ response: { data: { message: 'Erreur serveur' } } });
      const { container } = await renderWithProviders('/login');
      const usernameInput = screen.getAllByRole('textbox')[0];
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput!, 'testpass');
      await userEvent.click(screen.getByText('Soumettre'));
      expect(await screen.findByText(/Erreur serveur/)).toBeInTheDocument();
      expect(passwordInput).toHaveValue('');
      postSpy.mockRestore();
    });

    it("should redirect to / when request is success", async () => {
      const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1, username: 'testuser' } });
      const { container } = await renderWithProviders('/login');
      const usernameInput = screen.getAllByRole('textbox')[0];
      const passwordInput = container.querySelector('input[type="password"]');
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput!, 'testpass');
      await userEvent.click(screen.getByText('Soumettre'));
      expect(await screen.findByText(/Accueil|Bienvenue|Home/i)).toBeInTheDocument();
      postSpy.mockRestore();
    });
  });
});
