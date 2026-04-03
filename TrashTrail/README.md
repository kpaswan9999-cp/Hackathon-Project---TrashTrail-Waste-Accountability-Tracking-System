# 🌿 TrashTrail — Waste Accountability & Tracking System

> From Dustbin to Destination — Every Gram Tracked

**Winner / Entry for Nebulon'26 Hackathon**

---

## 🎯 Problem Statement
Urban waste management systems lack transparency once waste leaves households. Rampant issues include:
- Unverified recycling claims and unmonitored drop-offs
- Waste being improperly diverted to local dumps instead of verified facilities
- Contractors falsely reporting tonnage for increased compensations
- Citizens lacking incentives to segregate waste initially.

## 💡 Our Solution  
TrashTrail is an end-to-end digital tracking framework providing absolute immutable transparency across the municipal waste cycle. 
We issue unique cryptographic QR tags corresponding directly to weight entries spanning the Citizen, Collector, and Processing checkpoints.

## ✨ Key Features
- **📱 QR-Based Waste Tracking** (Trace bag origins spanning logistics networks)
- **🤖 Google Gemini AI Waste Image Classification** (Auto-detect compliance)
- **🗺️ Real-Time Leaflet GPS Cartography Tracking** (Monitor fleet vectors)
- **⚠️ Automated Anomaly Recognition Engine** (Identify weight drops and trajectory drift)
- **🌱 Carbon Footprint Calculator** (Gamified CO2 metrics)

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router, Tailwind CSS, Lucide |
| Logic Maps | Leaflet.js, React-Leaflet |
| Backend | Next.js API Routes (Serverless) |
| Database | Local JSON Storage (Low-db style System) |
| Authentication | NextAuth.js (Role Based Access) |
| Hardware Integrations| HTML5-QRCode Scanner, qrcode.react |
| AI Pipeline | Google Gemini Pro Vision API |

## 🚀 How to Run Locally

1. Install Dependencies:
```bash
npm install
```

2. Seed your Local JSON Database with Mock Data:
```bash
node scripts/seedLocal.js
```

3. Initialize Next.js Application Server
```bash
npm run dev
```

Navigate to `http://localhost:3000` to interact with the platform.

---

### 🗺️ Project Status
For a detailed look at implemented features and our development timeline, please refer to the [ROADMAP.md](./ROADMAP.md).
