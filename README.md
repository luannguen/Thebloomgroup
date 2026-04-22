# Thebloomgroup Project
 
This repository contains the source code for the Thebloomgroup project, structured as a monorepo.
 
## Project Structure
 
- **`thebloomgroup/`**: The Frontend application (Vite + React + Shadcn UI).
- **`backend/`**: The Backend / Admin Dashboard application (Vite + React + Tailwind + Supabase).
- **`SQL/`**: Database SQL scripts.
 
## Setup & Deployment
 
Each project is independent and has its own `package.json`.
 
### Frontend
```bash
cd thebloomgroup
npm install
npm run dev
```
 
### Backend (Admin)
```bash
cd backend
npm install
npm run dev
```
 
## Vercel Deployment
 
Configure two separate projects in Vercel:
 
1. **Frontend**: Set Root Directory to `thebloomgroup`.
2. **Backend**: Set Root Directory to `backend`.
