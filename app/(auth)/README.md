# Authentication

Fake authentication system using [DummyJSON Auth API](https://dummyjson.com/docs/auth).

## Routes

| Route     | Description          |
| --------- | -------------------- |
| `/login`  | Login page           |
| `/signup` | Registration page    |

Both routes use the `(auth)` route group with a full-screen centered layout that overlays the global header/footer.

## Test Credentials

- **Username:** `emilys`
- **Password:** `emilyspass`

Signup accepts any email/password.

## Architecture

```
app/
├── (auth)/
│   ├── layout.tsx          # Full-screen centered auth layout (fixed overlay)
│   ├── login/page.tsx      # Login form (react-hook-form + useTransition)
│   └── signup/page.tsx     # Signup form (react-hook-form + useTransition)
├── components/
│   ├── header.tsx          # Global header with auth state (login/signup or email/logout)
│   └── footer.tsx          # Global footer
├── lib/
│   ├── auth.ts             # DummyJSON API calls (login, signup)
│   └── auth-context.tsx    # AuthProvider with cookie persistence
proxy.ts                    # Protects /blog routes, redirects unauthenticated users to /login
```

## Route Protection (proxy.ts)

The `proxy.ts` file at the project root protects `/blog` routes using Next.js proxy (replaces middleware in Next.js 15+). It checks for the `auth_token` cookie and redirects unauthenticated users to `/login`.

```ts
// proxy.ts
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/blog") && !request.cookies.get("auth_token")?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/blog/:path*"],
};
```

## How It Works

1. `AuthProvider` wraps the root layout and exposes the `useAuth()` hook
2. On login/signup, credentials are sent to DummyJSON and the returned token + email are stored in cookies (`auth_token`, `auth_email`, 7-day expiry)
3. Forms use `react-hook-form` for client-side validation and `useTransition` for loading state
4. The global `Header` component shows login/signup links when logged out, or user email + logout button when logged in
5. Logout clears cookies and navigates to home
6. `proxy.ts` protects `/blog` routes server-side before page render

## Form Validation

| Field    | Login                    | Signup                          |
| -------- | ------------------------ | ------------------------------- |
| Email    | Required, min 3 chars    | Required, valid email pattern   |
| Password | Required, min 6 chars    | Required, min 6 chars           |

## Usage

Access auth state anywhere with the `useAuth` hook:

```tsx
import { useAuth } from "@/app/lib/auth-context";

const { email, token, logout } = useAuth();
```
