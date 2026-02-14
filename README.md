# Book Meeting

A mini appointment-scheduling app inspired by Calendly. **PHP (Laravel)** backend and **React** frontend.

---

## What’s done so far (Step 1)

- **Data model designed** and migrations created.
- **Migration order fixed** so `bookings` is created before `booking_slots` (FK dependency).
- **Double-booking** enforced in **backend validation logic** (no DB unique constraint).
- **Auth backend in place**: Laravel Sanctum installed; signup, login, and email-verification endpoints implemented.
- **(Optional)** DB-level unique on `(user_id, date, start_time)` can be added later for extra safety.

---

## How to install & run

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

- **Database:** MySQL (or SQLite for local dev; set in `.env`). Create the DB first (e.g. `book_meeting_db`) in phpMyAdmin or MySQL.
- **MySQL:** `AppServiceProvider` sets `Schema::defaultStringLength(191)` so indexed string columns stay under InnoDB’s index key length limit with utf8mb4 (avoids “key too long” on migrate).
- More detail: [backend/README.md](backend/README.md).

### Frontend (React)

Planned **React SPA** in `frontend/` that will:

- Implement the **admin auth flow** (signup → email verify prompt → login) against the existing Laravel API.
- Later, add **admin dashboard** (availability/event types, bookings) and **public booking UI** (date picker, slots, booking form).

---

## Data model (current)

Plain description of tables and relationships.

### Tables

| Table             | Purpose |
|-------------------|--------|
| **users**         | Admins/hosts (set availability) and guests (book). Roles: `admin`, `host`, `guest`. Includes `email_verified`, `verification_token`, `timezone`, `buffer_minutes`. |
| **password_resets** | Standard Laravel password reset tokens. |
| **availabilities** | Recurring weekly schedule per host: `user_id`, `day_of_week`, `start_time`, `end_time`. Optional: `blocked_date` for date-specific blocks. |
| **bookings**       | A confirmed booking: host `user_id`, guest name/email/phone/message, `date`, `start_time`, `end_time`, `status` (Pending/Completed/Cancelled). |
| **booking_slots**  | Time slots (per host, per date). `user_id`, `availability_id` (nullable), `booking_id` (nullable when free). `date`, `start_time`, `end_time`, `is_booked`. Slots are generated from availabilities; when a guest books, one slot is linked to one booking. |

### Relationships

- **users** → availabilities (one-to-many).
- **users** → booking_slots (one-to-many).
- **users** → bookings (one-to-many, as host).
- **availabilities** → booking_slots (one-to-many, optional).
- **bookings** ← booking_slots (one-to-one: `booking_slots.booking_id` → `bookings.id`).

### Double-booking protection

- Handled in **backend code**: when creating a booking, check that the chosen slot exists, is for the right host/date/time, and `is_booked` is false; then update the slot and create the booking inside a **DB transaction**. Return 409 if the slot is already taken.
- **(Enhancement)** Add a unique constraint on `booking_slots (user_id, date, start_time)` for extra safety at DB level.

---

## Optional / enhancements (later)

- **DB unique constraint** on `booking_slots (user_id, date, start_time)`.
- **Separate “availability_blocks”** table for date-specific overrides.
- **Email verification** flow (signup → verify → login).
- **Admin UI**: manage availability, view/cancel bookings, buffer time, timezone.
- **Email notification** on successful booking.
- **Mobile-friendly** layout and polish.

---

## Repo structure

```
book-meeting/
├── backend/     # Laravel API
├── frontend/     # React app (to be added)
└── README.md     # This file
```

---

## AI / tools used

- **Mermaid** – Used for flow diagrams (admin and user backend sequences, admin/user UI flowcharts). Keeps flows in text, versionable in the repo, and easy to update.
- **dbdiagram** – Used for database schema design and relationship sketching before writing migrations. Helps reason about tables and constraints visually.

---

*Step 1 (data model & README) done; next is the application (API then frontend).*
