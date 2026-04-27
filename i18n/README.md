# Localization (i18n)

This project uses the [Next.js App Router internationalization](https://nextjs.org/docs/app/guides/internationalization) pattern with locale-prefixed routes (`/en/...`, `/ar/...`).

## Supported Locales

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English  | LTR       |
| `ar` | Arabic   | RTL       |

Default locale: `en`

## Architecture

```
i18n/
├── config.ts              # Locale list, default locale, Locale type
├── get-dictionary.ts      # Server-side dictionary loader (cached)
├── context.tsx            # I18nProvider + useI18n hook for client components
└── dictionaries/
    ├── en.json            # English translations
    └── ar.json            # Arabic translations
```

### Routing

All pages live under `app/[lang]/`. The proxy (`proxy.ts`) handles:

1. **Locale detection** — checks `NEXT_LOCALE` cookie → `Accept-Language` header → falls back to `en`
2. **Redirect** — requests without a locale prefix (e.g. `/blog`) are redirected to `/{locale}/blog`

### How Translations Are Consumed

- **Server components** — call `getDictionary(lang)` directly:
  ```tsx
  const dict = await getDictionary(lang);
  return <h1>{dict.home.title}</h1>;
  ```

- **Client components** — use the `useI18n` hook:
  ```tsx
  const { dict, lang } = useI18n();
  return <h1>{dict.home.title}</h1>;
  ```

### RTL Support

The `[lang]/layout.tsx` sets `dir="rtl"` when the locale is `ar`. The language switcher in the header also updates `document.documentElement.dir` on client-side navigation.

### Language Switcher

A toggle button in the header switches between locales. It:
- Sets a `NEXT_LOCALE` cookie (persists preference for 1 year)
- Updates `<html lang>` and `<html dir>` attributes
- Navigates to the equivalent path in the new locale

## Adding a New Locale

1. Add the locale code to `i18n/config.ts`:
   ```ts
   export const i18n = {
     defaultLocale: "en",
     locales: ["en", "ar", "fr"], // add "fr"
   } as const;
   ```

2. Create the dictionary file `i18n/dictionaries/fr.json` — copy `en.json` and translate all values.

3. Register the import in `i18n/get-dictionary.ts`:
   ```ts
   const dictionaries = {
     en: () => import("./dictionaries/en.json").then((m) => m.default),
     ar: () => import("./dictionaries/ar.json").then((m) => m.default),
     fr: () => import("./dictionaries/fr.json").then((m) => m.default),
   };
   ```

4. If the new locale is RTL, update the `dir` logic in `app/[lang]/layout.tsx` and `components/header.tsx`.

5. Update the language switcher in `components/header.tsx` to support more than two locales.

6. Update the auth redirect regex in `proxy.ts` to include the new locale code.

## Adding New Translation Keys

1. Add the key to **every** dictionary file (`en.json`, `ar.json`, etc.).
2. Access it via `dict.section.key` in your component.

### Interpolation

Use `{placeholder}` in dictionary values and replace at render time:

```json
{ "copyright": "© {year} Our Blog" }
```

```tsx
dict.footer.copyright.replace("{year}", String(year))
```

## Dictionary Sections

| Section       | Used in                          |
|---------------|----------------------------------|
| `home`        | Home page                        |
| `header`      | Header / navigation              |
| `footer`      | Footer                           |
| `blog`        | Blog list, blog post, filters    |
| `preferences` | User preferences panel           |
| `auth`        | Login and signup pages            |
