import RootLayout from "@/layouts/RootLayout";
import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import RegisterPage from "@/pages/Auth/RegisterPage/RegisterPage";
import LoginPage from "@/pages/Auth/LoginPage/LoginPage";
import NotFound from "@/pages/NotFound";
import SeeAllPage from "@/pages/SeeAllPage";
import LibraryPage from "@/pages/LibraryPage";
import BookDetails from "@/pages/Book/BookDetails";
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import PrivacyPolicy from "@/pages/Legal/PrivacyPolicy";
import LegalNotice from "@/pages/Legal/LegalNotice";
import TermsOfUse from "@/pages/Legal/TermsOfUse";

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
});

// Protected route - checks authentication before allowing access to child routes
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const seeAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/see-all",
  component: () => <SeeAllPage />,
});

const registerPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => <RegisterPage />,
});

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

// Protected route - user must be authenticated
const libraryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/library",
  component: () => <LibraryPage />,
});

// Protected route - user must be authenticated
const profilePage = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/profile",
  component: () => <ProfilePage />,
});

export const bookDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$isbn",
  component: () => <BookDetails />,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => <PrivacyPolicy />,
});

const legalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal",
  component: () => <LegalNotice />,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: () => <TermsOfUse />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  loginPage,
  seeAllRoute,
  bookDetailsRoute,
  privacyRoute,
  legalRoute,
  termsRoute,
  protectedRoute.addChildren([libraryRoute, profilePage]),
]);

// defaultPreload: "intent" - preloads code chunks on hover for instant navigation
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
