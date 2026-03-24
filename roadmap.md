#  TrashTrail Product Roadmap

This document outlines the current state of TrashTrail and planned future developments for the Nebulon'26 Hackathon and beyond.

##  Current Phase: Foundation & Real-Time Tracking
- Frontend Architecture : Next.js 14 App Router with Tailwind CSS.
- Core Models : MongoDB schemas for Users (Rbac), WasteBags, Complaints, and Anomalies.
- Admin Dashboard : Live metrics, collection trends, and ward-wise insights connected to real DB.
- API Layer : Secure endpoints for analytics, waste registration, and anomaly detection.
- Authentication : NextAuth.js JWT-based session management.

##  In Progress: Field Operations & Monitoring
-  QR Scanning : Implementation of HTML5-QRCode in the collector dashboard.
-  Live Mapping : Enhancing `MapComponent.jsx` to show real-time GPS vectors of collection vehicles using Leaflet.
-  Image Classification : Connecting Gemini Pro Vision for automatic waste segregation verification.
-  Anomaly Engine : Refining weight variance algorithms to flag mismatches at collection points.

##  Future Goals (V2)
- Blockchain Integration**: Immutable ledger for waste certification at final processing facilities.
- Citizen Rewards**: Automated 'Green Score' to discount coupon generation for shops.
- Predictive Analytics**: Forecasting waste overflows in specific wards using historical data.
- Mobile App**: PWA conversion for better offline field access for collectors.

---
Last updated: March 24, 2025
