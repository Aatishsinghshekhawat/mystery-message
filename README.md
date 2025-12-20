**Mystery Message** is a modern, full-stack web application that allows users to receive anonymous feedback and messages through a unique public profile link. Integrated with AI, it offers smart message suggestions to help users kickstart conversations.

---

## 🌟 Key Features

- **Anonymous Messaging**: Users can send messages to public profiles without revealing their identity.
- **AI-Powered Suggestions**: Integrated with **Google Gemini AI** to provide creative message prompts.
- **Secure Authentication**: Robust user authentication system powered by **NextAuth.js**.
- **User Dashboard**: A personal space for users to manage messages, toggle their "Accept Messages" status, and copy their unique profile link.
- **Responsive UI/UX**: Built with **Tailwind CSS v4** and **Shadcn UI** for a seamless experience across all devices.
- **Real-time Feedback**: Interactive elements with **Sonner** toasts and **Lucide** icons.
- **Email Integration**: Verification emails sent via **Resend** and styled with **React Email**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Components**: Framer Motion / Embla Carousel (for animations and sliders)
- **Forms**: React Hook Form, Zod (Validation)

### Backend
- **Platform**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Auth**: NextAuth.js (Credentials Provider)
- **AI**: Google Generative AI (Gemini SDK)
- **Email**: Resend API

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- MongoDB Atlas account (for database)
- Gemini API Key
- Resend API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mystery-message.git
   cd mystery-message/my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the magic!

---

## 📂 Project Structure

```text
src/
├── app/              # Next.js App Router (Layouts, Pages, API)
├── components/       # Reusable UI components (Shadcn + Custom)
├── context/          # React Context providers
├── lib/              # Utility functions and DB connection
├── model/            # Mongoose schemas and types
├── schemas/          # Zod validation schemas
├── types/            # TypeScript interfaces
└── helpers/          # Helper functions (e.g., mailer)
```

---

## 🧠 Why I Built This

This project was built to demonstrate proficiency in building **Production-Grade Next.js applications**. It showcases:
- Implementation of **Complex Authentication Flows**.
- Integration of **Large Language Models (LLMs)** into user-facing features.
- Handling **Edge Cases in Hydration** and Server-Client synchronization.
- Writing **Extensible and Type-Safe Code** with TypeScript and Zod.

---
