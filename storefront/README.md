# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Technical Features

### Product Image Zoom

The product detail page (PDP) includes an image zoom feature:

- **Desktop**: Click on the main image to open a modal with zoom. Use mouse wheel to zoom in/out, drag to pan.
- **Mobile**: Tap on the main image to open. Use pinch gestures to zoom, drag to pan.
- **Accessibility**: Modal includes focus trap, closes with ESC key or X button.

Implementation uses `react-zoom-pan-pinch` with shadcn/ui Dialog.

### Product Description (HTML Rendering)

Product descriptions are rendered exactly as configured in Shopify Admin:

- Rich HTML support: paragraphs, lists, bold, links, etc.
- Rendered using `dangerouslySetInnerHTML` (safe since Shopify is the trusted source)
- Styled with Tailwind Typography plugin (`.prose` classes)

### Cache Strategy

This is a Single Page Application (SPA) with no server-side caching:

- **No ISR/SSG**: All Shopify API calls happen client-side on each page visit
- **No aggressive caching**: Changes in Shopify Admin reflect immediately after page refresh
- **High-res images for zoom**: Only loaded on-demand when zoom modal opens (via Shopify CDN `?width=2048` parameter)
