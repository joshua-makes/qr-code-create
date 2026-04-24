# QR Code Creator

> A fast, client-side QR code generator with logo embedding, color customization, and shareable links — built with Next.js.

## Features

- 🎨 **Custom colors** — foreground and background color pickers
- 🖼️ **Logo embedding** — upload PNG or SVG, resize, and add rounded corners
- 🔗 **Shareable links** — encode full config to URL query string
- 📏 **Size control** — 128–1024px with margin adjustment
- 🛡️ **ECC safety** — auto-upgrades error correction when logo is present
- 🌙 **Dark mode** — persisted to localStorage, respects system preference
- 📱 **Responsive** — mobile-first, two-column desktop layout
- 💾 **Export** — download as PNG or SVG
- ⚡ **Client-side only** — no backend, no data sent anywhere

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript strict mode
- [Tailwind CSS v4](https://tailwindcss.com/)
- [qr-code-styling](https://qr-code-styling.com/) for QR generation
- [Vitest](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format with Prettier |
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript type checking |

## License

MIT

