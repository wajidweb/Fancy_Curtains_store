# Fancy, Langsir & Perabot: Complete Project Specification

## 1. Executive Summary
Fancy, Langsir & Perabot is a production-ready, full-stack e-commerce and service booking platform designed for the Malaysian market. It provides a dual-purpose solution: selling physical goods (ready-made curtains and furniture) and facilitating professional services (on-site measurement and installation).

**Key Differentiator:** The platform is natively bilingual, defaulting to **Bahasa Malaysia (ms)** and offering a full toggle to **English (en)**. It supports both modern digital payments (Stripe) and local preferences like Cash on Delivery (COD).

---

## 2. Brand & UI/UX Design System

### 2.1. Visual Identity
*   **Tone:** Sophisticated, trustworthy, and homey.
*   **Color Palette (Suggested):**
    *   **Primary:** Deep Emerald or Navy Blue (represents quality/professionalism).
    *   **Secondary:** Warm Gold or Sand (represents luxury and curtains/textiles).
    *   **Accent:** Soft Gray/Off-white for clean backgrounds.
*   **Typography:** Elegant Serif for headings (e.g., Playfair Display) paired with clean Sans-serif for body text (e.g., Inter or Montserrat).

### 2.2. User Experience Principles
*   **Mobile-First:** 70%+ of Malaysian users shop on mobile. All components must be responsive.
*   **Low Friction:** Guest checkout support and easy "Book Now" buttons for services.
*   **Trust Indicators:** Clear WhatsApp contact buttons, testimonials, and detailed service descriptions.

---

## 3. Core Features & Functional Requirements

### 3.1. Internationalization (i18n)
*   **Technology:** `next-intl` using the App Router.
*   **Routing:** Locale-based paths (`/ms/products`, `/en/products`).
*   **Default:** Redirect `/` to `/ms` based on browser headers or manual toggle.
*   **Management:** `messages/ms.json` and `messages/en.json` for static text. Database uses nested objects for dynamic text.

### 3.2. Product System
*   **Categories:** Curtains (Ready-made, blackout, sheer) and Furniture (Sofas, tables, etc.).
*   **Dynamic Attributes:** Variants for size (e.g., 100cm x 250cm), colors, and materials.
*   **Search/Filter:** Real-time search, price range filter, and category navigation.

### 3.3. Curtain Service Booking
*   **The Flow:**
    1.  User visits "Measurement Service" page.
    2.  Fills in Name, Phone (WhatsApp preferred), Address (Klang Valley/Specific areas), and Date.
    3.  Admin receives notification and contacts user.
*   **Admin Visibility:** Dedicated dashboard tab to manage service statuses (Pending, Contacted, Scheduled, Completed).

### 3.4. Checkout & Payments
*   **Cart:** Persistent across sessions via Zustand + LocalStorage.
*   **Payment Methods:**
    *   **Stripe:** For Credit/Debit cards and FPX (Malaysian online banking).
    *   **COD:** For users who prefer paying upon delivery/installation.
*   **Order Confirmation:** Automated receipt generation and status tracking.

---

## 4. Technical Architecture

### 4.1. Stack Details
*   **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS, Framer Motion (for smooth transitions).
*   **Backend:** Node.js (Express), JWT for auth, Bcrypt for passwords.
*   **Database:** MongoDB Atlas (Mongoose).
*   **Cloud Storage:** Cloudinary or AWS S3 for product images.

### 4.2. File Structure (Comprehensive)
```text
/fancy-curtains
├── /frontend (Next.js)
│   ├── /app
│   │   └── /[locale]
│   │       ├── /layout.tsx
│   │       ├── /page.tsx             # Homepage
│   │       ├── /products
│   │       │   ├── /page.tsx         # List
│   │       │   └── /[id]/page.tsx    # Details
│   │       ├── /cart/page.tsx
│   │       ├── /checkout/page.tsx
│   │       ├── /services/page.tsx    # Service Booking
│   │       ├── /admin
│   │       │   └── /dashboard/page.tsx
│   ├── /components
│   │   ├── /ui                       # Button, Input, Modal (Shadcn style)
│   │   ├── /shared                   # Navbar, Footer, LangSwitcher
│   │   └── /product                  # ProductCard, Gallery, Filters
│   ├── /messages                     # en.json, ms.json
│   ├── /store                        # useCartStore.ts, useAuthStore.ts
│   └── /lib                          # api-client.ts, utils.ts
└── /backend (Express)
    ├── /src
    │   ├── /models                   # User, Product, Order, Service
    │   ├── /routes                   # auth.routes, product.routes, etc.
    │   ├── /controllers              # Business logic
    │   ├── /middleware               # authMiddleware, errorMiddleware
    │   └── /config                   # db.js, passport.js
    └── server.js
```

---

## 5. Database Schema (Mongoose Models)

### 5.1. Product Model
```javascript
{
  name: { ms: String, en: String },
  slug: String,
  description: { ms: String, en: String },
  price: Number,
  category: { type: String, enum: ['curtains', 'furniture'] },
  images: [String],
  stock: Number,
  variants: [{
    label: { ms: String, en: String },
    priceModifier: Number
  }],
  isFeatured: Boolean
}
```

### 5.2. Order Model
```javascript
{
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: ObjectId,
    quantity: Number,
    selectedVariant: String,
    price: Number
  }],
  shippingDetails: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String
  },
  paymentMethod: { type: String, enum: ['stripe', 'cod'] },
  paymentStatus: { type: String, default: 'pending' },
  orderStatus: { type: String, default: 'processing' },
  totalPrice: Number
}
```

---

## 6. Development & Deployment Roadmap

### Phase 1: Foundation (Week 1)
*   Initialize Backend (Auth, Models).
*   Initialize Frontend (Next-intl, Tailwind, Basic Layout).
*   Setup MongoDB Atlas and Cloudinary.

### Phase 2: Core E-commerce (Week 2)
*   Product CRUD for Admins.
*   Product Listing & Detail pages for users.
*   Shopping Cart logic (Zustand).

### Phase 3: Services & Checkout (Week 3)
*   Service Request form implementation.
*   Stripe Integration (Webhooks for payment verification).
*   COD logic.

### Phase 4: Refinement (Week 4)
*   Full i18n translation pass (Malay/English).
*   Mobile responsive optimizations.
*   Deployment to Vercel (Frontend) and Render/Railway (Backend).

---

## 7. Security & Compliance
*   **Data Protection:** No storing of raw passwords (Bcrypt).
*   **JWT:** HttpOnly cookies for session management to prevent XSS.
*   **Input Validation:** Use `zod` on frontend and `joi` on backend.
*   **SSL:** Mandatory for all API communications.

---

## 8. Launch Checklist
- [ ] Domain connected (e.g., fancy.com.my).
- [ ] Stripe Live Keys configured.
- [ ] Malay/English translations 100% verified.
- [ ] Admin user created in production DB.
- [ ] WhatsApp redirection link configured.
