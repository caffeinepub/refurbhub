import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { SiWhatsapp } from "react-icons/si";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AboutPage } from "./pages/AboutPage";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { ShopPage } from "./pages/ShopPage";
import { WhyRefurbishedPage } from "./pages/WhyRefurbishedPage";

/* ─── Root Layout ─── */
const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
          {/* Floating WhatsApp button */}
          <a
            href="https://wa.me/919310787939"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="whatsapp.float_button"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <SiWhatsapp className="h-7 w-7 text-white" />
          </a>
        </div>
        <Toaster position="bottom-right" richColors />
      </WishlistProvider>
    </CartProvider>
  ),
});

/* ─── Routes ─── */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const whyRefurbishedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/why-refurbished",
  component: WhyRefurbishedPage,
});

/* ─── Router ─── */
const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  adminRoute,
  aboutRoute,
  whyRefurbishedRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
