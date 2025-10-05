# Spice House — Restaurant Menu (v1.1.0)

# Local static single-page Restaurant Menu app built with vanilla JavaScript and Bootstrap.

# Quick start

1. Open `index.html` in your browser (double-click or open from your editor). For full local-image fetch behavior, it's recommended to serve the folder with a simple static server (see "Run locally").

# Highlights (what's new in v1.1.0)

- Local images support: menu items now reference local files under the `images/` directory where available.
- In-browser image upload: upload an image per dish from the UI; uploaded images persist in the browser via localStorage.
- Improved header layout and control alignment (currency selector, Edit Prices, View Orders).
- Bug fixes: duplicate/placeholder remote images replaced with local assets where provided.

# Features
- Browse menu by category (All, Starters, Main, Rice & Biryani, Bread, Sides, Dessert, Beverages)
- Add, increment, and decrement dish quantities; see live totals
- Edit item prices (toggle Edit Prices → click a price to edit; saves overrides to localStorage)
- View and save orders locally (Orders modal)
- Upload custom images per dish (stored as data URLs in localStorage key `restaurant_images_v1`)

# Files
- `index.html` — main page and markup
- `styles.css` — app styles and header/layout tweaks
- `script.js` — core app logic, menu data, localStorage hooks
- `images/` — local dish images (optional)

# Run locally
- Option A (quick): open `index.html` in your browser. Image uploads work; however, some browsers restrict `fetch()` for local files when opening via `file://`.
- Option B (recommended): serve the folder with a simple static server to avoid local fetch/CORS issues. Example (PowerShell):

	python -m http.server 8080

Then open `http://localhost:8080`.

Notes on storage & limits
- Cart, price overrides, orders, and uploaded images are persisted in localStorage under the keys:
	- `restaurant_cart_v1` — cart contents
	- `restaurant_prices_v1` — price overrides
	- `restaurant_orders_v1` — saved orders
	- `restaurant_images_v1` — image overrides (data URLs). Be mindful of localStorage limits (~5MB typically). Avoid uploading many large high-res images.

# Version
- v1.1.0

# License & credits
- This project is a small demo and not production-ready. Images sourced from local `images/` directory and Unsplash for fallback images. Use and adapt as you like.

# Contact
- If you want changes, feature additions (server-side image hosting, export/import, auth), or packaging as a deployable site, open an issue or message with specifics.
