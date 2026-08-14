# MUSE MARINE Website

Static company website for MUSE MARINE (marine industrial batteries & ship electronics).

This is a revamp of the original single-file HTML site. It removes duplicated markup,
compiles Tailwind CSS instead of using the CDN, and wires the inquiry forms to a real
(configurable) submission path.

## Stack

- Plain HTML pages assembled by a small Node build script (`build.mjs`)
- Tailwind CSS 3.4 (compiled, no runtime CDN)
- Zero runtime JavaScript dependencies

## Project structure

```
src/
  _partials/     head, nav, footer, shared scripts
  pages/         one file per page (<main> content + page-specific script)
  input.css      Tailwind entry + small custom animations
  assets/        favicon.svg
build.mjs        assembles pages + writes robots.txt and sitemap.xml
dist/            generated static site (git-ignored)
```

## Requirements

- Node.js 18+
- pnpm (or npm)

## Build

```bash
pnpm install
pnpm build
```

The generated site is written to `dist/`. Deploy that folder to any static host
(Netlify, Vercel, Cloudflare Pages, nginx, S3, etc.).

## Configuration

All site-wide values live in `build.mjs` (`site` object):

- `name`, `url`, `email`, `salesEmail`, `supportEmail`, `phone`, `address`
- `ogImage`
- `formEndpoint`

### Inquiry forms

Forms have a `data-form` attribute and are handled by the shared script in
`src/_partials/scripts.html`:

- If `formEndpoint` is set, the form is `POST`ed there as `FormData`
  (works with Formspree, Netlify Forms, Getform, or your own API).
- If `formEndpoint` is empty (default), submission opens the visitor's email
  client with the inquiry pre-filled to `salesEmail`.

To enable a real backend, set `formEndpoint` in `build.mjs`, for example:

```js
formEndpoint: 'https://formspree.io/f/yourFormId',
```

## Notes / TODO

- Replace placeholder phone/address with real company details in `build.mjs`.
- Replace the placeholder `url` (`https://musemarine.com`) with the real domain.
- The news section currently shows headlines without dedicated article pages;
  add article pages and re-link the cards when content is available.
- Consider self-hosting images instead of hotlinking Unsplash / i.ibb.co.
