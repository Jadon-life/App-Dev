# CrysLearn mobile

The Expo 51 app is an online study companion for the CrysLearn website. It uses the same Supabase account, profile, exam catalogue, purchased access, and completed practice history. Practice and payments open in the configured website; this version does not include a native exam runner or offline question downloads.

## Start locally

From the repository root, install the locked workspace dependencies with `npm ci`. Copy `mobile/.env.example` to the ignored `mobile/.env` and enter the public Supabase project URL and anon key. Never use a Supabase service-role key in an Expo public variable.

Set `EXPO_PUBLIC_WEB_URL` to your HTTPS web deployment's origin to enable practice and payment links. `EXPO_PUBLIC_APP_URL` remains accepted for existing configurations. Browser sign-in is separate from native sign-in; the app never passes auth tokens through these links.

Run `npm run start --workspace mobile` from the repository root. Missing or invalid Supabase configuration displays a setup screen instead of crashing during import. Restart Expo after changing public variables.

In the standard Expo 51 native runtime, Google sign-in opens the configured website because this runtime does not provide the full WebCrypto capabilities needed for secure PKCE. Native email/password sign-in and signup remain available. Email confirmation settings are controlled by Supabase; confirm the account in email and return to the app to sign in. The app never accepts authentication tokens from URL fragments.

Runtimes with secure random values, SHA-256 WebCrypto, and TextEncoder can use in-app Google PKCE. In that case enable the Google provider in Supabase and allow the app redirect `cryslearn://auth/callback` (or the actual browser-preview redirect). A native callback requires a development/production build with the configured `cryslearn` scheme; Expo Go does not validate that callback. No custom cryptographic shim is installed.

## Checks

From the repository root:

```sh
npx tsc --project mobile/tsconfig.json --noEmit
npx eslint mobile --ext .ts,.tsx
npx tsx --test mobile/tests/*.test.ts
```

From `mobile`, validate the native JavaScript bundle without an Xcode or Android build:

```sh
CI=1 npx expo export --platform ios --max-workers 2 --output-dir /tmp/cryslearn-mobile-export
```

This export does not verify native compilation, device layout, SecureStore on a device, keyboard interactions, live authentication, or native OAuth. Those require a device/emulator and a configured test account. Account linking cannot be initiated in this version. Existing legacy links do not grant access; student-approved sharing is not yet available.

## Device session handling

Native sessions are saved in SecureStore in small Unicode-safe chunks. A manifest is committed after successful chunk writes, preserving the last valid session if a write fails. The optional browser preview uses sessionStorage. Account changes clear the in-memory query cache, and requests respect cancellation and a 15-second timeout. Auth refresh follows the native app's foreground state.

The native app currently supports a consistent dark theme. Invalid references to missing icon/splash assets were removed; supply release-quality branded native assets before an app-store release.
