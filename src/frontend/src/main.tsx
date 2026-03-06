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

// Seed the admin token into sessionStorage so useActor can find it via
// getSecretParameter("caffeineAdminToken"). This must run before any actor
// is constructed. The token is only used on the very first authenticated call
// to _initializeAccessControlWithSecret — after the first admin is registered
// the canister ignores subsequent calls from already-registered principals.
try {
  const existingToken = sessionStorage.getItem("caffeineAdminToken");
  if (!existingToken || existingToken.trim() === "") {
    sessionStorage.setItem("caffeineAdminToken", CAFFEINE_ADMIN_TOKEN);
  }
} catch {
  // sessionStorage not available (private browsing with strict settings)
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
