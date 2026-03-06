# RefurbHub

## Current State

The Motoko backend has a fresh `initState()` with `adminAssigned = false` and an empty `userRoles` map. The backend is being redeployed, which wipes all stored state (no registered users or admins). The frontend has a multi-step admin login: password gate → Internet Identity login → actor build → `_initializeAccessControlWithSecret(token)` → admin check → dashboard.

The persistent failure has been that `useActor.ts` calls `_initializeAccessControlWithSecret(getSecretParameter("caffeineAdminToken"))` during every authenticated actor build. If `sessionStorage` had no value for `caffeineAdminToken`, the token was empty string `""`, causing the backend to register the principal as a regular user (not admin), and then `useActivateAdmin` firing later could not override an already-registered principal.

## Requested Changes (Diff)

### Add
- Token seeding in `main.tsx`: at app startup, before any React renders, seed `CAFFEINE_ADMIN_TOKEN` from `adminToken.ts` into `sessionStorage["caffeineAdminToken"]` if not already set. This ensures `useActor.ts` always reads the correct token and passes it to `_initializeAccessControlWithSecret`.

### Modify
- `main.tsx`: add token seed block before `ReactDOM.createRoot`.

### Remove
- Nothing removed from the UI or backend.

## Implementation Plan

1. Seed token in `main.tsx` so `getSecretParameter("caffeineAdminToken")` always returns the correct value before any actor is built.
2. Redeploy both backend (fresh canister, zero state) and frontend.
3. After deployment: first II login → actor builds with correct token → `_initializeAccessControlWithSecret(token)` registers principal as admin → `isCallerAdmin()` returns true → dashboard opens.
