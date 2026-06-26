# Vercel Deployment Guide - Fancy Curtains Monorepo

This guide describes how to deploy the **Fancy Curtains** full-stack application (Next.js 16 Frontend + Express Backend) on Vercel properly.

---

## Architecture Overview

The project is structured as a Monorepo:
*   `/backend` - Node.js Express API.
*   `/frontend` - Next.js 16 App Router application.

To deploy both properly on Vercel, they should be set up as **two separate Vercel Projects**. This is the standard, most robust, and flexible pattern for deploying frontend/backend monorepos.

---

## 1. Backend Deployment (Express API)

The backend has been updated to export the Express `app` and use `vercel.json` to route serverless requests.

### Steps to Deploy:
1.  Go to the [Vercel Dashboard](https://vercel.com) and click **Add New** > **Project**.
2.  Import your git repository.
3.  In the project configuration:
    *   **Project Name:** `fancy-curtains-backend`
    *   **Framework Preset:** Select **Other** (or **Node.js** if available).
    *   **Root Directory:** Click **Edit** and select **`backend`**.
4.  Expand **Environment Variables** and add:
    *   `MONGO_URI` (Your MongoDB Atlas connection string)
    *   `JWT_SECRET` (A secure random string for JWT signing)
    *   `NODE_ENV` = `production`
5.  Click **Deploy**.

Vercel will build the backend using `@vercel/node` according to the `backend/vercel.json` configuration, creating a serverless API.

Your backend API will be available at: `https://fancy-curtains-backend.vercel.app` (or your custom domain).

---

## 2. Frontend Deployment (Next.js 16)

The frontend is a standard Next.js 16 application configured with `next-intl` (using `proxy.ts`). It has been optimized by removing duplicate configs.

### Steps to Deploy:
1.  Go to the [Vercel Dashboard](https://vercel.com) and click **Add New** > **Project**.
2.  Import your git repository.
3.  In the project configuration:
    *   **Project Name:** `fancy-curtains-frontend`
    *   **Framework Preset:** **Next.js** (automatically detected).
    *   **Root Directory:** Click **Edit** and select **`frontend`**.
4.  Expand **Environment Variables** and add:
    *   `NEXT_PUBLIC_API_URL` = `https://fancy-curtains-backend.vercel.app/api` (The URL of your deployed backend API with `/api` appended)
    *   `NEXT_PUBLIC_WHATSAPP_NUMBER_1` = `60199218203` (or your custom number)
    *   `NEXT_PUBLIC_WHATSAPP_NUMBER_2` = `60129291483` (or your custom number)
    *   `NEXT_PUBLIC_CONTACT_NAME_1` = `Fazal Subhan`
    *   `NEXT_PUBLIC_CONTACT_NAME_2` = `Nadir Khan`
5.  Click **Deploy**.

Vercel will automatically build the Next.js frontend with SSR and Edge optimizations, resolving routes correctly.

---

## Development & Local Execution

Both apps can still be run locally and will connect seamlessly:
*   **Root Commands:**
    *   `npm run dev:backend` to run the Express API on `http://localhost:5000` (or `5001`).
    *   `npm run dev:frontend` to run the Next.js app on `http://localhost:3000`.
