/**
 * CAFFEINE_ADMIN_TOKEN
 *
 * This token is used to bootstrap admin access on first login.
 * It must match the CAFFEINE_ADMIN_TOKEN environment variable set on the backend canister.
 *
 * The first Internet Identity principal to call _initializeAccessControlWithSecret
 * with this exact token value becomes the permanent admin of this application.
 *
 * After the first admin is registered, this token is no longer needed.
 */
export const CAFFEINE_ADMIN_TOKEN =
  "9b090709fe12636c3ce0f59d8884b3f5623a3c560b2d6da81f6bb73c19aad7da";
