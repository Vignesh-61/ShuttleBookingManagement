# ShuttleGo Walkthrough

## How to Run
1. Open a terminal in this directory.
2. Run `npm start`.
3. Open `http://localhost:3000` in your browser.

## Features verified
- **Role Switching**: The Login page allows you to sign in as a Passenger, Vehicle Owner, or Admin. This simulates the authentication flow.
- **Dashboards**: 
    - **Passenger**: View recent mock bookings and saved routes.
    - **Owner**: View active vehicle stats and bookings.
    - **Admin**: View system-wide user and route statistics.
- **Navigation**: The Sidebar dynamically changes items based on your current role.
- **Passenger**: "Find Shuttle" page features a mock table of available shuttles with a search bar.
- **Security**: Protected routes ensure you cannot access Admin pages as a Passenger (you will be redirected).

## Technical Implementation
- **React Context**: Used for global Auth state management.
- **React Router**: customized with a `ProtectedRoute` wrapper for security.
- **CSS**: Custom utility classes used in `index.css` to replicate a clean, "Tailwind-like" design system without the build overhead.
