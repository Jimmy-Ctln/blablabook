import { vi } from 'vitest';
import { expect, it, describe, beforeEach } from 'vitest';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/routes/routes';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import api from '@/api/axios';

describe('Register Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithProviders = async (initialPath = '/register') => {
    await router.navigate({ to: initialPath });
    return render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  };

  describe('structure', () => {
    it('should render the register page with title', async () => {
      await renderWithProviders('/register');
      expect(await screen.findByText('Inscription')).toBeInTheDocument();
    });
    it('should display all input fields', async () => {
      await renderWithProviders('/register');
      expect(screen.getByText(/^Email ?:/i)).toBeInTheDocument();
      expect(screen.getByText(/^Nom d'utilisateur ?:/i)).toBeInTheDocument();
      expect(screen.getByText(/^Mot de passe ?:/i)).toBeInTheDocument();
      expect(screen.getByText(/^Confirmation du mot de passe ?:/i)).toBeInTheDocument();
    });
    it('should display reset and submit buttons', async () => {
      await renderWithProviders('/register');
      expect(screen.getByText('Effacer')).toBeInTheDocument();
      expect(screen.getByText('Soumettre')).toBeInTheDocument();
    });
    it('should display login link', async () => {
      await renderWithProviders('/register');
      const link = screen.getByRole('link', { name: /connectez-vous/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/login');
    });
  });

  describe('validation', () => {
    it('should display error if fields are empty', async () => {
      await renderWithProviders('/register');
      await userEvent.click(screen.getByText('Soumettre'));
      const errors = await screen.findAllByText(/invalide|doit contenir|attendu|confirmer/i);
      expect(errors.length).toBeGreaterThan(0);
    });
    it('should display error if passwords do not match', async () => {
      const { container } = await renderWithProviders('/register');
      const inputs = screen.getAllByRole('textbox');
      const passwordInput = container.querySelector('input[type="password"]');
      expect(passwordInput).not.toBeNull();
      await userEvent.type(inputs[0], 'test@email.com');
      await userEvent.type(inputs[1], 'testuser');
      await userEvent.type(passwordInput!, 'password123');
      const confirmInput = container.querySelectorAll('input[type="password"]')[1];
      await userEvent.type(confirmInput!, 'password456');
      await userEvent.click(screen.getByText('Soumettre'));
      expect(await screen.findByText(/la confirmation du mot de passe a échouée/i)).toBeInTheDocument();
    });
  });

  describe('behavior', () => {
    it('should submit form and call API', async () => {
      const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1, username: 'testuser' } });
      const { container } = await renderWithProviders('/register');
      const inputs = screen.getAllByRole('textbox');
      const passwordInput = container.querySelector('input[type="password"]');
      expect(passwordInput).not.toBeNull();
      await userEvent.type(inputs[0], 'test@email.com');
      await userEvent.type(inputs[1], 'testuser');
      await userEvent.type(passwordInput!, 'password123');
      const confirmInput = container.querySelectorAll('input[type="password"]')[1];
      await userEvent.type(confirmInput!, 'password123');
      await userEvent.click(screen.getByText('Soumettre'));
      expect(postSpy).toHaveBeenCalledWith('/auth/register', {
        email: 'test@email.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      });
      postSpy.mockRestore();
    });
    it('should display error and reset passwords if API fails', async () => {
      const postSpy = vi.spyOn(api, 'post').mockRejectedValue({ response: { data: { message: 'Erreur serveur' } } });
      const { container } = await renderWithProviders('/register');
      const inputs = screen.getAllByRole('textbox');
      const passwordInput = container.querySelector('input[type="password"]');
      expect(passwordInput).not.toBeNull();
      await userEvent.type(inputs[0], 'test@email.com');
      await userEvent.type(inputs[1], 'testuser');
      await userEvent.type(passwordInput!, 'password123');
      const confirmInput = container.querySelectorAll('input[type="password"]')[1];
      await userEvent.type(confirmInput!, 'password123');
      await userEvent.click(screen.getByText('Soumettre'));
      expect(await screen.findByText(/Erreur serveur/)).toBeInTheDocument();
      expect(passwordInput!).toHaveValue('');
      expect(confirmInput!).toHaveValue('');
      postSpy.mockRestore();
    });
    it('should redirect to /login on success', async () => {
      const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1, username: 'testuser' } });
      const { container } = await renderWithProviders('/register');
      const inputs = screen.getAllByRole('textbox');
      const passwordInput = container.querySelector('input[type="password"]');
      expect(passwordInput).not.toBeNull();
      await userEvent.type(inputs[0], 'test@email.com');
      await userEvent.type(inputs[1], 'testuser');
      await userEvent.type(passwordInput!, 'password123');
      const confirmInput = container.querySelectorAll('input[type="password"]')[1];
      await userEvent.type(confirmInput!, 'password123');
      await userEvent.click(screen.getByText('Soumettre'));
      expect(await screen.findByText(/Connexion/i)).toBeInTheDocument();
      postSpy.mockRestore();
    });
  });
});
