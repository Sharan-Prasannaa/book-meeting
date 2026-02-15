# BookEase - Meeting Scheduling Application

A web-based appointment scheduling system similar to Calendly. Built as a learning project to understand full-stack development with Laravel and React.

## What This Project Does

BookEase allows hosts to create meeting types and set their availability. Guests can then visit the host's booking page and schedule meetings based on available time slots.

**Example:** If John creates a "30 Minute Meeting" event type and sets his availability as Monday-Friday 9am-5pm, guests can visit `yoursite.com/john/30-minute-meeting` and book a time slot.

## Technologies Used

**Backend:**
- Laravel 12.51.0 (PHP framework)
- MySQL database
- Laravel Sanctum for API authentication

**Frontend:**
- React ^19.2.0
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

## Features

**For Hosts:**
- Create event types with custom durations
- Set weekly availability schedule
- Block specific dates
- View all bookings
- Get shareable booking links

**For Guests:**
- Browse available meeting types
- Pick a date and time
- Fill in contact details
- Get booking confirmation
```

## Installation

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Set up your database in .env file
# DB_DATABASE=book_meeting_db
# DB_USERNAME=root
# DB_PASSWORD=

Add proper URL's keys
#VITE_API_URL=
#FRONTEND_URL=

php artisan migrate
php artisan serve
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env (Modify url as needed)

npm run dev
```

## Database Tables

- **users** - Host and guest accounts
- **event_types** - Meeting types created by hosts
- **availabilities** - Host's weekly schedule and blocked dates
- **bookings** - Confirmed appointments

## How It Works

### For Hosts:
1. Sign up and verify email
2. Create event types (e.g., "30 Min Call")
3. Set availability (e.g., Mon-Fri 9am-5pm)
4. Share booking link with guests

### For Guests:
1. Visit host's booking link
2. Choose an event type
3. Select date and time
4. Enter contact details
5. Booking confirmed

## Main Challenges I Faced
### 1. Generating Available Time Slots
**Problem:** Had to calculate which time slots are available based on the host's schedule and existing bookings.

**Solution:** Made a function that:
- Gets host's availability for the day
- Breaks it into slots based on meeting duration
- Removes already booked slots
- Returns available times


### 2. Making Clean URLs Like Calendly
**Problem:** Initially used `/book/123` but wanted `/john/30-minute-meeting.

**Solution:** Added a `slug` field to event types and `user_slug` to users. Changed routes to use these slugs instead of IDs. Had to refactor both frontend routes and backend API endpoints.

### 3. Authentication Between Frontend and Backend
**Problem:** React frontend and Laravel backend are separate applications. How to keep users logged in?

**Solution:** Used Laravel Sanctum. On login, backend gives a token. Frontend stores it in localStorage and includes it in every API request header. Took time to understand token-based authentication vs session-based.

### 4. Managing State Across Components
**Problem:** User data needed in many components (Dashboard, Events, etc.). Was passing props everywhere.

**Solution:** Used React Context API to store user data globally. Created AuthContext that any component can access. Still learning when to use Context vs when to keep state local.

### 5. Form Validation
**Problem:** Needed to validate forms on both frontend and backend. Got confused about where to put validation logic.

**Solution:** Added validation in both places:
- Frontend: Check required fields before submitting
- Backend: Laravel validation rules for security

### 6. Understanding API Design
**Problem:** First time building a proper REST API.

**Learning:** Read about REST principles. Learned:
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return consistent JSON structure
- Use correct status codes (200, 201, 404, 422, etc.)
- Separate public and authenticated routes

## What I Learned
- Token-based API authentication with Sanctum
- Building a React SPA with routing
- Making API calls with Axios
- Basic state management with Context API
- Database transactions for data integrity
- Email sending in Laravel
- Environment variables and configuration

## Known Issues / TODO

- Time zone conversion not fully implemented
- No email notifications for bookings yet
- Can't edit bookings once created
- No way for guests to cancel bookings
- Calendar integration would be nice
- Should add loading spinners
- Need better error messages
- Mobile design could be improved

## Future Improvements

**Short Term:**
- Add email notifications when bookings are created
- Let users cancel/reschedule bookings
- Better error handling and validation messages
- Add loading states to forms

**Long Term:**
- Google Calendar integration
- Allow buffer time between meetings
- Support recurring availability exceptions
- Add booking reminders
- Build analytics dashboard
- Team scheduling feature

## Acknowledgments