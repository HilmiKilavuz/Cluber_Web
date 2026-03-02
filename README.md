# Cluber Web 🚀

Cluber is a modern platform designed to bring people together through clubs, real-time communication, and event organization. This repository contains the **Frontend** application for the Cluber ecosystem.

## ✨ Features

- **Club Management:** Browse, create, and join clubs tailored to your interests.
- **Real-Time Chat:** Seamless communication with club members using WebSockets.
- **Event Coordination:** Organize and RSVP to events directly within your clubs.
- **Responsive Design:** A premium, dark-mode-first UI built with modern web technologies.

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Real-Time:** [Socket.io-client](https://socket.io/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cluber-web.git
   cd cluber-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001).

## 📁 Project Structure

- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks for logic and data fetching.
- `src/services`: API service layers for backend communication.
- `src/store`: Zustand state management stores.
- `src/types`: TypeScript definitions and schemas.
- `src/app`: Next.js App Router pages and layouts.

---

Built with ❤️ for the Cluber Community.
