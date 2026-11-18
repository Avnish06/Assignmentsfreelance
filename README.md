# Appointment Manager (MERN)

A modern, responsive full-stack Appointment Management application built according to the Freelancer Practical Assessment specifications.

---

## 1. Features Implemented

- **Appointment Listing:** View appointments with customer name, service type, formatted date/time, and color-coded status badge.
- **Add Appointment with Validation:**
  - Customer name (required, min 2 characters).
  - Service selection (required).
  - Date & Time selection (required, valid format).
  - Initial status selection (Pending, Confirmed, Cancelled).
  - Immediate visual feedback on field-level validation errors.
- **Status Change:** Quick one-click status transitions (`Pending` ↔ `Confirmed` ↔ `Cancelled`) directly on cards with instant optimistic update & backend persistence.
- **Status Filtering:** Filter tabs for `All`, `Pending`, `Confirmed`, and `Cancelled` appointments.
- **Customer Name Search:** Real-time search query filter matching customer name case-insensitively with debouncing.
- **Persistent Storage:** MongoDB Atlas database persistence with automatic seeding of the starting assessment dataset.
- **Responsive Interface:** Clean modern UI styled with Tailwind CSS, optimized for mobile, tablet, and desktop screens.

---

## 2. Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React (Icons).
- **Backend:** Node.js, Express.js, Mongoose ODM, CORS, Dotenv.
- **Database:** MongoDB Atlas (Cloud cluster).

---

## 3. Project Structure

```
FreelanceAssignment/
├── server/
│   ├── models/
│   │   └── Appointment.js         # Mongoose schema and validation
│   ├── routes/
│   │   └── appointments.js        # REST endpoints (GET, POST, PATCH, DELETE)
│   ├── .env                       # Environment configuration (active)
│   ├── .env.example               # Example environment without secrets
│   ├── package.json
│   └── server.js                  # Express app & Atlas connection
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentCard.jsx # Card view & status toggle
│   │   │   └── AppointmentForm.jsx # Add form with validation
│   │   ├── services/
│   │   │   └── api.js              # Fetch client wrapper
│   │   ├── App.jsx                 # Main layout, search, filters & state
│   │   ├── index.css               # Tailwind directives
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### A. Backend Setup
1. Open a terminal and navigate to `server`:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://avnishkrggn_db_user:d5vSEkRSE9u63MIV@cluster0.hr6eiu2.mongodb.net/appointment_manager?retryWrites=true&w=majority
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server runs on `http://localhost:5000` and automatically populates the initial 3 assessment appointments if the collection is empty.*

### B. Frontend Setup
1. In another terminal, navigate to `client`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://127.0.0.1:3000`.

---

## 5. API Documentation

| Method | Endpoint | Description | Request Body / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/appointments` | List appointments | `?status=All|Pending|Confirmed|Cancelled&search=<name>` |
| `POST` | `/api/appointments` | Add new appointment | `{ customerName, service, dateTime, status }` |
| `PATCH` | `/api/appointments/:id/status` | Update status | `{ status: "Pending" | "Confirmed" | "Cancelled" }` |
| `DELETE` | `/api/appointments/:id` | Delete appointment | None |
| `GET` | `/api/health` | Health & DB check | None |

---

## 6. Technical Decision

**Decision:** Implemented combined server-side query filters (`status` and `search` regex) with client-side debouncing and optimistic local state updates.
- **Why:** Supporting server-side query parameters allows this application to scale gracefully to thousands of records without sending massive payloads to the client. Pairing this with a 250ms debounced input and immediate in-memory UI updates ensures instantaneous user interactions without lag.
- **DNS Resilience:** In Node.js environments where local ISP or router DNS blocks SRV queries (`querySrv ECONNREFUSED`), we explicitly configured Node's DNS resolver fallback to `8.8.8.8` / `1.1.1.1` to guarantee reliable connectivity to MongoDB Atlas clusters across all local network configurations.

---

## 7. Completed Features, Incomplete Items & Limitations

### Completed Features:
- [x] Initial seed dataset loaded (Alex Morgan, Jamie Lee, Taylor Smith).
- [x] Responsive layout with mobile/desktop support.
- [x] Add appointment form with field-level validation and explicit error alerts.
- [x] Filter by status (All, Pending, Confirmed, Cancelled).
- [x] Customer name search (Change Request completed).
- [x] In-place status toggling with immediate badge updates.
- [x] Persistence in MongoDB Atlas cluster.
- [x] Page reload verification and data consistency.

### Incomplete Items / Known Limitations:
- User authentication and role-based permissions (admin vs client) were intentionally omitted as out-of-scope for the 90-minute brief.
- Currently, appointments are listed ordered by scheduled date/time; pagination or infinite scrolling can be added when appointment volume grows beyond hundreds of records.

