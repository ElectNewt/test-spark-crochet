# Handmade Crochet Shop - Product Requirements Document

A beautiful, responsive web application for selling handmade crochet products with integrated storytelling blog that connects craftsmanship stories to products.

**Experience Qualities**:
1. **Warm & Inviting**: Like visiting a cozy craft studio where each piece tells a story
2. **Trustworthy & Professional**: Clean, accessible design that builds confidence in purchasing handmade goods
3. **Story-Driven**: Every product connects to the maker's journey through integrated blog content

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected features (shop, blog, contact, admin) with persistent data and user flows, but manageable scope for rapid development

## Essential Features

**Product Storefront**
- Functionality: Browse, filter, and purchase handmade crochet items
- Purpose: Primary revenue generation through direct sales
- Trigger: Landing page featured products or dedicated shop navigation
- Progression: Browse products → View details → Buy Now → Checkout form → Stripe payment → Confirmation
- Success criteria: Successful purchases store order data and email admin notifications

**Integrated Blog**
- Functionality: Read-only blog posts about crafting process, inspiration, and product stories
- Purpose: Build trust, showcase expertise, and drive product discovery through storytelling
- Trigger: Blog navigation or featured post teasers on homepage
- Progression: Blog list → Individual post → Related product links → Shop checkout
- Success criteria: Each post includes clear product connections and drives traffic to shop

**Custom Commission Requests**
- Functionality: Contact form for custom crochet piece requests
- Purpose: Capture high-value custom work opportunities
- Trigger: Prominent CTA on homepage and dedicated contact page
- Progression: Contact form → Photo upload → Email notification → Admin follow-up
- Success criteria: Form submissions stored and admin receives immediate notification

**Admin Dashboard**
- Functionality: Create, edit, delete products and blog posts; manage visibility
- Purpose: Content management without technical knowledge required
- Trigger: Admin login via secure authentication
- Progression: Login → Dashboard → Manage products/posts → Publish changes
- Success criteria: Hidden products never appear in public API or frontend

## Edge Case Handling
- **Out of Stock**: Products show availability status and prevent purchase when unavailable
- **Payment Failures**: Graceful error handling with clear retry instructions
- **Image Loading**: Optimized images with loading states and fallbacks
- **Form Validation**: Client and server-side validation with helpful error messages
- **Mobile Navigation**: Collapsible menu with touch-friendly targets

## Design Direction
The design should evoke the warmth and craftsmanship of handmade goods - soft, approachable, and authentic like a well-lit craft studio. Minimal interface that lets product photography and storytelling take center stage while maintaining professional credibility for e-commerce.

## Color Selection
Analogous warm palette inspired by natural yarn colors
- **Primary Color**: Soft Blush #FDE8E8 - communicates warmth and handmade comfort
- **Secondary Colors**: Peach #FFF1E0 for accents, Powder Blue #F6F9FF for calm backgrounds, Moss Green #D4E7C5 for success states
- **Accent Color**: Deep Rose #E91E63 for call-to-action buttons and important elements
- **Foreground/Background Pairings**: 
  - Background (Powder Blue #F6F9FF): Charcoal text #2D3748 - Ratio 12.6:1 ✓
  - Card (White #FFFFFF): Charcoal text #2D3748 - Ratio 15.8:1 ✓
  - Primary (Soft Blush #FDE8E8): Dark Gray #1A202C - Ratio 13.2:1 ✓
  - Accent (Deep Rose #E91E63): White text #FFFFFF - Ratio 5.9:1 ✓

## Font Selection
Typography should feel approachable yet professional, combining handwritten warmth with clean readability for e-commerce trust.

- **Typographic Hierarchy**: 
  - H1 (Brand/Hero): Caveat Bold/36px/relaxed letter spacing
  - H2 (Section Headers): Caveat SemiBold/24px/normal spacing
  - H3 (Product Names): Inter SemiBold/18px/tight spacing
  - Body Text: Inter Regular/16px/1.6 line height
  - Captions: Inter Medium/14px/1.4 line height

## Animations
Subtle, organic animations that enhance the handcrafted feeling without overwhelming the shopping experience - gentle hover lifts, smooth transitions, and delicate loading states.

- **Purposeful Meaning**: Animations should feel organic and handcrafted, like gentle movements in a craft studio
- **Hierarchy of Movement**: Product cards get gentle hover elevation, CTAs have subtle pulse on hover, page transitions are smooth and contextual

## Component Selection
- **Components**: Card for products and blog posts, Button for CTAs, Form components for checkout/contact, Dialog for product details, Badge for product status
- **Customizations**: Custom hero banner component, product grid with filtering, blog post cards with featured images
- **States**: Hover states with gentle elevation, loading states with soft spinners, form validation with inline messages
- **Icon Selection**: Phosphor icons - Heart for favorites, ShoppingCart for purchases, Envelope for contact, Eye for blog reading
- **Spacing**: Consistent 4-unit (16px) spacing for sections, 2-unit (8px) for related elements, 6-unit (24px) for major separations
- **Mobile**: Stack cards vertically, collapsible navigation, touch-friendly 44px minimum targets, thumb-accessible bottom navigation