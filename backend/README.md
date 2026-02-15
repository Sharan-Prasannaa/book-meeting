# Backend - Laravel API

REST API for the BookEase booking system.

## Requirements

- PHP 8.1 or higher
- Composer
- MySQL or SQLite

## Setup

### 1. Install Dependencies

```bash
composer install
```

### 2. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` file with your database settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=book_meeting_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

For email verification used sandbox mail, set up mail settings:

```env
MAIL_MAILER=smtp
MAIL_SCHEME=null
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525

```

### 3. Set Up Database

Create the database first:

```sql
CREATE DATABASE book_meeting;
```

Then run migrations:

```bash
php artisan migrate
```

### 4. Install Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 5. Start Server

```bash
php artisan serve
```

API available at: http://localhost:8000

## Database Structure

### users
Stores host and guest information.
- id, name, user_slug, email, password
- role (admin/host/guest)
- email_verified_at, verification_token
- timezone, buffer_minutes

### event_types
Meeting types created by hosts.
- id, user_id (FK to users)
- title, slug, description, duration
- is_active

### availabilities
Host's recurring schedule and blocked dates.
- id, user_id (FK to users)
- day_of_week, start_time, end_time
- blocked_date, is_blocked

### bookings
Confirmed appointments.
- id, user_id (FK to users), event_type_id (FK to event_types)
- guest_name, guest_email, guest_phone
- start_datetime, end_datetime, status
- message

## API Endpoints

Base URL: http://localhost:8000/api

### Authentication - For testing used Postman Api tool

**Register**
- POST /auth/signup

**Login**
- POST /auth/login

**Verify Email**
- GET /auth/verify-email/{token}

**Logout**
- POST /auth/logout


### Event Types (Authenticated)

**Get All Events**
- GET /event-types

**Create Event**
- POST /event-types

**Update Event**
- PUT /event-types/{id}

**Delete Event**
- DELETE /event-types/{id}


### Availability (Authenticated)

**Get Availability**
- GET /availabilities


**Add Availability**
- POST /availabilities

**Block Date**
- POST /availabilities/block-date

**Delete Availability**
- DELETE /availabilities/{id}

### Bookings (Authenticated)

**Get Bookings**
- GET /bookings

**Cancel Booking**
- DELETE /bookings/{id}


### Public Endpoints (No Auth)

**Get Host's Events**
- GET /{username}/event-types


**Get Event Details**
- GET /{username}/{event-slug}

**Get Available Slots**
- GET /{username}/{event-slug}/available-slots?date=2024-12-20

**Create Booking**
- POST /{username}/{event-slug}/book

## How Authentication Works

Using Laravel Sanctum for token-based authentication:

1. User logs in with email/password
2. Backend validates credentials
3. Backend creates token and returns it
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for protected routes
6. Backend validates token on each request

## Important Files

- `routes/api.php` - API route definitions
- `app/Http/Controllers/Api/` - Controller logic
- `app/Models/` - Database models
- `app/Http/Middleware/EmailVerifyMiddleware.php` - Middleware to verify email
- `database/migrations/` - Database schema

## Common Issues

### "Key too long" error on migration
Already fixed in AppServiceProvider with:
```php
Schema::defaultStringLength(191);
```

### CORS errors
Check `config/cors.php` and add frontend URL to allowed_origins:
```php
'allowed_origins' => ['http://localhost:5173'],
```

### Email not sending
For development, used Mailtrap. Sign up at mailtrap.io and use their SMTP settings in .env.

## Deployment Notes

Before deploying to production:

1. Set `APP_ENV=production` and `APP_DEBUG=false`
2. Set up proper database
3. Configure real mail service (not Mailtrap)
4. Set FRONTEND_URL to actual domain
5. Run: `php artisan config:cache`
6. Run: `php artisan route:cache`

## Learning Notes

Things I learned while building this:

- How Laravel handles authentication with Sanctum
- Database migrations errors like default string length
- API route structure and middleware
- Email verification flow
- CORS configuration for API

## TODO
- Implement booking reminders with queue jobs
- Add rate limiting to prevent abuse
- Better error handling and logging
- Implement booking status auto-update with scheduler

---

Built with Laravel 12.51.0