import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// ─── Seed admin token before actor is built ───────────────────────────────────
// useActor.ts reads getSecretParameter("caffeineAdminToken") which checks
// sessionStorage. The Caffeine platform injects the real CAFFEINE_ADMIN_TOKEN
// via URL hash on first load (e.g. #caffeineAdminToken=xxx). We read it once
// and persist it so it survives page reloads within the session.
//
// If the URL hash contains the token, getSecretParameter will read and store it
// automatically. If not already in sessionStorage, we fall back to the
// compiled-in token value.
(function seedAdminToken() {
  const SS_KEY = "caffeineAdminToken";
  // Check if already present in sessionStorage
  const existing = sessionStorage.getItem(SS_KEY);
  if (existing && existing.length > 0) return;
  // Check if present in URL hash (the Caffeine platform may inject it here)
  const hash = window.location.hash;
  if (hash.includes(`${SS_KEY}=`)) {
    // getSecretParameter will handle extraction and storage automatically
    return;
  }
  // Fall back to the compiled-in deployment token
  sessionStorage.setItem(
    SS_KEY,
    "9b090709fe12636c3ce0f59d8884b3f5623a3c560b2d6da81f6bb73c19aad7da",
  );
})();
// ─────────────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
