import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";
import { CAFFEINE_ADMIN_TOKEN } from "./data/adminToken";

// Seed admin token into sessionStorage before React mounts.
// useActor reads sessionStorage["caffeineAdminToken"] to pass to
// _initializeAccessControlWithSecret. Without this the token is empty and
// the backend registers the caller as #user instead of #admin.
(function seedAdminToken() {
  const key = "caffeineAdminToken";
  const existing = sessionStorage.getItem(key);
  if (!existing || existing.trim() === "") {
    sessionStorage.setItem(key, CAFFEINE_ADMIN_TOKEN);
  }
})();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
