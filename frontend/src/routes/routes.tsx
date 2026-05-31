import RootLayout from "@/layouts/RootLayout";
import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import NotFound from "@/pages/NotFound";
import HomePage from "@/pages/HomePage";
import { Loader } from "@/components/Loader";

// Silent refresh is attempted once per app load. We keep the in-flight promise
// so protected routes can await the *same* attempt instead of firing their own.
let silentRefreshPromise: Promise<void> | null = null;

function ensureSilentRefresh(): Promise<void> {
  if (silentRefreshPromise) return silentRefreshPromise;

  silentRefreshPromise = (async () => {
    const { isAuthenticated, login } = useAuthStore.getState();
    if (isAuthenticated) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
        {},
        // Timeout so a cold backend can't keep the app blank indefinitely.
        { withCredentials: true, timeout: 10000 },
      );
      if (data?.user) {
        login(data.user);
      }
    } catch {}
  })();

  return silentRefreshPromise;
}

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
  beforeLoad: () => {
    void ensureSilentRefresh();
  },
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: async () => {
    await ensureSilentRefresh();
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
    () => import("@/pages/Auth/RegisterPage/RegisterPage"),
  ),
});

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: lazyRouteComponent(
    () => import("@/pages/Auth/LoginPage/LoginPage"),
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
    () => import("@/pages/ProfilePage/ProfilePage"),
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

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  // Never leave the user on a blank screen while a route's beforeLoad resolves
  // (e.g. a protected route waiting on the silent auth refresh).
  defaultPendingComponent: () => (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Loader />
    </div>
  ),
});

export { rootRoute };
