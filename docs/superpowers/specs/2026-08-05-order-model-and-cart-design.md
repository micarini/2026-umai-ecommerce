# Design: Order model + Counter + `/cart` page

Date: 2026-08-05
Status: Approved

## Context

This is the first sub-project of a larger effort to complete the ecommerce TP
(see `README.md` sections 5.4–5.6). Full scope, in dependency order:

1. **Order model + `/cart`** (this spec)
2. `/checkout` + `POST /api/orders`
3. `/favorites` page (backend already exists — API routes and context
   functions are implemented, only the page is missing)
4. `/user` + `/user/order/[id]`
5. `/dashboard/orders` + `/dashboard/order/[id]` (+ dashboard summary,
   `/dashboard/products`)

Each item above gets its own spec → plan → implementation cycle. This spec
covers only items in bold below.

Existing groundwork this design builds on:

- `AppContext` (`src/context/AppContext.js`) already has `cart`,
  `cartTotal`, `cartCount`, `addToCart`, `removeFromCart`,
  `updateCartQuantity`, `clearCart`, and `activeUser`.
- Cart items already carry: `productId`, `name`, `image`, `price`,
  `quantity`, `customizations`, `subtotal` (see `addToCart` in
  `AppContext.js`).
- Visual style: Tailwind v4 theme tokens defined in `src/app/globals.css`
  (`cream`, `sand`, `teal`, `teal-light`, `salmon`, `salmon-dark`, `wasabi`,
  `wasabi-light`). `ProductDetail.js` is the reference component for
  established patterns (image resolution via `getProductImageSrc`, button
  styles, etc.).

## Decision: no guest checkout

A purchase requires a registered, logged-in user. `Order.user.userId` is
required (not optional). This means the `/checkout` page (next spec) must
gate on `activeUser` and redirect to `/login` if absent — noted here so the
Order model isn't designed around a guest-checkout case that won't exist.

## 1. `Counter` model

Purpose: generate sequential order numbers safely (atomic increment),
starting at 1000, per README section 5.6.

```js
// src/models/Counter.js
{
  _id: String,   // e.g. "orderNumber"
  seq: Number,
}
```

Helper in `src/lib/orders.js`:

```js
export async function getNextOrderNumber() {
  await connectDB();
  const counter = await Counter.findOneAndUpdate(
    { _id: "orderNumber" },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return counter.seq;
}
```

The counter document is seeded/created lazily on first use via `upsert`.
`seq` should start such that the first generated number is `1000` (e.g.
initialize at `999` on insert via `$setOnInsert`, or simpler: seed the
`Counter` doc explicitly during admin seed with `seq: 999`).

## 2. `Order` model

```js
// src/models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    customizations: { type: mongoose.Schema.Types.Mixed, default: {} },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },
    status: {
      type: String,
      enum: ["Active", "Closed", "Shipped", "Canceled"],
      default: "Active",
    },
    user: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    contact: {
      address: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
```

Notes:

- `items` mirrors the cart item shape from `AppContext` (renaming `price` →
  `unitPrice` for clarity at rest, since it's a snapshot, not a live
  reference).
- `customizations` stored as `Mixed` since the cart's customization shape
  varies per product (single-select string vs multi-select array — see
  `ProductDetail.js`'s `SingleSelect`/`MultiSelect`).
- `contact` fields are optional at the schema level; the checkout spec will
  decide which are required in the form itself.
- No separate `getProduct(id)`-style rename needed here — out of scope for
  this spec.

## 3. `/cart` page

Route: `src/app/cart/page.js` (client component — depends on `cart` context
state, per README section 5.4).

**Layout**

- Two-column on desktop: item list (left, wider) + sticky order summary
  (right). Single stacked column on mobile.
- Empty state: centered message ("Tu carrito está vacío") + button back to
  `/` (or `/categories`), styled consistently with other empty states in the
  app.

**Item row** (one per cart entry, keyed by `productId` + serialized
`customizations`):

- Product image via the same `getProductImageSrc` helper pattern used in
  `ProductDetail.js`.
- Name (link to `/product/[id]`).
- Selected customizations, rendered as small muted text (e.g.
  `"Dough: Chocolate · Topping: Dulce de leche"`).
- Unit price.
- Quantity stepper: `-` / count / `+` buttons. `+` calls
  `updateCartQuantity(productId, customizations, quantity + 1)`; `-` calls
  the same with `quantity - 1`. The context already removes the item when
  quantity drops to 0, so no extra guard needed in the component.
- Subtotal for the row.
- Remove button (✕ icon) calling `removeFromCart(productId, customizations)`
  directly — no confirmation dialog.

**Summary panel**

- Total (from `cartTotal`).
- "Continuar al checkout" button → `/checkout` (built in the next spec; for
  this spec, the link can point at `/checkout` even before that route
  exists — it'll 404 until the next sub-project lands, which is expected
  and acceptable since checkout is next in the sequence).

**Styling**: reuse existing Tailwind theme tokens (`bg-cream`, `text-teal`,
`border-sand`, `bg-salmon` for primary actions) to stay consistent with
`ProductDetail.js` and the home page.

## Out of scope for this spec

- `/checkout` page and `POST /api/orders` (next spec).
- Any admin-facing order screens.
- Email confirmations or other optional features (README section 8).
