# Architecture & Modularity Guidelines

## Core Principles
1. **Never Dump Code in One File**: Break everything down into clean, single-responsibility files and reusable components.
2. **Component Separation**:
   - components/ui/ for universal reusable atoms/molecules (Buttons, Modals, Badges, Inputs, Cards, FileUpload, etc.).
   - components/marketing/ for landing page sections (Hero, Features, Testimonials, Categories, etc.).
   - components/store/ for store browse, product card, filter panel, search.
   - components/dashboard/ for seller dashboard widgets, tables, upload form steps, link generators.
   - components/admin/ for super admin moderation, appearance panel, commission slider, user tables.
3. **Data Layer & Adapters (lib/)**:
   - Database queries and Prisma singleton in lib/prisma.ts.
   - File storage abstraction in lib/storage/ (Local filesystem protected storage adapter -> ready for R2/S3 swap).
   - Dynamic theme engine in lib/theme.ts.
   - Payment gateway helper in lib/razorpay.ts.
4. **Types (	ypes/)**:
   - Centralize TypeScript interfaces and domain models in 	ypes/.
5. **State & Styling**:
   - CSS modules and design system tokens (styles/globals.css).
   - Dynamic theme variables applied to root via admin platform settings.
