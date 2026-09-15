# Sprint 0 — Foundation, Architecture & End-to-End System
**Date Completed**: 2026-09-15
**Status**: Complete

---

## Overview
Sprint 0 establishes the complete end-to-end architecture for the digital product sales platform specializing in e-books and PDFs. It delivers high-conversion storefront UI, seller dashboard with ad-ready campaign link generation and QR codes, super admin dashboard with live dynamic theme customization and commission slider, atomic Razorpay checkout simulation, and tamper-proof server-side PDF storage with 72-hour expiring download tokens.

---

## Files Created / Modified

| File | Type | Description |
|---|---|---|
| `prisma/schema.prisma` | NEW | SQLite schema with User, Product, Order, DownloadToken, Commission, Withdrawal, PlatformSettings |
| `prisma/seed.ts` | NEW | Database seeder with Super Admin, Seller, Commission rates, and 3 rich sample e-books/PDFs |
| `lib/prisma.ts` | NEW | Singleton Prisma client instance for App Router |
| `lib/auth.ts` | NEW | HMAC-SHA256 authenticated cookie session system with role-based guard |
| `lib/razorpay.ts` | NEW | Razorpay API integration with deterministic local sandbox simulation mode |
| `lib/theme.ts` | NEW | Dynamic theming engine persisting to database & injecting CSS variables into HTML root |
| `lib/storage/types.ts` | NEW | Abstract storage interface (`StorageAdapter`) for swappable backends (Local/S3/R2) |
| `lib/storage/local.ts` | NEW | Protected local filesystem storage adapter storing files outside public root |
| `lib/storage/index.ts` | NEW | Storage factory resolving the active adapter |
| `app/globals.css` | NEW | Sleek dark-mode glassmorphic design system using Vanilla CSS custom properties |
| `components/ui/Navbar.tsx` | NEW | Dynamic navigation bar with role detection and live cart/auth links |
| `components/ui/Footer.tsx` | NEW | Polished platform footer with navigation, newsletter, and trust badges |
| `components/marketing/HeroSection.tsx` | NEW | High-impact hero section with live stats counter and quick search |
| `components/marketing/CategoriesGrid.tsx` | NEW | Interactive category selector with gradient badge accents |
| `components/marketing/FeaturedProducts.tsx` | NEW | Responsive grid showcasing trending and top-rated e-books |
| `components/marketing/HowItWorks.tsx` | NEW | 3-step value proposition cards with glowing borders |
| `components/store/ProductCard.tsx` | NEW | Modern glassmorphic product card with instant "Buy Now" triggers |
| `components/store/BuyModal.tsx` | NEW | Multi-step checkout modal with Razorpay simulation and confetti |
| `components/store/ProductDetailView.tsx` | NEW | Complete product view with chapters, preview, seller bio, and guarantees |
| `components/dashboard/UploadModal.tsx` | NEW | Drag-and-drop PDF upload modal with instant cover image picker |
| `components/dashboard/ShareLinkModal.tsx` | NEW | Marketing link generator with UTM tags, short links, and downloadable QR code |
| `components/dashboard/WithdrawModal.tsx` | NEW | Seller withdrawal request dialog with UPI/Bank support and instant balance check |
| `app/page.tsx` | NEW | High-conversion marketing landing page |
| `app/store/page.tsx` | NEW | Searchable and filterable digital marketplace catalog |
| `app/product/[slug]/page.tsx` | NEW | SEO-optimized dynamic product detail page |
| `app/dashboard/page.tsx` | NEW | Full seller portal: revenue stats, product manager, campaign links, withdrawals |
| `app/admin/page.tsx` | NEW | Super Admin portal: live dynamic theme customizer, commission slider, payout approvals |
| `app/login/page.tsx` | NEW | Unified authentication login page with demo credential one-click helpers |
| `app/register/page.tsx` | NEW | Buyer/Seller dual-mode registration page |
| `app/api/auth/me/route.ts` | NEW | Current session retrieval endpoint |
| `app/api/auth/login/route.ts` | NEW | Authentication credential validation and session cookie issuing |
| `app/api/auth/register/route.ts` | NEW | New account creation with password hashing and role assignment |
| `app/api/auth/logout/route.ts` | NEW | Session invalidation and cookie clearing |
| `app/api/products/route.ts` | NEW | Public catalog API with search, category filtering, and sorting |
| `app/api/payments/create-order/route.ts` | NEW | Order creation with dynamic platform fee and seller split calculation |
| `app/api/payments/verify/route.ts` | NEW | Atomic transaction verifying payment, crediting seller wallet, and generating token |
| `app/api/download/[token]/route.ts` | NEW | Anti-piracy secure streaming endpoint enforcing 72h expiry and download counts |
| `app/api/seller/products/route.ts` | NEW | Seller product list and multipart PDF upload handler |
| `app/api/seller/earnings/route.ts` | NEW | Seller financial analytics and order history |
| `app/api/seller/withdrawals/route.ts` | NEW | Seller payout request submission with immediate wallet balance deduction |
| `app/api/admin/commissions/route.ts` | NEW | Platform commission rate update endpoint |
| `app/api/admin/theme/route.ts` | NEW | Super Admin live dynamic theme color persistence |
| `app/api/admin/withdrawals/route.ts` | NEW | Withdrawal approval and rejection with auto-refund to seller wallet |
| `app/api/admin/products/route.ts` | NEW | Catalog moderation endpoint |

---

## Architecture Decisions

### Decision 1: Server-Protected File Storage with Abstract Adapter
**What**: Files are stored in `./uploads/products` (completely outside the `public/` directory) and accessed solely through an abstract `StorageAdapter` interface.
**Why**: Prevent unauthorized direct URL access or scraping of e-books/PDFs. The adapter allows seamless zero-downtime migration to Cloudflare R2 or AWS S3 in production simply by implementing `StorageAdapter`.
**Alternatives considered**: Direct Next.js public directory hosting (rejected due to zero access protection).

### Decision 2: 72-Hour Expiring Cryptographic Download Tokens
**What**: Upon verified payment, buyers receive a unique `DownloadToken` (`dtk_...`) with a 72-hour expiration and max 5 downloads counter.
**Why**: Protects seller content from link-sharing and piracy while allowing genuine buyers plenty of time to save their purchase across multiple devices.
**Alternatives considered**: Permanent download links (rejected due to link piracy).

### Decision 3: Atomic Multi-Operation Payout Transactions (`$transaction`)
**What**: Payment verification updates order status, increments seller wallet, increments product revenue/sales, and issues the download token within an atomic Prisma database transaction.
**Why**: Ensures financial integrity—seller balances and buyer access cannot get out of sync even under concurrent traffic or network hiccups.
**Alternatives considered**: Sequential non-atomic database queries (rejected due to risk of partial failure).

### Decision 4: Dynamic Theming System Controlled by Super Admin
**What**: Super Admin can tweak Primary Color, Accent Color, Dark Background, and Border Radius live from `/admin`, saving directly to `PlatformSettings` in the DB and injecting CSS variables into the `:root` pseudo-class.
**Why**: Allows full brand customization and instant seasonal or promotional redesigns without redeploying or rebuilding the frontend.
**Alternatives considered**: Hardcoded CSS variables or compile-time Tailwind themes (rejected as per user requirement for dynamic admin control).

### Decision 5: Integrated Ad Campaign Link Generator with QR Codes
**What**: Each product generates a custom short link with customizable UTM tags (Source, Medium, Campaign) and downloadable vector QR codes.
**Why**: Enables sellers to immediately launch Instagram, Facebook, Google, or newsletter ads and measure performance without third-party link shorteners.

---

## API Routes Built

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/auth/me` | Public/Cookie | Returns currently authenticated user profile |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, sets HTTP-only session cookie |
| `POST` | `/api/auth/register` | Public | Registers Buyer or Seller account |
| `POST` | `/api/auth/logout` | Session | Clears session cookie |
| `GET` | `/api/products` | Public | Search and filter digital products |
| `POST` | `/api/payments/create-order` | Public | Calculates commission split and creates Razorpay order |
| `POST` | `/api/payments/verify` | Public | Atomic payment verification, wallet credit, token issue |
| `GET` | `/api/download/[token]` | Public (Token-bound) | Streams protected PDF file with anti-piracy validation |
| `GET` | `/api/seller/products` | SELLER | Returns seller's uploaded products and sales stats |
| `POST` | `/api/seller/products` | SELLER | Uploads new PDF file, thumbnail, and creates listing |
| `GET` | `/api/seller/earnings` | SELLER | Returns wallet balance, sales volume, and order history |
| `POST` | `/api/seller/withdrawals` | SELLER | Initiates payout request with wallet deduction |
| `GET` | `/api/admin/theme` | Public | Returns current platform theme CSS variables |
| `POST` | `/api/admin/theme` | SUPER_ADMIN | Saves new theme color scheme to database |
| `POST` | `/api/admin/commissions` | SUPER_ADMIN | Updates platform vs seller commission percentage |
| `GET` | `/api/admin/withdrawals` | SUPER_ADMIN | Lists pending seller withdrawal requests |
| `PATCH` | `/api/admin/withdrawals` | SUPER_ADMIN | Approves or rejects seller payout requests |
| `GET` | `/api/admin/products` | SUPER_ADMIN | Lists all platform products with moderation actions |
| `PATCH` | `/api/admin/products` | SUPER_ADMIN | Approves, suspends, or moderates catalog items |

---

## Components Built

| Component | Location | Props | Usage |
|---|---|---|---|
| `Navbar` | `components/ui/Navbar.tsx` | `{}` | Global header with live auth state and responsive navigation |
| `Footer` | `components/ui/Footer.tsx` | `{}` | Platform footer with links, copyright, and trust badges |
| `HeroSection` | `components/marketing/HeroSection.tsx` | `{}` | Homepage hero with dynamic stats and quick search |
| `CategoriesGrid` | `components/marketing/CategoriesGrid.tsx` | `{}` | Interactive category filter buttons |
| `FeaturedProducts` | `components/marketing/FeaturedProducts.tsx` | `{ products: Product[] }` | Curated product grid on homepage |
| `HowItWorks` | `components/marketing/HowItWorks.tsx` | `{}` | 3-step value illustration |
| `ProductCard` | `components/store/ProductCard.tsx` | `{ product: Product, onBuy: fn }` | Reusable e-book card with rating & price |
| `BuyModal` | `components/store/BuyModal.tsx` | `{ product: Product, isOpen, onClose }` | Checkout modal with Razorpay simulation & token unlock |
| `ProductDetailView` | `components/store/ProductDetailView.tsx` | `{ product: Product }` | Full product page with preview & purchase bar |
| `UploadModal` | `components/dashboard/UploadModal.tsx` | `{ isOpen, onClose, onCreated }` | Seller upload modal with file picker & pricing |
| `ShareLinkModal` | `components/dashboard/ShareLinkModal.tsx` | `{ product: Product, isOpen, onClose }` | Ad campaign link builder with QR code download |
| `WithdrawModal` | `components/dashboard/WithdrawModal.tsx` | `{ balance, isOpen, onClose, onRequested }` | Payout request dialog with instant balance check |

---

## Configuration Added

- **`prisma/schema.prisma`**: Models: `User`, `Product`, `Order`, `DownloadToken`, `Commission`, `Withdrawal`, `PlatformSettings`.
- **`.env`**: Added session secret, default upload directory, and Razorpay test configuration.
- **`uploads/products/`**: Protected directory containing uploaded PDFs outside web root.

---

## Seeded Test Accounts

| Role | Email | Password | Pre-seeded Balance / Content |
|---|---|---|---|
| **Super Admin** | `admin@digivault.com` | `adminpassword123` | Platform settings, 15% commission rate, theme customizer |
| **Seller** | `seller@digivault.com` | `sellerpassword123` | 3 published e-books, ₹14,850 earnings, mock sales history |

---

## How to Test This Sprint

1. **Verify Home & Storefront**:
   - Open `http://localhost:3000/` to test hero animations, category filtering, and product grids.
   - Click "Browse Catalog" to enter `http://localhost:3000/store` and test search.
2. **Test End-to-End Buyer Purchase & Instant Download**:
   - Click "Buy Now" on any product.
   - Enter name and email in the Razorpay checkout modal and click "Pay & Unlock Instantly".
   - Confirm celebration confetti, order ID, and immediate "Download Your PDF Now" button.
   - Verify the download link streams the PDF with proper filename and Content-Disposition headers.
3. **Test Seller Campaign Link Generator & Upload**:
   - Sign in as `seller@digivault.com` / `sellerpassword123`.
   - In `/dashboard`, click "Promote / Ad Links" on any product.
   - Change UTM Source (e.g. `instagram`), UTM Medium (`story`), Campaign (`summer_sale`).
   - Copy link or click "Download High-Res QR Code".
   - Click "Upload New Product" to test creating a listing with a custom PDF.
4. **Test Super Admin Dynamic Theme & Commission Split**:
   - Sign in as `admin@digivault.com` / `adminpassword123`.
   - Navigate to `/admin`.
   - Pick a new Primary Color (e.g., `#FF4081` Pink or `#00E5FF` Cyan), click "Save & Apply Live Theme".
   - Refresh the page and notice the live dynamic theme updates across all cards, buttons, and navigation without any rebuild!
   - Adjust the commission slider (e.g., 90% Seller / 10% Platform) and save.

---

## Automated Test Verification (17/17 Passed)

An end-to-end automated test runner was developed at `scripts/test-e2e-flow.mjs` (runnable with `npm run test:e2e`).
All 17 critical test cases passed with zero errors, creating real entries in the database:
- **Seller Registration & Session Validation**: `pro_seller_<timestamp>@example.com`
- **Buyer Registration**: `buyer_<timestamp>@example.com`
- **Super Admin Login**: Authenticated administrator
- **Binary PDF Upload & Multipart Form Handling**: Successfully uploaded and stored in `./uploads/products/`
- **Catalog Indexing & Search**: Verified product discovery by keyword
- **Ad Campaign Link Generation**: Verified UTM query parameters and slug resolution
- **Razorpay Order Creation**: Verified dynamic commission split calculation (85% seller / 15% platform)
- **Atomic Multi-Table Payment Settlement**: Executed in a single Prisma `$transaction`
- **Seller Wallet Credit**: Verified wallet balance increment
- **72-Hour Expiring Anti-Piracy PDF Stream**: Verified valid PDF binary headers and attachment headers
- **Tampered Token Blocking**: Rejected spoofed tokens with HTTP 404
- **Seller Payout Request**: Tested wallet deduction
- **Admin Rejection & Atomic Auto-Refund**: Verified refund back into seller wallet
- **Admin Payout Approval**: Verified second payout marked `COMPLETED`
- **Live Dynamic Theming**: Persisted and served via CSS custom properties

For the complete architectural flow diagrams, sequence specifications, and test reports, see [`docs/FLOW_TESTING.md`](docs/FLOW_TESTING.md).

---

## Next Sprint Preview
- **Sprint 1**: Cloudflare R2 / AWS S3 direct pre-signed upload integration, seller webhook alerts for sales, and advanced sales analytics graphs.
