# RefurbHub

## Current State

The homepage (HomePage.tsx) has:
- A single static hero section (text + one image, no carousel)
- Trust badges bar (4 badges)
- Featured products grid (6 products from backend)
- Why Buy Refurbished section (3 cards: Certified Quality, 1-Year Warranty, Fully Tested)
- Customer reviews (3 cards)
- Newsletter signup section
- Footer with brand, quick links, policies, contact columns

Missing sections compared to the requested refinement:
- No hero carousel (5 slides with images)
- No "Why Refurbished is Better Than Brand New" section (5 points)
- No "Customer Protection Policies" section (5 policies)
- No "Why Buy From Us" section (4 points with icons)
- No "Brands We Offer" section (HP, Dell, Lenovo, Apple)
- No "How It Works" section (4 steps)
- No "Special Requests / Bulk Orders / Custom PC Builds" section with contact form
- No "Limited Deals" section with discount badges
- No final CTA section with dark gradient
- Footer missing: Warranty & Returns, Buyback Program, Shipping Information, Bulk Orders, Contact Support columns

## Requested Changes (Diff)

### Add

1. **Hero Carousel (5 slides)** replacing the static hero:
   - Slide 1: Headline "Premium Refurbished Laptops", subheading "Business-Class Performance at Unbelievable Prices", description, CTA "Shop Now | View Deals", image: `/assets/generated/hero-slide1-premium-workspace.dim_1400x700.jpg`
   - Slide 2: Headline "Flagship Performance. Fraction of the Price.", description + highlights (i5/i7, SSD, battery), CTA "Browse Collection", image: `/assets/generated/hero-slide2-laptop-closeup.dim_1400x700.jpg`
   - Slide 3: Headline "Professionally Refurbished. Carefully Tested.", description + 4 bullet points (diagnostics, battery, SSD, OS), CTA "Learn More", image: `/assets/generated/hero-slide3-technician-lab.dim_1400x700.jpg`
   - Slide 4: Headline "Save Up to 70% on Premium Laptops", description, CTA "View Today's Deals", image: `/assets/generated/hero-slide4-laptop-showroom.dim_1400x700.jpg`
   - Slide 5: Headline "Upgrade Your Laptop. Reduce E-Waste.", description, CTA "Start Shopping", image: `/assets/generated/hero-slide5-eco-workspace.dim_1400x700.jpg`
   - Auto-advance every 5s, with dot indicators and prev/next arrows

2. **Featured Products Section** (keep existing but update product card images):
   - Use generated product images: `/assets/generated/product-hp-elitebook.dim_600x400.jpg`, `/assets/generated/product-dell-latitude.dim_600x400.jpg`, `/assets/generated/product-lenovo-thinkpad.dim_600x400.jpg`, `/assets/generated/product-macbook-pro.dim_600x400.jpg`
   - Title: "Featured Laptops" with subtitle referencing brand names

3. **Why Refurbished is the Smarter Choice section** (replace/expand existing "Why Buy Refurbished"):
   - Headline: "Why Refurbished is the Smarter Choice"
   - 5 cards: Better Value (30-70% lower cost), Business-Class Build Quality, Fully Tested & Certified, Eco-Friendly Choice, Same Real-World Performance
   - Right side: comparison image `/assets/generated/why-refurbished-comparison.dim_800x500.jpg`
   - Split layout: left text cards, right image

4. **Customer Protection Policies section**:
   - Headline: "Buy With Complete Confidence"
   - 5 policy cards with icons: 7 Day Easy Return, 30 Day Replacement, Lifetime Buyback & Upgrade, Lifetime Maintenance Support, Extended Warranty
   - Image: `/assets/generated/protection-trust-icons.dim_800x400.png`

5. **Why Buy From Us section** (replace/expand existing WHY_BUY):
   - 4 points: Certified Refurbished Devices, Unbelievable Prices (70% savings), Premium Business Laptops, Reliable Support
   - Minimal icon grid layout

6. **Brands We Offer section**:
   - Display HP, Dell, Lenovo, Apple brand names as styled logo cards
   - Subtle gradient background

7. **How It Works section** (4 steps):
   - Step 1: We Source Corporate Laptops
   - Step 2: Devices Undergo Professional Testing
   - Step 3: Hardware is Refurbished and Optimized
   - Step 4: Devices Are Delivered at Unbelievable Prices
   - Infographic image: `/assets/generated/how-it-works-infographic.dim_1000x400.jpg`
   - Horizontal step cards with numbered indicators and connecting lines

8. **Special Requests / Bulk Orders section** with contact form:
   - Headline: "Have a Special Requirement?"
   - Subheading about bulk orders, specific models, custom PC builds
   - Form fields: Name, Email, Phone Number, Type of Request (dropdown: Bulk Laptop Order / Specific Laptop Model / Custom PC Build / Business Purchase / Other), Budget Range, Message / Requirements
   - CTA: "Request a Quote"
   - Side image: `/assets/generated/bulk-orders-workstation.dim_800x500.jpg`
   - Form submits with toast confirmation

9. **Customer Testimonials section** (update/expand existing):
   - 3 testimonials: Dell Latitude i7 quote, excellent condition+fast delivery, great value vs new
   - Clean card layout

10. **Limited Deals section**:
    - Headline: "Today's Best Laptop Deals"
    - 3 large deal cards with prominent discount badges: HP EliteBook (Save 55%), Dell Latitude (Save 60%), Lenovo ThinkPad (Save 50%)
    - Spotlight image: `/assets/generated/deals-spotlight-display.dim_800x500.jpg`
    - Large colorful discount badges

11. **Final CTA section**:
    - Dark premium gradient background
    - Headline: "Upgrade Your Laptop Today"
    - Subheading: "Premium refurbished laptops at prices you won't believe."
    - CTA button: "Shop Now" linking to /shop

### Modify

1. **Footer** -- Expand to include more link columns:
   - About Us
   - Warranty & Returns
   - Buyback Program
   - Shipping Information
   - Bulk Orders
   - Contact Support
   - Social Media Links (keep existing)
   - Maintain dark, minimal, premium style

2. **Trust Badges** -- Update to reflect new policies: 7 Day Returns, 30 Day Replacement, Lifetime Buyback, Lifetime Support

3. **Newsletter section** -- Keep but move to before the final CTA

### Remove

- The old static hero section (replaced by carousel)

## Implementation Plan

1. Replace static hero in HomePage.tsx with a full-width auto-advancing carousel component (HeroCarousel.tsx) using the 5 generated slide images, with dot indicators, prev/next arrows, and smooth slide transitions
2. Keep existing featured products grid but update section heading and trust feel
3. Replace old "Why Buy" section with expanded 5-point "Why Refurbished is the Smarter Choice" section with comparison image
4. Add "Customer Protection Policies" section with 5 policy cards after Why Refurbished
5. Add simplified "Why Buy From Us" icon grid section
6. Add "Brands We Offer" section with HP, Dell, Lenovo, Apple styled cards
7. Add "How It Works" 4-step section with infographic image
8. Add "Special Requests" section with contact form (controlled form, toast on submit)
9. Update testimonials section with the 3 requested quotes
10. Add "Limited Deals" section with 3 deal cards and discount badges
11. Add final dark CTA section before newsletter
12. Update Footer.tsx to add Warranty & Returns, Buyback Program, Shipping Information, Bulk Orders, Contact Support columns
13. Update trust badges to reflect the new 7-day return and 30-day replacement policy
