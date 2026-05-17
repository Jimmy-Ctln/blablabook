import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout() {
  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-background focus:text-foreground focus:ring-2 focus:ring-ring"
      >
        Passer au contenu principal
      </a>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-w-0 overflow-x-hidden">
        <Header />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CookieConsent />
      </SidebarInset>
    </SidebarProvider>
  );
}
