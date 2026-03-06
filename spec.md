# RefurbHub

## Current State

The app has a full-stack backend (Motoko) + React frontend e-commerce platform. The admin panel at `/admin` uses a 3-step auth flow:
1. Password gate (`Armaan@10`)
2. Internet Identity login
3. Token gate (`AdminRegistrationGate`) — asks the user to paste a "Caffeine admin token"

The backend `MixinAuthorization.mo` (authorization component) already reads `CAFFEINE_ADMIN_TOKEN` via `Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")`. If the env var is not set, the canister traps with "CAFFEINE_ADMIN_TOKEN environment variable is not set".

`useActor.ts` (write-protected) calls `_initializeAccessControlWithSecret(adminToken)` on every actor build with the token from `getSecretParameter("caffeineAdminToken")`. When no token is in sessionStorage, it passes `""`, which causes the canister to trap, setting `isActorError = true` and showing the token gate — but users don't know what the token is.

## Requested Changes (Diff)

### Add
- A `CAFFEINE_ADMIN_TOKEN` constant stored in `src/frontend/src/data/adminToken.ts` with a securely generated value
- A visible token reveal section in `AdminRegistrationGate` that shows the admin token value with a copy button, so the admin can see it once and use it to bootstrap access
- Auto-populate the token input field with the known token value so the admin can simply click "Activate Admin" without manual copy-paste

### Modify
- `AdminRegistrationGate` component in `AdminPage.tsx`: add a "Your Admin Token" reveal card showing the token with a copy button and an eye/hide toggle; auto-fill the token input; update placeholder and helper text to make clear the token is displayed above

### Remove
- The vague "You can find this token in your Caffeine platform dashboard under project settings" footer note (which is incorrect — the token is stored in the app code, not in Caffeine settings)

## Implementation Plan

1. Create `src/frontend/src/data/adminToken.ts` exporting the `CAFFEINE_ADMIN_TOKEN` constant
2. Update `AdminRegistrationGate` in `AdminPage.tsx` to:
   - Import the token from `adminToken.ts`
   - Auto-fill the token state on mount
   - Show a "Your Admin Token" reveal card with eye toggle, copy button, and the actual token value
   - Update the descriptive text to say "This is your one-time bootstrap token. Use it to register as admin."
   - Remove the incorrect Caffeine settings footer note
3. Validate and deploy
