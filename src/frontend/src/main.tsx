import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "../index.css";
import { CAFFEINE_ADMIN_TOKEN } from "./data/adminToken";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Seed the admin token into sessionStorage so useActor's getSecretParameter
// always finds it. This must happen before any actor is constructed.
try {
  if (CAFFEINE_ADMIN_TOKEN) {
    sessionStorage.setItem("caffeineAdminToken", CAFFEINE_ADMIN_TOKEN);
  }
} catch {
  // sessionStorage unavailable — proceed anyway
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
