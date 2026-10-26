# SKININSIGHTS LAB — Minimalist Skincare E-Commerce & AI Scanner

A modern, mobile-responsive e-commerce website for a minimalist skincare brand, engineered with clean aesthetics, real-time computer vision simulation, and personalized product matching.

---

## 🔬 Core Features Implemented

### 1. Aesthetic Design System
- **Minimalist Palette**: Clean white backgrounds, sharp high-contrast black typography, solid black CTA buttons (`#000000`), and subtle technical emerald/cyan biometric accents.
- **Typography**: Paired neo-grotesque `Plus Jakarta Sans` for editorial clarity, `Space Grotesk` for brand headers, and `JetBrains Mono` for clinical telemetry.
- **Micro-Interactions**: Smooth 60fps animations for laser sweep, radar ping reticles, and SVG leader line drawings.

### 2. Hero Section (SkinInsights Live Scanner)
- **Prominent 'Scan Your Face' Button**: High-contrast, biometric reticle CTA in the hero section and sticky navigation.
- **Simulated Live Camera Feed**: Renders high-definition facial feed with realistic lighting, biometric grid overlay, and HUD telemetry indicators (FPS, latency, confidence score).
- **Webcam Switcher**: Allows toggling seamlessly between the default simulated feed and live device webcam.
- **High-Tech Scanning Animation**:
  - Vertical sweeping laser beam with dual glow filters.
  - **Dynamic Pinpoint Markers & Connecting Lines**:
    - **Forehead**: Pinpoint radar dot + SVG connector line pointing to floating tag `"Open Pores"` (`T-Zone Sebum Accumulation · 68% Density`).
    - **Cheek/Jaw**: Pinpoint radar dot + SVG connector line pointing to floating tag `"Acne Detected Here"` (`Active Papules · Grade 2`).
    - **Temple/Zygomatic Arch**: Pinpoint radar dot + SVG connector line pointing to floating tag `"Pigmentation"` (`Post-Acne PIH · Melanin 72%`).
- **3-Second Scan Transition**: High-frequency telemetry progress bar running over 3 seconds, transitioning automatically with synthesized audio feedback into the personalized report.

### 3. Personalized 'AI Skin Report'
- **Section A: Skin Profile**:
  - Highlights detected diagnosis: `Oily, Acne-Prone (Grade II)`.
  - Telemetry meters for Sebum Output (84%), Pore Dilatation (76%), Hydration Index (38%), and Pigment Score (62%).
- **Section B: Lifestyle & Diet Tips**:
  - Actionable interactive cards recommending:
    1. **"Drink 2-3 liters of water daily"** (thins thick sebum, hydrates intercellular matrix).
    2. **"Reduce sugar intake"** (prevents IGF-1 and insulin surges causing acute breakouts).
    3. **"Avoid oily junk food"** (eliminates oxidized lipids and trans fats).
- **Section C: AI Product Match**:
  - Recommends **exactly 2 products** tailored to the detected conditions:
    1. **Salicylic Acid 2% Clarifying Cleanser** ($24.00) — Targets Acne & Open Pores.
    2. **Niacinamide 10% + Zinc 1% Refining Serum** ($28.00) — Targets Pigmentation & Open Pores.
  - Complete with solid black 'Add to Cart' buttons and a 1-click bundle routine option.

### 4. Shopping Catalog
- Grid of clean minimalist product cards.
- Each product includes:
  - High-res minimalist imagery
  - 5-Star rating with review counts (e.g. `★★★★★ 5.0 (428)`)
  - Pricing ($24.00 - $34.00)
  - Explicitly labeled targeted skin issues (e.g., `'Acne, Breakouts & Oiliness'`, `'Pigmentation & Uneven Texture'`)
  - Solid black 'Add to Cart' buttons with toast notifications and sound feedback.

### 5. Floating Dark Chat Bubble Support
- **Fixed in the bottom-left corner** (`bottom-6 left-6`).
- Interactive concierge chat with quick chips, responsive AI advice, and routine guidance.

### 6. Cart Drawer & Checkout
- Slide-out cart drawer with quantity adjustments, item removal, free shipping tracker ($50 threshold), and mock checkout workflow.

---

## 🚀 How to Run Locally

### Option A: Open directly in any browser
Double click `index.html` or open `C:\Users\DELL\.gemini\antigravity\scratch\skininsights\index.html` in Chrome, Edge, Safari, or Firefox.

### Option B: Run via built-in Node.js server
```bash
cd C:\Users\DELL\.gemini\antigravity\scratch\skininsights
node server.js
```
Then navigate to: `http://localhost:3000`
