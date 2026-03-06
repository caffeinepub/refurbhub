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

// Seed the admin token into sessionStorage before any actor is built.
// useActor reads this via getSecretParameter("caffeineAdminToken") and passes
// it to _initializeAccessControlWithSecret. Without this, the token is empty
// and the canister rejects the call, causing "Could not connect to backend".
try {
  const existing = sessionStorage.getItem("caffeineAdminToken");
  if (!existing || existing.trim() === "") {
    sessionStorage.setItem("caffeineAdminToken", CAFFEINE_ADMIN_TOKEN);
    console.log("[main] Admin token seeded into sessionStorage");
  } else {
    console.log("[main] Admin token already present in sessionStorage");
  }
} catch (err) {
  console.warn("[main] Could not access sessionStorage:", err);
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
