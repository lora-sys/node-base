This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Development with Proxy

If you need to use a proxy for development (e.g., in regions with network restrictions), you have two options:

1. **Use the proxy script** (recommended for quick testing):
   ```bash
   bun run dev:proxy
   # or
   npm run dev:proxy
   ```

2. **Configure via `.env.local`** (recommended for persistent setup):
   Create a `.env.local` file in the project root with:
   ```bash
   HTTP_PROXY=http://your-proxy-address:port
   HTTPS_PROXY=http://your-proxy-address:port
   NODE_OPTIONS=--use-env-proxy
   ```
   Then run the normal `bun run dev` command.

**Note:** The default `dev` script does not include any hard-coded proxy configuration to ensure portability across different development environments.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# node-base
