# Sagar Tour and Travels — Master Build Specification
**For agent-first development (Google Antigravity or equivalent) — full rebuild from scratch**

This document is self-contained. It does not assume prior context — feed it to the build agent as-is.

---

## 1. Project brief

Build a production-ready travel/taxi service website for Sagar Tour and Travels, operating out of Lucknow, Uttar Pradesh. The site must rank for local search terms ("best tempo traveller in Lucknow," "taxi service Lucknow," "travel agency Lucknow," "cab service Lucknow"), let the business owner self-serve daily updates to pricing/fleet/photos through a CMS, and capture leads with minimal user friction (tap-to-call / WhatsApp / one-field quote requests — no long contact forms).

**Stack:** Astro JS (hybrid static + server rendering) · Sanity CMS (free tier) · Vercel or Netlify hosting · GA4 + Airtable/Google Sheet for lead tracking.

---

## 2. How to use this document

Build in this order — each phase depends on the one before it:

1. Scaffold the Astro project + design system (Sections 4, 5)
2. Build the CMS schema and seed it with the real rate card data in Section 8 (do this before building pages, so pages can pull from real data, not placeholders)
3. Build the information architecture / page templates (Section 6)
4. Wire in the fare calculator + lead tracking (Section 9)
5. Apply technical SEO layer (Section 7)
6. QA against the checklist in Section 10

---

## 3. Tech stack & architecture

- **Framework:** Astro JS
- **Rendering strategy (hybrid):**
  - SEO content pages (hub pages, spoke pages, blog) → fully static (SSG), rebuilt on content-structure changes
  - Pricing table + fleet list → server-rendered fragment (`prerender = false`, or ISR with 5–10 min revalidation), fetching live from CMS so price edits go live same-day without a full rebuild
- **Hosting:** Vercel or Netlify — both support Astro hybrid mode and serverless API routes natively; no dedicated server to maintain
- **CMS:** Sanity.io (free tier) — hosted, zero server maintenance, built-in image CDN
- **Lead tracking:** GA4 events (client-side) + Astro API route writing to Airtable/Google Sheet (server-side)
- **Call tracking:** Exotel or Knowlarity virtual number on the primary "Call now" CTA

---

## 4. Design system

**Direction:** Trustworthy, premium, mobile-first. This is a category where buyers are anxious about safety and price transparency — design should visually communicate both.

- **Color palette:** Deep navy/indigo as primary (trust, professionalism) + warm gold/amber as accent (premium — used sparingly for CTAs and the wedding/luxury vehicle tier) + off-white background, not stark white. Avoid the generic "taxi yellow + red" look most competitors use — differentiate visually, not just verbally.
- **Typography:** A clean, modern sans-serif (e.g., Inter or Manrope for body/UI, a slightly heavier weight for headings). No decorative/script fonts — this audience wants clarity and speed, not flourish.
- **Imagery:** Real fleet photography only — no stock images. Every vehicle card should use the actual photo uploaded by Sagar through the CMS. This is a direct, visible trust differentiator versus competitors using generic stock.
- **Layout principles:**
  - Mobile-first — assume most traffic is a phone, on a slow connection
  - Sticky bottom bar on mobile: Call + WhatsApp buttons, always visible, never scroll away
  - Above-the-fold on every hub page: headline with the target keyword, trust signal (years in business/fleet size), primary CTA
  - Generous whitespace, large tap targets (minimum 44px), no dense text blocks
- **Core components to build:**
  - Sticky call/WhatsApp CTA bar (mobile)
  - Vehicle card (photo, name, seater count, local rate, outstation rate, "Get Quote" button)
  - Interactive fare calculator widget (route/distance input + vehicle select → instant estimate → phone number capture to send result)
  - FAQ accordion (schema-marked)
  - Testimonial carousel
  - Sticky/embedded map with service area

---

## 5. Information architecture

```
Homepage
 ├─ Tempo Traveller Lucknow (hub)          → uses Standard rate table (Section 8.2)
 ├─ Taxi Service Lucknow (hub)             → uses Standard rate table (Section 8.2)
 ├─ Travel Agency Lucknow (hub)            → uses Standard + Wedding rate tables
 ├─ Cab Service Lucknow (hub)              → uses Standard rate table (Section 8.2)
 ├─ Wedding Car Rental Lucknow (spoke)     → uses Wedding rate table (Section 8.1)
 ├─ Lucknow Airport / Station Taxi (spoke) → uses Station Transfer table (Section 8.3)
 ├─ Route pages (spokes): Lucknow–Ayodhya, Lucknow–Varanasi, Lucknow–Agra, Lucknow–Delhi
 ├─ Vehicle pages (spokes): Sedan, SUV, Innova Crysta, Innova Hycross, Fortuner, Premium Sedan w/ Sunroof
 ├─ Blog / long-tail content hub
 └─ About, Fleet, Testimonials, Contact
```

**URL structure:** one primary keyword per URL. Examples: `/tempo-traveller-lucknow`, `/wedding-car-rental-lucknow`, `/lucknow-to-ayodhya-taxi`, `/12-seater-tempo-traveller-lucknow`.

---

## 6. Page content specification

Every hub and spoke page includes, in this order: H1 with target keyword → 100–150 word intro → live pricing table (pulled from CMS) → fleet cards with photos → route/landmark content block → trust signals → FAQ (5–8 Qs, FAQPage schema) → testimonials → sticky CTA → embedded map.

---

## 7. Technical SEO specification

- Unique meta title/description per page. Title template: `{Service} in Lucknow | Sagar Tour and Travels` (≤60 chars). Description ≤155 chars with a CTA.
- JSON-LD schema: `LocalBusiness`/`TravelAgency`, `Service`, `FAQPage`, `BreadcrumbList`, `Offer` for pricing, `AggregateRating` once reviews accumulate.
- Auto-generated `sitemap.xml` and `robots.txt`.
- Canonical tag on every page.
- Images: WebP/AVIF, lazy-loaded, descriptive keyword-natural alt text.
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- One H1 per page, logical heading hierarchy, breadcrumb navigation.

---

## 8. Rate card data (transcribed from client's handwritten notes)

> ⚠️ **Verify before launch** — see Section 8.5. Some figures were partially crossed out/corrected in the original notes; confirm final numbers with Sagar before publishing live prices.

### 8.1 Wedding package rates (local = all-inclusive flat rate)

| Vehicle | Local (all-inclusive) | Outstation (per km) |
|---|---|---|
| Sedan Car | ₹7,500 | ₹12/km |
| SUV | ₹9,500 | ₹15/km |
| Innova Crysta | ₹11,000 | ₹18/km |
| Innova Hycross | ₹14,000 | ₹22/km |
| Fortuner | ₹25,000 | ₹50/km |
| Honda City | ₹13,000 | ₹28/km |
| Verna | ₹13,000 | ₹28/km |
| BMW | ₹30,000 | ₹100/km |
| Jaguar | ₹30,000 | ₹100/km |
| Audi | ₹30,000 | ₹100/km |
| Mercedes | ₹35,000 | ₹120/km |

**Wedding package rules:**
- Night charge: ₹500 (applies before 6:30 AM or after 9:30 PM)
- Waiting charge: ₹500
- Toll/parking/border tax: extra, charged at actuals
- Minimum outstation journey: 250 km/day

### 8.2 Standard rates (local & outstation, day-to-day bookings)

| Vehicle | Model examples | Outstation (per km) | Local (flat) |
|---|---|---|---|
| Sedan Car | Dzire, Etios, Amaze, Zest, Aura, Tigor | ₹12/km | ₹2,400 |
| SUV Car | Ertiga, Rumion, Triber, Innova, XL6 | ₹15/km | ₹3,000 |
| Innova Crysta | — | ₹18/km | ₹3,600 |
| Innova Hycross | — | ₹22/km | ₹4,400 |
| Fortuner Legender | — | ₹50/km | ₹9,000 |

**Premium sedan add-on — Honda City / Verna with Sunroof:**
- Local: ₹5,400 flat (night charge ₹500)
- Outstation: ₹27/km (night charge ₹500, 6:30 AM before / 9:30 PM after)
- Toll/parking/border tax extra

**Standard rate rules:**
- Outstation minimum journey: 250 km/day
- Local minimum journey: 120 km / 12 hours, km included garage-to-garage
- Night charge: ₹300 (6:30 AM before / 9:30 PM after)
- Toll/parking/border tax: extra, at actuals

### 8.3 Station transfer rates ("Head Station" in original notes — confirm exact meaning/use case with client, likely railway/airport station transfer)

| Vehicle | Rate (per km) | Night charge |
|---|---|---|
| Sedan | ₹16/km | ₹500 |
| SUV | ₹20/km | ₹500 |
| Innova Crysta | ₹25/km | ₹500 |
| Innova Hycross | ₹27/km | ₹500 |
| Fortuner | ₹60/km | ₹500 |

**Rules:** minimum journey 250 km (outstation), toll/parking/border tax extra, km included garage-to-garage.

### 8.4 Business rules summary (apply site-wide in the fare calculator logic)

- Local bookings: 120 km / 12-hour minimum, garage-to-garage inclusive of km
- Outstation bookings: 250 km/day minimum
- Toll, parking, and border tax are **never** included in quoted rates — always shown as "extra, at actuals" in the UI
- Night charges apply outside the 6:30 AM–9:30 PM window (amount varies by package — see tables above)

### 8.5 Items to confirm with the client before going live

- BMW and Mercedes local rates had a correction/cross-out in the original notes — confirm final figures (currently transcribed as ₹30,000 and ₹35,000)
- Confirm what "Head Station" rates (Section 8.3) actually apply to — station pickup/drop-off, a specific route, or a separate service tier
- Confirm whether the ₹300 vs ₹500 night-charge discrepancy between the wedding package and standard package is intentional (it appears to be — wedding = ₹500, standard = ₹300 — but verify)

---

## 9. CMS schema (Sanity)

**Vehicle:**

| Field | Type | Notes |
|---|---|---|
| Name | Text | e.g. "Innova Crysta" |
| Category | Select | Standard / Wedding / Premium Sunroof / Station Transfer |
| Model examples | Text array | e.g. Dzire, Etios, Amaze |
| Seater count | Number | |
| Photos | Image array | Sanity CDN, auto-optimized |
| Local flat rate | Number | Nullable — not all categories have a flat local rate |
| Outstation rate (per km) | Number | |
| Night charge | Number | |
| Minimum km/day | Number | |
| Availability toggle | Boolean | Hides vehicle from listings when off |

**Route:** route name, distance (km), base fare estimate, description (rich text).

**Testimonial:** name, review text, rating, photo (optional).

Restrict Sagar's editor view to only these fields — do not expose page-structure or schema-level controls.

---

## 10. Lead tracking system

- **Layer 1 (passive):** GA4 events `click_call` and `click_whatsapp` fire automatically on every tap, tagged with page/vehicle/route context. Zero user friction.
- **Layer 2 (auto-captured number):** Call-tracking number (Exotel/Knowlarity) on "Call now"; WhatsApp click inherently shares the visitor's number once they message.
- **Layer 3 (one-field ask):** Fare calculator — visitor selects route + vehicle, sees an instant estimate, provides just a phone number to have it sent — single field, tied to real value exchange.
- **Storage:** Astro API route writes every event/lead to an Airtable base or Google Sheet. Columns: name (if given), phone, source page, route/vehicle viewed, action type, timestamp.

---

## 11. Pre-launch QA checklist

- [ ] All rate tables match confirmed (not draft) client pricing
- [ ] Every page has unique meta title/description
- [ ] Schema markup validates (Google Rich Results Test)
- [ ] Core Web Vitals pass on mobile
- [ ] Sticky call/WhatsApp bar visible on all mobile breakpoints
- [ ] Fare calculator correctly applies minimum-km and night-charge rules per category
- [ ] 301 redirect map from old site URLs is live
- [ ] GA4 + Search Console verified, sitemap submitted
- [ ] Lead log (Airtable/Sheet) receiving test events correctly
