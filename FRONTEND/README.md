# Automated Complaint Escalation Frontend

Professional React frontend for the MERN banking complaint management backend.

## Tech Stack

- React.js with Vite
- React Router DOM
- Axios
- Context API
- Tailwind CSS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and update the API URL if needed:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start the frontend:

```bash
npm run dev
```

## Main Screens

- Login
- Register
- User complaint dashboard
- Create complaint
- Admin analytics dashboard
- Admin complaint management
- Complaint details modal with status timeline

## Notes

The backend must be running and must allow CORS. The current backend has `app.use(cors())` enabled for local frontend development.
