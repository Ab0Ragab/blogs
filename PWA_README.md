# PWA Implementation

This project is configured as a Progressive Web App (PWA) following the [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps).

## What was added

| File | Purpose |
|---|---|
| `app/manifest.ts` | Web app manifest via Next.js Metadata API — defines app name, icons, theme, and display mode |
| `public/sw.js` | Service worker — caches the offline page and serves it when the network is unavailable |
| `app/offline/page.tsx` | Offline fallback page shown when there is no network connection |
| `public/icons/` | Directory for PWA icons (192×192 and 512×512 PNG required) |
| `app/layout.tsx` | Updated with manifest link, `apple-touch-icon`, `theme-color` meta, and service worker registration script |

## Setup — Add Icons

Place your app icons in `public/icons/`:

- `icon-192x192.png` (192×192)
- `icon-512x512.png` (512×512)

You can generate these from any source image using tools like [RealFaviconGenerator](https://realfavicongenerator.net/) or [PWA Asset Generator](https://github.com/nicedoc/pwa-asset-generator).

## How it works

1. **Manifest** — `app/manifest.ts` exports a function that returns the web app manifest. Next.js automatically serves it at `/manifest.webmanifest`.

2. **Service Worker** — `public/sw.js` is registered on page load via an inline script in the root layout. It uses a network-first strategy for navigation requests and falls back to the cached `/offline` page when the network is unavailable.

3. **Offline Page** — `app/offline/page.tsx` is pre-cached during the service worker install event and served as a fallback for failed navigation requests.

## Testing

1. Run `npm run build && npm start` (service workers require a production build).
2. Open Chrome DevTools → **Application** tab.
3. Verify the manifest loads under **Manifest**.
4. Verify the service worker is active under **Service Workers**.
5. Check **Network** → toggle **Offline** → navigate to confirm the offline page appears.
6. Look for the browser install prompt in the address bar.

## Customization

- Edit `app/manifest.ts` to change app name, colors, or icons.
- Edit `public/sw.js` to adjust caching strategies (e.g., cache static assets, API responses).
- Edit `app/offline/page.tsx` to customize the offline experience.
