

# SecureSight - Smart Security Monitoring System

A modern web application for intelligent security monitoring with real-time incident detection, camera management, and interactive timeline visualization.

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* PostgreSQL database

### Installation

```
# Clone and install
git clone <repository-url>
cd secure-sight
npm install

# Setup environment
cp .env
# Add your DATABASE_URL

# Database setup
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development
npm run dev
```

Visit `http://localhost:3000`

## 📦 Deployment

### Vercel (Recommended)

```
# Ensure package.json includes postinstall in scripts
"scripts": {
    "postinstall": "prisma generate"
  },

# Environment variables in Vercel dashboard:
DATABASE_URL=your_postgresql_url
```


## 🛠 Tech Decisions

**Frontend**

* **Next.js 15** - App Router for modern React patterns
* **TypeScript** - Type safety and better DX
* **Tailwind CSS** - Utility-first styling
* **SVG Timeline** - Better performance than Canvas
* **React Three Fiber** - 3D model visualization

**Backend**

* **Prisma + PostgreSQL** - Type-safe database operations
* **Next.js API Routes** - Serverless functions
* **UTC timestamps** - Consistent timezone handling

**Key Choices**

* SVG over Canvas for timeline (better accessibility)
* Prisma over raw SQL (type safety)
* Component-based architecture (maintainability)

## 🔮 If I Had More Time...


---
**Built with Next.js, TypeScript, and Prisma**
---
