# RefurbHub

## Current State

The app is a refurbished electronics marketplace with a Motoko backend and React frontend.

**Backend problems:**
- `authorization/access-control.mo` maintains a HashMap of `Principal → #admin | #user | #guest` roles
- `authorization/MixinAuthorization.mo` exposes `_initializeAccessControlWithSecret(token)` which registers the first caller as admin if they provide the right token
- `useActor.ts` (platform-protected) calls `_initializeAccessControlWithSecret(adminToken)` on every actor build
- The admin token comes from `sessionStorage["caffeineAdminToken"]` which is never reliably populated, so it sends `""` and registers the principal as `#user` instead of `#admin`
- This causes all `addProduct`, `updateProduct`, `deleteProduct`, `updateOrderStatus`, `setStripeConfiguration` calls to fail with "Unauthorized"
- The role conflict between frontend principal comparison and backend role registry causes the endless activation loop

**Frontend problems:**
- Complex activation flow (password → II → activate admin → token injection) that never works reliably
- Token seeding logic in `main.tsx` and `adminToken.ts` that bypasses session state issues but doesn't fix the root cause
- Frontend already correctly checks `callerPrincipal === ADMIN_PRINCIPAL` in `useIsAdmin`

## Requested Changes (Diff)

### Add
- Fixed `ADMIN_PRINCIPAL` constant in `main.mo` using `Principal.fromText("vskq2-fm4vs-oevhw-w2rde-gjtdr-meufs-rlfw3-jjij6-iuo24-xrmd3-xae")`
- Private `requireAdmin(caller)` helper function that throws `Error.reject("Unauthorized Admin Access")` if caller != ADMIN_PRINCIPAL
- `isCallerAdmin()` query that returns `caller == ADMIN_PRINCIPAL` directly

### Modify
- `main.mo`: replace all `AccessControl.hasPermission(...)` checks with `requireAdmin(msg.caller)` on all admin functions
- `main.mo`: remove `import AccessControl` and `import MixinAuthorization` — no longer needed
- `main.mo`: remove `let accessControlState = AccessControl.initState()` and `include MixinAuthorization(accessControlState)`
- `main.mo`: replace array-based product storage with `HashMap<Nat, Product>` and `getProducts` returns `Iter.toArray(products.vals())`
- Frontend `AdminPage.tsx`: remove the multi-step activation gate; admin flow = password → II login → principal comparison → dashboard
- Frontend `useQueries.ts`: remove all token/activation code from `useAddProduct`; it already calls `actor.addProduct(...)` correctly
- Frontend `main.tsx`: remove all `sessionStorage` token seeding
- Frontend `adminToken.ts`: remove (no longer used)

### Remove
- `authorization/access-control.mo` — entire file
- `authorization/MixinAuthorization.mo` — entire file
- All references to `_initializeAccessControlWithSecret`, `assignCallerUserRole`, `getCallerUserRole`, `hasPermission`, role HashMaps, `#admin`/`#user` roles, activation tokens

## Implementation Plan

1. Regenerate the Motoko backend with:
   - Fixed `ADMIN_PRINCIPAL` constant
   - `requireAdmin(caller)` private helper
   - `isCallerAdmin()` query returning `caller == ADMIN_PRINCIPAL`
   - All product/order/stripe admin functions using `requireAdmin(msg.caller)` exclusively
   - HashMap-based product storage
   - No authorization module, no mixin, no token-based registration

2. Update frontend:
   - Clean up `AdminPage.tsx`: remove activation gate, keep password → II → dashboard (principal comparison already in `useIsAdmin`)
   - Clean up `useQueries.ts` `useAddProduct`: remove token diagnostics, keep the `actor.addProduct(...)` call
   - Remove `adminToken.ts` and token seeding from `main.tsx`
   - The `useActor.ts` (platform-protected) still calls `_initializeAccessControlWithSecret` — since the backend no longer has this method, the call will fail silently but the actor itself will still be created and all other methods will work. The frontend must not depend on this call succeeding.
