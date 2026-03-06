# RefurbHub

## Current State

The site is a multi-page refurbished laptop marketplace with:
- **AboutPage.tsx**: Hero section with centered text layout, stats strip, process steps, values grid, sustainability strip, CTA. The hero is text-only (no visual element on the right), uses `bg-gradient-to-br from-slate-50` background, has two buttons (Browse Laptops, Contact Us). The decorative layout currently has no image split.
- **ShopPage.tsx**: Left sidebar filter panel (Brand, RAM, Storage, Condition, Price Range), category tabs row, search+sort bar, 3-col product grid. Filter sections use flat `FilterSection` components with basic checkboxes. No collapsible accordion sections. Filter panel is in a plain card.
- **ProductCard.tsx**: Has image, brand label, product name, condition badge, spec chips (processor, RAM, storage), price with strikethrough, Add to Cart button. Discount % badge top-left. Has wishlist button. Card has `card-hover` and `shadow-card`. Missing trust indicator badges (Certified Refurbished, Warranty Available, Tested). Save % badge text currently reads "-55%" not "Save 55%". No "View Details" link prominently.
- **HomePage.tsx**: Multiple sections already implemented with premium styling. Featured products section has no heading (previously removed). Trust badges, categories, trending, why-refurbished, protection policies, testimonials, why buy from us, special request form, deals, final CTA, newsletter all present.
- Generated images: Product images in `/assets/generated/` use `product-hp-elitebook.dim_600x400.jpg` etc. New product-card images now available at `product-card-hp-elitebook.dim_600x450.jpg` etc. New about hero image at `about-hero-workspace.dim_800x600.jpg`.

## Requested Changes (Diff)

### Add
- **AboutPage hero**: Split two-column layout with text on left and laptop workspace image on right (`/assets/generated/about-hero-workspace.dim_800x600.jpg`). Add subtle background gradient/abstract shapes. Primary "Browse Laptops" button as bright blue rounded with shadow + hover animation. Secondary "Contact Us" as outline with hover fill. Keep "OUR STORY" uppercase label with letter-spacing above the headline.
- **AboutPage**: Add a full **Refurbishment Process** section showing 5 steps horizontally: Corporate Laptop Sourcing → 40+ Point Hardware Testing → Component Replacement → Fresh OS Installation → Final Quality Inspection. Steps connected with arrows/lines. Use icons for each step.
- **ShopPage filters**: Wrap each filter group (Brand, RAM, Storage, Condition, Price Range) in a collapsible `Accordion` component with ChevronDown icons. Increase spacing between items. Add modern styled checkboxes with hover states.
- **ProductCard**: Add trust indicator badges row (Certified Refurbished, Warranty Available, Tested Quality) in a small strip below specs. Change discount badge label from `-55%` to `Save 55%` format. Add a subtle "View Details" secondary link. Enhance hover: image zooms more noticeably, card shadow increases on hover with scale effect.
- **ShopPage**: Add a page hero banner at the top (thin, visually rich) with gradient background, headline "Shop Premium Refurbished Laptops" and short description. Improve overall spacing and visual polish.
- **ProductCard**: Ensure product images use the newer cleaner product card images where possible (swap to `/assets/generated/product-card-*.dim_600x450.jpg` in SHOWCASE_PRODUCTS and DEALS arrays).

### Modify
- **AboutPage hero**: Change from centered-only layout to a **responsive two-column split** (left: text+CTAs, right: image). Reduce paragraph max-width to ~`max-w-lg`. Increase `leading-relaxed` to `leading-loose` on the description. Replace flat white background with a richer `bg-gradient-to-br from-slate-50 via-white to-blue-50` + subtle abstract shape decorations (circles/blobs) positioned in background using absolute positioned divs with blur.
- **AboutPage hero buttons**: Primary button: `bg-primary shadow-md hover:shadow-lg hover:scale-[1.02]` transition with rounded-full or rounded-xl shape. Outline button: `border-2 border-primary/50 text-primary hover:bg-primary hover:text-white` transition.
- **ShopPage FiltersPanel**: Replace `Separator`-separated flat sections with `Accordion` with `AccordionItem`, `AccordionTrigger`, `AccordionContent`. Each filter group gets its own accordion item, open by default. The sidebar card gets a cleaner look with more padding.
- **ProductCard discount badge**: Change text from `"-{discount}%"` to `"Save {discount}%"` and use a stronger `bg-rose-500` color with `text-white font-extrabold`.
- **HomePage SHOWCASE_PRODUCTS and DEALS images**: Update image paths to use the new product-card images for cleaner white-background product shots.
- **ShopPage grid**: Ensure desktop grid is `xl:grid-cols-3` (already is) but add `2xl:grid-cols-4` for very wide screens.

### Remove
- Nothing removed in this pass.

## Implementation Plan

1. **AboutPage.tsx**:
   - Redesign hero section: two-column layout (`grid md:grid-cols-2 gap-12 items-center`), left column has OUR STORY label + headline + description + buttons, right column has the workspace image with rounded corners and shadow.
   - Improve hero background: add decorative abstract blob shapes (absolute positioned divs with `rounded-full blur-3xl bg-primary/5` etc.) behind the content.
   - Restyle buttons: primary with shadow and hover scale, outline with fill-on-hover.
   - Add Refurbishment Process section between Stats and Our Process: 5 steps in a horizontal scrollable row with numbered circles, step titles, and connecting arrows/lines. Mobile: vertical stack.

2. **ShopPage.tsx**:
   - Import `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` from `@/components/ui/accordion`.
   - Replace `FilterSection` + `Separator` pattern in `FiltersPanel` with Accordion items. Each accordion item: Brand, RAM, Storage, Condition, Price Range. Default open.
   - Add a shop page header banner (thin strip) with gradient background, headline, description above the category tabs.
   - Improve filter panel card styling: `shadow-lg border border-border/60`.
   - Add `2xl:grid-cols-4` to product grid.

3. **ProductCard.tsx**:
   - Change discount badge text from `"-{discount}%"` to `"Save {discount}%"`.
   - After specs chips row, add a trust badges strip: small pill badges for "✓ Certified", "🛡 Warranty", "✓ Tested".
   - Enhance hover animation: add explicit `hover:shadow-xl hover:-translate-y-1` and `hover:scale-[1.02]` classes to the card.
   - Add a small "View Details →" text link below the product name area.

4. **HomePage.tsx**:
   - Update `SHOWCASE_PRODUCTS` images to use `/assets/generated/product-card-hp-elitebook.dim_600x450.jpg` etc.
   - Update `DEALS` images similarly.
