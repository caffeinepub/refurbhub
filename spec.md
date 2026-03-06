# RefurbHub

## Current State
The app has a Motoko backend with a full authorization system. The backend exposes:
- `_initializeAccessControlWithSecret(userSecret)` -- first caller who provides the correct CAFFEINE_ADMIN_TOKEN becomes admin permanently
- `isCallerAdmin()` -- returns true if caller has admin role
- `addProduct`, `updateProduct`, `deleteProduct` -- all require admin role

The admin frontend (AdminPage.tsx) has:
1. A password gate (`Armaan@10`) stored in sessionStorage
2. After the password gate, product mutations call the backend but fail because no principal has the admin role registered yet -- the `_initializeAccessControlWithSecret` endpoint has never been called

The `useAddProduct`, `useUpdateProduct`, `useDeleteProduct` hooks check for Internet Identity connection but the admin panel has no UI to trigger II login or self-register as admin.

## Requested Changes (Diff)

### Add
- After the password gate is passed, show an "Activate Admin" step if the user is not yet registered as admin on the backend
- "Activate Admin" step: show an "Login with Internet Identity" button. On success, call `_initializeAccessControlWithSecret` with the Caffeine admin token (read from env/config). This self-registers the first caller as admin on the canister permanently.
- Once `isCallerAdmin()` returns true, skip the activation step entirely on future visits (cache in sessionStorage)
- Show clear status in the admin header: "Connected as Admin" (green) or "Login Required" (yellow) with a login button

### Modify
- The admin panel main layout: add a small top banner showing II connection status and an "Activate Admin" button if not yet admin
- `useAddProduct`, `useUpdateProduct`, `useDeleteProduct` hooks: show a more helpful error message directing user to use the Activate Admin banner
- The activation flow must handle: (a) already registered as admin -- skip silently, (b) already registered as user -- show error, (c) not registered yet + wrong token -- show error

### Remove
- Any remaining references to "Caffeine admin token" UI that confused the user
- localStorage fallback for product storage (the backend must be the source of truth)

## Implementation Plan
1. Add `useActivateAdmin` mutation in useQueries.ts that calls `_initializeAccessControlWithSecret` with the env token
2. Add `useInternetIdentity` login trigger in the admin panel (already available via hook)
3. In AdminPage.tsx, after password gate passes:
   - Check `isCallerAdmin()` query result
   - If not admin: show a clean "Connect & Activate" banner with II login button
   - After II login: auto-call `_initializeAccessControlWithSecret`
   - After success: refetch `isCallerAdmin`, show green "Connected as Admin"
4. Cache admin activation state in sessionStorage so repeat visits skip the step
5. Remove any confusing token paste UI
6. Keep the password gate as the first layer
