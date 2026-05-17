import RootLayout from "@/layouts/RootLayout";
import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import NotFound from "@/pages/NotFound";
import HomePage from "@/pages/HomePage";

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

const registerPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: lazyRouteComponent(
    () => import("@/pages/Auth/RegisterPage/RegisterPage")
  ),
});

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: lazyRouteComponent(
    () => import("@/pages/Auth/LoginPage/LoginPage")
  ),
});

// Protected route - user must be authenticated
const libraryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/library",
  component: lazyRouteComponent(() => import("@/pages/LibraryPage")),
});

// Protected route - user must be authenticated
const profilePage = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/profile",
  component: lazyRouteComponent(
    () => import("@/pages/ProfilePage/ProfilePage")
  ),
});

export const bookDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$isbn",
  component: lazyRouteComponent(() => import("@/pages/Book/BookDetails")),
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: lazyRouteComponent(() => import("@/pages/Legal/PrivacyPolicy")),
});

const legalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal",
  component: lazyRouteComponent(() => import("@/pages/Legal/LegalNotice")),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: lazyRouteComponent(() => import("@/pages/Legal/TermsOfUse")),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: lazyRouteComponent(() => import("@/pages/SearchResultsPage")),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  loginPage,
  bookDetailsRoute,
  privacyRoute,
  legalRoute,
  termsRoute,
  searchRoute,
  protectedRoute.addChildren([libraryRoute, profilePage]),
]);

// defaultPreload: "intent" - preloads code chunks on hover for instant navigation
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
