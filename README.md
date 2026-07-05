# ServiceHub

ServiceHub is a full-stack service marketplace starter for home services, accommodation, food, vehicle rentals, travel, and personal services.

## Run locally

```bash
npm install
npm run dev
```

Backend API:

```bash
cp .env.example .env
npm run seed
npm run server
```

The React app reads services from the Express API at `VITE_API_URL`, and the API stores users, providers, services, bookings, reviews, and favorites in MongoDB using Mongoose.

## Stack

- React, React Router, Axios, CSS
- Node.js, Express
- MongoDB, Mongoose
- JWT and bcrypt authentication
