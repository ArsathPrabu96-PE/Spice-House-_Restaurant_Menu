# Spice House — User Manual (v1.1.0)

# Overview
--------
This is a single-page static Restaurant Menu demo built with plain JavaScript and Bootstrap. It showcases an Indian menu, local image support, price editing, cart and order save, and an in-browser upload feature for dish images.

# How to open
-----------
- Recommended: Serve the directory with a static server and open `http://localhost:8080`.
  - Example (PowerShell / Python installed):

    python -m http.server 8080

- Quick: double-click `index.html` to open in a browser. Note: some browsers restrict `fetch()` for local files when pages are opened via `file://` which can affect the automatic preload behavior for local images.

# UI parts
--------
- Header: shows brand title, chef icon, currency selector, Edit Prices toggle, View Orders button, and visible totals.
- Filters: category buttons to show specific menu sections.
- Menu cards: each dish contains an image, name, category, price, description, qty controls, and an Upload/Remove image control.
- Cart drawer: right-side drawer shows cart contents and subtotal. Checkout saves orders to localStorage.

# Image handling
--------------
- By default, menu items reference local files in `images/` (if present).
- Upload: click "Upload" on a card to choose a file from your computer. The image will be stored as a data URL in localStorage under `restaurant_images_v1` and immediately shown on the card.
- Remove: click "Remove" to clear the uploaded image and revert to the original local image or fallback.
- Storage size: localStorage is limited (~5MB typically). For many or high-resolution images consider hosting them externally or resizing before upload.

# Editing prices
--------------
- Toggle "Edit Prices" in the header. Click an item price to open the price editor modal. Save to persist the override in `restaurant_prices_v1`.

# Orders and checkout
-------------------
- Cart operations update `restaurant_cart_v1` automatically.
- Use "Quick Checkout" to create a guest order, or "Checkout" to enter an email and save the order. Orders are stored in `restaurant_orders_v1`.

# Developer notes
---------------
- Main logic and menu data: `script.js`.
- Styles: `styles.css`.
- Local images folder: `images/`.

# Versioning
----------
- Current version: v1.1.1

## Upgrades in v1.1.1
- Added a selectable discount control in the Filters area (choose No discount / 10% / 25% / 50%). The selection is persisted in localStorage.
- Price display now shows the original price struck-through plus the discounted price and a small badge when a non-zero discount is selected.
- Orders view: added a short loading state animation when opening Saved Orders, and improved robustness so the modal reliably renders saved orders.
- Accessibility fix: when modals open the background is marked `inert` (prevents accidental focus/interaction) instead of using `aria-hidden` on ancestors that may contain focus.
- Checkout and Quick Checkout now compute and save paid unit prices using the selected discount percent so saved orders show the stored paid amounts (no double discount on view).

# Troubleshooting
---------------
- Images not showing: If you opened the app with `file://` and local images are not preloaded, run the simple server described above or use the Upload button to load images into localStorage.
- LocalStorage full: Remove some uploaded images via the UI (Remove button) or clear localStorage for this site in DevTools.

# Contact
-------
- If you want features (server-side persistence, image hosting, export/import, or packaging), tell me what you want and I will prepare the next steps.