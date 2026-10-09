# Loc'd In — Frontend

The React frontend for **Loc'd In**, a booking app for a loc and natural hair salon. Clients can browse services, create an account, and book, edit, and cancel their own appointments.

- **Live site:** https://locd-in-frontend.onrender.com/
- **Live API:** https://locd-in-backend.onrender.com
- **Backend repo:** https://github.com/damielrice-rgb/locd-in-backend

## Tech Stack

| Tool | Purpose |
| --- | --- |
| React | User interface |
| TypeScript | Type checking |
| Vite | Development server and build tool |
| React Router | Page routing |
| Tailwind CSS | Styling |
| Context API | Global login state |

## Features

- Browse active salon services on the Home page
- Register and log in, with redirects to the right page afterward
- Book an appointment by choosing a service, date, time, and notes
- View, edit, and cancel your own appointments
- Protected pages that send logged-out users to Login
- Navbar that changes based on whether you're logged in
- Loading, error, empty, and success messages
- Responsive layout built with Tailwind CSS

## Pages and Routes

| Route | Page | Access |
| --- | --- | --- |
| `/` | Home: list of services with Book Appointment buttons | Public |
| `/register` | Create an account | Public |
| `/login` | Log in | Public |
| `/dashboard` | User dashboard with logout | Logged in |
| `/appointments` | Book an appointment and manage your appointments | Logged in |

## Project Structure

```
locd-in-frontend/
├── src/
│   ├── api/
│   │   └── server.ts            # All fetch calls to the backend
│   ├── context/
│   │   └── AuthContext.tsx      # Stores the JWT and login/logout functions
│   ├── hooks/
│   │   └── useAppointments.ts   # Loads appointments with loading and error state
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Appointments.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── types/
│   │   └── service.ts           # Service type
│   ├── App.tsx                  # Routes
│   └── main.tsx                 # Wraps the app in AuthProvider
└── package.json
```

## How It Works

**Authentication.** When a user logs in, the backend returns a JWT. `AuthContext` saves it in `localStorage` and shares it with the whole app through the `useAuth()` hook, so users stay logged in after refreshing. Logging out removes the token.

**Protected routes.** `ProtectedRoute` checks for a token. If there isn't one, it redirects to `/login`.

**API calls.** Every request lives in `src/api/server.ts`. Protected requests send the token in the header:

```
Authorization: Bearer <token>
```

**Custom hook.** `useAppointments` fetches the user's appointments and returns `appointments`, `loading`, and `error`, keeping fetch logic out of the page component.

**State.** Global login state lives in Context. Each form uses `useState` for its own inputs. After booking, editing, or cancelling, the appointment list updates right away without reloading the page.

## Running Locally

The backend must be running first. See the [backend README](https://github.com/damielrice-rgb/locd-in-backend) for its setup.

**1. Clone the repo and install packages**

```bash
git clone https://github.com/damielrice-rgb/locd-in-frontend.git
cd locd-in-frontend
npm install
```

**2. Create a `.env` file** in the root folder:

```
VITE_API_URL=http://localhost:1444/api
```

**3. Start the app**

```bash
npm run dev
```

Open http://localhost:5173.

**Build for production**

```bash
npm run build
```

## Deployment

Deployed on Render as a Static Site.

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_URL=https://locd-in-backend.onrender.com/api`
- Rewrite rule: `/*` → `/index.html` so refreshing any page works

## Future Improvements

- Separate My Appointments page
- Reusable components such as `AppointmentCard` and `ServiceCard`
- Favorites page using the existing favorites API
- Loading state on the Home page

## Author

Damiel Rice — Per Scholas Full-Stack MERN Capstone
