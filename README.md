Frontend (Vite + React)

Overview
- React 19 app (Vite) with react-router v7, Tailwind CSS v4, lucide-react icons, rc-slider, sonner toasts.
- Talks to the backend via an axios wrapper in src/lib/api.js.
- Product listing, product detail, reviews, cart, popular picks carousel, category filter with Thai/English synonyms.

Quick Start
1) Install
   - cd frontendGroup7
   - npm install
2) Env
   - Create .env with VITE_API_BASE pointing to backend REST base
     Example: VITE_API_BASE=http://localhost:4000/api/v1/mongo
3) Run
   - Dev: npm run dev (http://localhost:5173)
   - Build: npm run build
   - Preview build: npm run preview

Important Config
- src/lib/api.js reads VITE_API_BASE and sends credentials (cookies) and Authorization header from localStorage.user.token

Features
- Popular Picks (Home): GET /products/popular?minAvg=3, shows rating-based picks; drag/scroll carousel with hover arrows; Trial badge if product or any variant is trial
- Category Cards: Links to /products?category=Chairs(เก้าอี้) etc.
- Product List: Filters support Thai/English category synonyms; keeps human-readable label in URL while converting to backend values under the hood
- Product Detail: Loads product, thumbnails/variant images; basic review section with POST /reviews; add-to-cart via /cart/items

Environment Variables
- VITE_API_BASE: Backend base URL, e.g. http://localhost:4000/api/v1/mongo

Deployment (Vercel)
- Root Directory: frontendGroup7
- Install command: npm ci
- Build command: npm run build
- Environment: set VITE_API_BASE to your backend URL
- If build references stale cache, clear cache and redeploy

Scripts
- npm run dev: Start dev server
- npm run build: Build production assets
- npm run preview: Preview built app

Notes & Conventions
- Do not import axios directly in pages/components; use api from src/lib/api.js (axios.create with interceptors)
- Category mapping supports inputs like "เก้าอี้", "โต๊ะ(ยืน)", "accessories" and maps them to Chairs/Tables/Accessories
- Icons: lucide-react, no local /public/icon svgs required

# LivinLab_Frontend
