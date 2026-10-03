# Roxiler Assessment — Project Audit Report

This report presents a thorough audit of the Roxiler Store Rating and Management Platform against all mandatory assessment requirements.

## Audit Matrix

| Requirement | Relevant File / API | Status | Evidence | Required Fix | Verification Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Database Schema & Relationships** | `database/schema.sql`, `backend/scripts/seed.js` | **PASS** | `users`, `stores`, `ratings` tables exist with proper PKs, FKs (`owner_id`, `user_id`, `store_id`), indexes, and cascade options. | N/A | **PASS** — Schema creates cleanly and enforces relational integrity. |
| **2. Single Rating Constraint** | `database/schema.sql`, `backend/models/ratingModel.js` | **PASS** | `UNIQUE KEY unique_user_store (user_id, store_id)` exists. `RatingModel.upsert` uses `ON DUPLICATE KEY UPDATE`. | N/A | **PASS** — Submitting a second rating updates existing record instead of inserting duplicate. Verified by test #19 & #20. |
| **3. Rating Value Range (1 to 5)** | `database/schema.sql`, `backend/validators/storeValidator.js` | **PASS** | SQL `rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5)`. Validator checks `Number.isInteger(num) && num >= 1 && num <= 5`. | N/A | **PASS** — Invalid ratings (0, 6, 3.5, string) are rejected with 400 status. Verified by test #20. |
| **4. Average Rating Calculation** | `backend/models/storeModel.js` | **PASS** | Uses `COALESCE(ROUND(AVG(r.rating), 2), 0)` grouped by store ID. | N/A | **PASS** — Average store rating recalculates dynamically upon rating submission/update. Verified by test #18 & #19. |
| **5. Dashboard Counts Accuracy** | `backend/models/userModel.js`, `storeModel.js`, `ratingModel.js` | **PASS** | `UserModel.count()`, `StoreModel.count()`, and `RatingModel.count()` execute `COUNT(*)` queries on active database tables. | N/A | **PASS** — Admin dashboard stats accurately reflect actual DB record counts. Verified by test #12. |
| **6. Parameterized SQL Queries** | `backend/models/*.js` | **PASS** | All queries use MySQL prepared statements with placeholders `?` via `pool.execute(sql, params)`. SQL injection sort column whitelisting is enforced. | N/A | **PASS** — No concatenated user input in SQL queries. Safe against SQL injection. |
| **7. Password Hashing** | `backend/controllers/authController.js`, `adminController.js`, `seed.js` | **PASS** | Uses `bcryptjs` with salt round 10 before saving passwords to DB. | N/A | **PASS** — Passwords in DB are salted bcrypt hashes. Verified by test #1, #2, #3, #5. |
| **8. JWT Authentication** | `backend/middleware/authMiddleware.js`, `utils/generateToken.js` | **PASS** | `verifyToken` checks `Authorization: Bearer <token>` header, decodes payload `{ id, role }`, and handles missing/expired tokens with 401. | N/A | **PASS** — Protected routes reject invalid/missing JWT tokens. Verified by test #6 & #7. |
| **9. Server-Side Role Enforcement** | `backend/middleware/roleMiddleware.js`, `backend/routes/*.js` | **PASS** | `requireRole('ADMIN')`, `requireRole('STORE_OWNER')`, and `requireRole('USER')` middleware strictly enforce permissions on the server. | N/A | **PASS** — Accessing endpoints with unauthorized role returns 403 Forbidden. Verified by test #8. |
| **10. Generic Login Error Messages** | `backend/controllers/authController.js` | **PASS** | Returns `401 Invalid email or password.` for both non-existent user and incorrect password. | N/A | **PASS** — Does not disclose whether email exists in database. Verified by test #4 & #5. |
| **11. Admin Role Functionality** | `backend/controllers/adminController.js`, `frontend/src/pages/admin/*` | **PASS** | Admin dashboard displays stats, allows adding Admin/User/Store Owner accounts, adding stores with owner assignment, listing users/stores with search, role filter, and sorting. | N/A | **PASS** — All Admin CRUD, statistics, search, filter, and sorting operations function correctly. Verified by test #12-#16. |
| **12. User Role Functionality** | `backend/controllers/ratingController.js`, `frontend/src/pages/user/*` | **PASS** | User can signup/login, search stores by name/address, view store info with overall & user rating, submit rating (1-5), and update existing rating. | N/A | **PASS** — Users can browse stores, view ratings, submit ratings, and update their ratings seamlessly. Verified by test #17-#20. |
| **13. Store Owner Isolation** | `backend/controllers/storeController.js`, `frontend/src/pages/owner/*` | **PASS** | `getOwnerDashboard` and `getStoreOwnerRatings` filter strictly by `s.owner_id = req.user.id`. | N/A | **PASS** — Store owner cannot access stats or customer ratings of other stores. Verified by test #22. |
| **14. User Rating Isolation** | `backend/controllers/ratingController.js` | **PASS** | `updateRating` validates `existingRating.user_id === req.user.id`. | N/A | **PASS** — User cannot modify ratings submitted by other users. |
| **15. Public Rating Data Privacy** | `backend/models/ratingModel.js` | **PASS** | Removed `u.email` and `u.address` from `getStoreRatings` public endpoint query. Public store ratings expose only `r.id, r.user_id, r.store_id, r.rating, r.created_at, u.name as user_name`. | Fixed query in `ratingModel.js`. | **PASS** — Verified by test #21 (`Public store ratings API does not leak user emails or addresses`). |
| **16. Field Validation Boundaries** | `backend/validators/*.js`, `frontend/src/utils/validation.js` | **PASS** | Name: 20-60 chars, Address: max 400 chars, Password: 8-16 chars + uppercase + special char, Email: standard regex, Rating: 1-5 integer. | N/A | **PASS** — Inputs outside boundaries are rejected on both frontend and backend. Verified by test #9 & #10. |
| **17. Automated Test Suite** | `backend/package.json`, `backend/tests/api.test.js` | **PASS** | Created end-to-end integration test suite `backend/tests/api.test.js` using Node test runner. Added `"test": "node --test tests/api.test.js"` script to `package.json`. | Added `api.test.js` & npm script. | **PASS** — 22/22 integration tests passing (0 failures). Verified by `npm test`. |
| **18. Mobile UI & Responsiveness** | `frontend/src/components/Sidebar.jsx`, `index.css` | **PASS** | Responsive flex column layout, responsive sidebar container, stats card grid, and input controls for mobile screens <= 768px. | Enhanced `index.css` and `Sidebar.jsx`. | **PASS** — Mobile viewport adapts seamlessly without overflow. |

---

## Final Assessment Deliverables Checklist

- [x] **`AUDIT_REPORT.md`** created and updated with full verification matrix.
- [x] **Privacy Leak Fix** applied in `backend/models/ratingModel.js`.
- [x] **Automated Integration Test Suite** implemented in `backend/tests/api.test.js` (22/22 tests passing).
- [x] **`README.md`** updated with complete setup instructions, API docs with JSON payloads, and demo credentials.
- [x] **Mobile Responsiveness** enhanced in `frontend/src/index.css` & `Sidebar.jsx`.
