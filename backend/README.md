# Backend (Laravel)

API for the Book Meeting scheduler. Handles auth, availability, slots, and bookings.

---

## Install & run

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

- Default: `http://localhost:8000`
- **Database:** set `DB_*` in `.env` (MySQL recommended; SQLite fine for local).
- **MySQL:** `AppServiceProvider` uses `Schema::defaultStringLength(191)` so migrations don’t hit InnoDB “key too long” with utf8mb4.

---

## Data model (summary)

- **users** – host/admin and guest accounts; roles, email verification, timezone, buffer.
- **availabilities** – recurring weekly slots per host (day, start/end time); optional `blocked_date`.
- **bookings** – confirmed booking (guest info, date, time, status).
- **booking_slots** – generated slots per host/date; `is_booked` and `booking_id` link to a booking.

Double-booking is prevented in **backend validation** (transaction + check `is_booked`), not by a DB unique constraint.

---

## (Optional / enhancements)

- DB unique on `booking_slots (user_id, date, start_time)`.
- Queue + mail for verification and booking confirmation.

See project root [README.md](../README.md) for full data model and flow.
