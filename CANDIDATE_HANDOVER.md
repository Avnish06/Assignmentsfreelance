# FREELANCER PRACTICAL ASSESSMENT: CANDIDATE SUBMISSION
## Project: Appointment Manager (MERN Stack)

---

## 1. Candidate Submission Summary
- **Role / Stack:** MERN (MongoDB Atlas, Express.js, React, Node.js).
- **Frontend URL:** [http://127.0.0.1:3000](http://127.0.0.1:3000)
- **Backend API URL:** [http://127.0.0.1:5000](http://127.0.0.1:5000)
- **Database:** MongoDB Atlas (Cloud Cluster connected & active).

---

## 2. Point-by-Point Requirements Verification

| Brief Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **1. Display appointments** | **PASSED** | Displays cards with Customer Name, Service, Formatted Date/Time, and Status badge. |
| **2. Add an appointment** | **PASSED** | Left panel form with customer name, service picker, date/time picker, and status selector. |
| **3. Validate required fields** | **PASSED** | Validates customerName (min 2 chars), service, and dateTime. Visual error highlights and messages displayed inline. |
| **4. Allow user to change status** | **PASSED** | Direct status buttons (`Pending`, `Confirmed`, `Cancelled`) on each appointment card triggers `PATCH /api/appointments/:id/status`. |
| **5. Filter appointments by status** | **PASSED** | Status filter pills (`All`, `Pending`, `Confirmed`, `Cancelled`) filter the list dynamically. |
| **6. Customer-name search field** | **PASSED** | Debounced real-time search box at the top filtering customer names case-insensitively. |
| **7. Clean, responsive interface** | **PASSED** | Modern Tailwind CSS interface optimized for both mobile screens and desktop screens. |
| **8. Node/Express API with MongoDB**| **PASSED** | Express REST API using Mongoose connected to MongoDB Atlas. |

---

## 3. Starting Assessment Data (Pre-Loaded in MongoDB)

| Customer | Service | Date / Time | Status |
| :--- | :--- | :--- | :--- |
| **Alex Morgan** | Consultation | 2026-11-02 10:00 | Pending |
| **Jamie Lee** | Follow-up | 2026-11-02 11:30 | Confirmed |
| **Taylor Smith** | Review | 2026-11-03 14:00 | Cancelled |

---

## 4. Automated Test Suite Results

An automated end-to-end integration test runner was created at `server/test.js`.
To execute tests at any time:
```bash
cd server
npm test
```

### Test Run Output:
```text
====================================================
RUNNING FORMAL PRACTICAL ASSESSMENT TEST SUITE
Project: Appointment Manager (MERN)
Target: http://127.0.0.1:5000/api/appointments
====================================================

[PASS] Starting Data: Verifies initial appointments exist in DB
[PASS] Validation: Rejects appointment with missing fields & returns clear error messages
[PASS] Add Appointment: Successfully creates an appointment with all fields
[PASS] Status Change: Updates appointment status to Confirmed
[PASS] Status Filter: Filters appointments by status = Confirmed
[PASS] Customer Search: Filters appointments matching search query case-insensitively
[PASS] Persistence: Verifies changes persist across fresh database query
[PASS] Cleanup: Deletes temporary test appointment

====================================================
TEST RESULTS: 8 PASSED, 0 FAILED
====================================================
```

---

## 5. Demonstration Step-by-Step Guide for Screen Share

When presenting your 5-step final demonstration:

1. **Step 1 - Add an appointment:**
   - In the form, leave fields blank and click **"Book Appointment"** to show required field validation error messages.
   - Fill in:
     - Name: `Chris Evans`
     - Service: `Consultation`
     - Date & Time: Any upcoming date/time
     - Initial Status: `Pending`
   - Click **"Book Appointment"** and show it added to the list.
2. **Step 2 - Change status:**
   - On the `Chris Evans` card, click the **"Confirmed"** button.
   - Point out that the badge updates to Confirmed immediately.
3. **Step 3 - Filter by status:**
   - Click **"Confirmed"** filter pill (only Confirmed appointments show).
   - Click **"Pending"** (only Pending show).
   - Click **"Cancelled"** (only Cancelled show).
   - Click **"All"** (all appointments return).
4. **Step 4 - Search by customer name:**
   - In the search bar, type `Chris` — only Chris Evans shows.
   - Type `Jamie` — Jamie Lee shows.
   - Clear the input — all appointments return.
5. **Step 5 - Refresh page (Persistence):**
   - Press **F5** or refresh the browser.
   - Show that `Chris Evans` with status `Confirmed` remains in the list, proving true persistence in MongoDB Atlas.

---

## 6. Technical Decisions, Limitations & Handover

- **Technical Decision (DNS & Server-side Filtering):**
  - Resolved local DNS SRV query blocking on Windows by configuring Node DNS resolver fallback (`8.8.8.8` / `1.1.1.1`), guaranteeing reliable connection to MongoDB Atlas.
  - Implemented server-side regex filtering for both search and status filters to ensure scalability for thousands of appointments.
- **Completed Features:** All 8 brief requirements + change request (search) + initial dataset + automated test suite.
- **Known Limitations:** Authentication/RBAC was intentionally left out as instructed by the 90-minute time scope.

