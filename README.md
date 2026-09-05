# Smart Warehouse Space Sharing Platform

> **Tagline:** Rent only the space you need, for only as long as you need it.
> **Main message:** Don't rent an entire warehouse when you only need a small space. Don't leave valuable warehouse space unused. **Share it. Store it. Grow.**

A full-stack warehouse space-sharing marketplace that connects warehouse owners with unused space to businesses that need flexible, affordable storage.

Created at: `C:\Users\pujit\OneDrive\Desktop\Warehouse`

---

## 🏗️ What It Does

- **Warehouse Owners** list their *unused/unavailable* space (e.g. a 10,000 sq.ft warehouse with 7,000 used lists the 3,000 sq.ft remaining).
- **Businesses / Customers** search, compare, price and book *only the portion of space they need* (e.g. 500 sq.ft instead of a whole warehouse).
- **Admin** verifies warehouses and manages the entire platform.

A single warehouse can serve multiple different businesses simultaneously — that's the core differentiator.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) — MongoDB Atlas |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Styling | Custom CSS design system (no UI framework) |

**No AI** used for recommendations/predictions — the core platform is fully deterministic.

---

## 📁 Project Structure

```
Warehouse/
├── package.json            # root scripts (dev/seed)
│
├── server/                 # Express + MongoDB backend
│   ├── index.js            # app entry
│   ├── seed.js             # sample data seeder
│   ├── .env.example        # template (copy to .env)
│   ├── config/             # db connection + constants
│   ├── middleware/         # JWT auth + role guards
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── controllers/        # business logic
│   └── utils/              # pricing helpers
│
└── client/                 # React + Vite frontend
    ├── index.html
    └── src/
        ├── App.jsx         # all routes
        ├── index.css       # design system
        ├── context/        # AuthContext
        ├── components/     # Navbar, Footer, Sidebar, etc.
        ├── pages/
        │   ├── public/     # Home, Find, Details, About, etc.
        │   ├── auth/       # Login, Register
        │   ├── customer/   # Customer dashboard pages
        │   ├── owner/      # Owner dashboard pages
        │   └── admin/      # Admin dashboard pages
        └── utils/          # api client, format helpers
```

---

## 🚀 Quick Start

### ✅ Already set up (local MongoDB)

MongoDB Community Server **8.0** is already installed and configured on this machine at:
- Binaries: `C:\Users\pujit\mongodb\Server\8.0\bin\mongod.exe`
- Data folder: `C:\Users\pujit\mongodb-data`
- Logs: `C:\Users\pujit\mongodb-log\mongod.log`

`server\.env` already points to it: `MONGO_URI=mongodb://127.0.0.1:27017/smartwarehouse`
The database was **already seeded** with demo data.

### 1. Start MongoDB (if not running)

Double-click `start-mongodb.bat`, or run it from the terminal.

### 2. Install dependencies (done once)

```
npm.cmd install --prefix server
npm.cmd install --prefix client
```

### 3. Run the app

Two terminals:

```
# Terminal 1 — backend
npm.cmd run server       # (or: node server/index.js)

# Terminal 2 — frontend
npm.cmd run client       # (or: npm.cmd run dev --prefix client)
```

Or run both together: `npm.cmd run dev` (uses `concurrently`).

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Re-seeding (optional — resets to demo data)

```
npm.cmd run seed
```

---

### Optional: MongoDB Atlas (cloud)

The original Atlas connection was configured, but your network blocks the TLS
handshake to `*.mongodb.net` (error `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`), so a
**local** MongoDB is used instead. To switch back to Atlas later, set
`server\.env` to your `mongodb+srv://...` string and re-seed. Your Atlas credentials
were `admin` / `9505Puji23` with host `cluster0.l25tfzi.mongodb.net`.

---

## 🔑 Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@smartwarehouse.com` | `admin123` |
| Owner | `owner1@example.com` | `owner123` |
| Customer | `customer1@example.com` | `customer123` |

These are also shown as one-click buttons on the Login page.

---

## 🧩 Database Schema (MongoDB collections)

- `users` — name, email, phone, password (hashed), role (customer/owner/admin), profileImage, status
- `warehouses` — ownerId, name, location, address, totalSpace, availableSpace, price, minimumDuration, storageType, warehouseType, facilities, security, images, rating, verificationStatus, status
- `bookings` — customerId, warehouseId, ownerId, spaceRequired, startDate, endDate, spaceRent, deposit, platformFee, totalAmount, status, agreementGenerated, paymentStatus
- `inventory` — customerId, warehouseId, productName, sku, category, quantity, rack, expiryDate, lowStockThreshold
- `payments` — bookingId, customerId, warehouseId, amount, type, method, status
- `agreements` — bookingId, customerId, ownerId, warehouseId, spaceRented, period, rent, deposit, platformFee, terms, signatures
- `reviews` — reviewerId, revieweeId, warehouseId, targetType, security/cleanliness/accessibility/facilities/overall, comment
- `accessLogs` — userId, userName, warehouseId, warehouseName, accessType, status, method
- `notifications` — userId, title, message, type, read
- `complaints` — userId, customerName, subject, description, status, resolution

---

## 💰 Pricing Formula

```
Total Rent = Required Space × Price per sq.ft × Rental Duration (months)
Space Rent  = 500 × ₹20 × 2 = ₹20,000
Deposit     = 10% of space rent
Platform Fee= 5% of space rent
Total       = space rent + deposit + platform fee
```

The price is calculated live on the Warehouse Details page as the customer picks space and dates.

---

## 🔐 Booking Workflow & Statuses

1. Customer selects warehouse → enters required space → picks dates → estimated cost is shown → submits **Request Booking**.
2. Owner receives the request and **approves** or **rejects** it.
3. On approval, the customer **pays**, a **digital agreement** is generated, access is activated, and the customer can manage **inventory**.

Booking statuses: `pending → approved → active → completed` (with `cancelled` / `rejected`).

---

## 🔍 What Works Without a Database

If `MONGO_URI` isn't configured, the app still runs:
- The server starts and serves the API (with a clear warning).
- The frontend shows a banner: *"Database not connected. Configure MONGO_URI..."*
- Static/demo content (featured warehouses on Home, etc.) shows as fallback so the interface is still explorable.

For full functionality (real warehouses, bookings, auth, dashboards with live data), configure MongoDB and run `npm run seed`.

---

## 📄 Pages (37 total)

**Public:** Home, About, Find Warehouse, Warehouse Details, How It Works, List Your Space, Login, Register, Contact Us, FAQ

**Customer:** Dashboard, My Bookings, Booking Details, My Inventory, Digital Agreements, Payments, Secure Access, Access Logs, Profile, Notifications

**Owner:** Dashboard, My Warehouses, Add Warehouse, Edit Warehouse, Booking Requests, Customers, Revenue, Agreements, Owner Profile, Notifications

**Admin:** Dashboard, Users, Warehouse Verification, Warehouses, Bookings, Payments, Complaints, Reviews, Reports

---

## 🔒 Security / Face Authentication (simulated)

The "Secure Warehouse Access" page simulates a face-verification gate:
- Select warehouse → **Start Verification** → animated scan → "Identity Verified / Access Granted" or "Verification Failed / Access Denied".
- Results are logged to Access Logs.
- **No real biometric data is stored** — this is a simulated prototype interface.

---

## 📝 Notes / Limitations

- Payments are **simulated** (no real gateway — pluggable later).
- Agreement **download** uses the browser print dialog (`window.print()`); no real PDF generation yet.
- Face verification is simulated by design (per requirement) unless a real biometric service is configured.
- The GitHub API guide style/formatting follows a clean blue-navy business theme.
