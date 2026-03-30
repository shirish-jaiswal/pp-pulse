# PP Pulse

PP Pulse is a modern web application built using Next.js, React, TypeScript, and Tailwind CSS.  
The project uses modern frontend tools including TanStack Query, React Hook Form, Zod, and shadcn/ui to build scalable and maintainable user interfaces.

---

# Installation Guide

Follow the steps below to install and run the project locally.

---

## 1. Prerequisites

Make sure the following tools are installed on your system.

### Install Node.js

Download and install Node.js.

Recommended version:

```
Node.js >= 18
```

Check installation:

```bash
node -v
npm -v
```

---

## 2. Clone the Repository

Clone the project repository to your local machine.

```bash
git clone <repository-url>
```

Navigate into the project folder.

```bash
cd pp_pulse
```

---

## 3. Install Dependencies

Install all required dependencies using npm.

```bash
npm install
```

Alternatively you can use other package managers:

```bash
yarn install
```

or

```bash
pnpm install
```

or

```bash
bun install
```

---

## 4. Run the Development Server

Start the development server.

```bash
npm run dev
```

This will start the application in development mode.

---

## 5. Open the Application

Open your browser and navigate to:

```
http://localhost:3000
```

The application should now be running locally.

---

## 6. Project Structure

Basic project structure:

```
pp_pulse
│
├── app                # Next.js App Router pages
├── components         # Reusable UI components
├── lib                # Utility functions and API logic
├── public             # Static assets
├── styles             # Global styles
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Available Scripts

### Start Development Server

```bash
npm run dev
```

Starts the development server using Next.js.

---

### Build for Production

```bash
npm run build
```

Creates an optimized production build.

---

### Start Production Server

```bash
npm run start
```

Runs the application in production mode.

---

### Run Linter

```bash
npm run lint
```

Runs ESLint to check code quality.

---

## 8. Tech Stack

**Frontend Framework**
- Next.js
- React

**Language**
- TypeScript

**Styling**
- Tailwind CSS
- shadcn/ui
- Radix UI

**Forms and Validation**
- React Hook Form
- Zod

**State Management & Data Fetching**
- TanStack Query

**Utilities**
- Axios
- date-fns

---

## 9. Development Notes

- The project uses the **App Router** architecture of Next.js.
- UI components are built using **shadcn/ui** and **Radix UI**.
- API communication is handled using **Axios**.
- Server state management is handled with **TanStack Query**.

---

## 10. Deployment

The recommended way to deploy this application is using **Vercel**, the platform created by the developers of Next.js.

Steps:

1. Push the repository to GitHub
2. Connect the repository to Vercel
3. Deploy the application

---

## Learn More

To learn more about Next.js, check out the following resources:

- https://nextjs.org/docs
- https://nextjs.org/learn
