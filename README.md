# 🚀 CRM Pro - Open Source Customer Relationship Management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A modern, elegant, **fully functional** CRM application built with Next.js, TypeScript, and Prisma. Perfect for small businesses, startups, or as a foundation for your custom CRM solution.

![CRM Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=CRM+Dashboard+Screenshot)

## ✨ Features

### 🎯 Core Functionality
- **Multi-User Authentication** - Secure login/register with role-based access control (Admin, Manager, Sales, Viewer)
- **Dashboard Analytics** - Real-time insights with interactive charts showing pipeline value, deal stages, and key metrics
- **Contact Management** - Full CRUD operations with search, edit, and delete capabilities
- **Company Profiles** - Manage business accounts with detailed information and associations
- **Deal Pipeline** - Visual kanban-style pipeline with **drag-and-drop** between stages + list view
- **Activity Tracking** - Schedule and track calls, meetings, emails, and tasks with completion status
- **Responsive Design** - Beautiful, professional UI that works on all devices
- **Real-time Updates** - Optimistic UI updates with server synchronization

### 🔐 Authentication & Security
- NextAuth.js v5 integration
- Role-based permissions (Admin, Manager, Sales Rep, Viewer)
- Secure password hashing with bcrypt
- Session management with JWT
- Protected API routes and pages

### 💾 Database
- **SQLite** - Zero-config database perfect for getting started
- **Easy migration** to PostgreSQL/MySQL for production
- Prisma ORM for type-safe database access
- Automated migrations and seeding

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM + SQLite (easily migrate to PostgreSQL/MySQL)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd crm-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Generate a secure AUTH_SECRET
openssl rand -base64 32

# Edit .env and add:
# DATABASE_URL="file:./prisma/dev.db"
# AUTH_SECRET="<your-generated-secret>"
# NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed with demo data (optional but recommended)
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

7. **Create your first admin account:**
   - Visit `/register` to create the first user account
   - The first registered user automatically becomes an admin
   - Demo accounts are also available (see [DEMO_ACCOUNTS.md](DEMO_ACCOUNTS.md))

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project to Vercel:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add: `DATABASE_URL=file:./prod.db`

4. Deploy:
   - Click "Deploy"
   - Vercel will build and deploy your app automatically

**Important for Vercel**: The SQLite database is ephemeral on Vercel. For production, consider using:
- Vercel Postgres
- PlanetScale (MySQL)
- Supabase (PostgreSQL)

To switch to a different database, update the `datasource` in `prisma/schema.prisma` and update your `DATABASE_URL`.

### Deploy with Docker

1. Build the Docker image:
```bash
docker build -t crm-app .
```

2. Run the container:
```bash
docker run -p 3000:3000 -v crm-data:/app/prisma crm-app
```

Or use Docker Compose:
```bash
docker-compose up -d
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Deploy to Coolify

1. Push your code to a Git repository

2. In Coolify:
   - Create a new application
   - Select your Git repository
   - Set build pack to "Docker" or "Nixpacks"
   - Add environment variable: `DATABASE_URL=file:/app/prisma/prod.db`

3. Configure build settings:
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npx prisma db seed && npm start`

4. Deploy:
   - Coolify will build and deploy your application
   - A persistent volume will be created for the SQLite database

### Deploy to Railway

1. Push your code to a Git repository

2. In Railway:
   - Create a new project
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. Railway will auto-detect Next.js and deploy

4. Add environment variable in Railway dashboard:
   - `DATABASE_URL=file:./prod.db`

## Database Management

### View Database

```bash
npx prisma studio
```

This opens a visual database editor at [http://localhost:5555](http://localhost:5555)

### Reset Database

```bash
npx prisma migrate reset
npm run seed
```

### Create New Migration

```bash
npx prisma migrate dev --name description_of_changes
```

## Project Structure

```
crm-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── contacts/          # Contacts page
│   ├── companies/         # Companies page
│   ├── deals/            # Deals pipeline page
│   ├── activities/       # Activities page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── Sidebar.tsx      # Navigation sidebar
│   └── StatCard.tsx     # Dashboard stat cards
├── lib/                 # Utility functions
│   └── prisma.ts        # Prisma client
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed data script
│   └── migrations/      # Migration history
├── public/              # Static assets
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── package.json         # Dependencies
```

## Features Overview

### Dashboard
- Total contacts, companies, active deals, and revenue metrics
- Pipeline value by stage (bar chart)
- Deal distribution by stage (pie chart)
- Upcoming activities timeline
- Quick stats cards with win rate

### Contacts
- Searchable contact list
- Contact details with company association
- Status tracking (active, lead, inactive)
- Email and phone information

### Companies
- Company profiles with industry info
- Employee count and revenue tracking
- Associated contacts and deals
- Website and contact information

### Deals
- Pipeline view (kanban-style board)
- List view (table format)
- Deal stages: Lead → Qualified → Proposal → Negotiation → Won/Lost
- Deal value and probability tracking
- Expected close dates

### Activities
- Multiple activity types: calls, emails, meetings, tasks, notes
- Filter by all, upcoming, or completed
- Overdue tracking
- Associated contacts and deals

## Example Data

The app comes with pre-populated example data including:
- 5 companies across different industries
- 8 contacts with realistic profiles
- 8 deals in various pipeline stages
- Multiple activities and tasks

Run `npm run seed` to populate the database with this data.

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

For production deployments, update the path as needed.

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code of Conduct
- Development workflow
- How to submit pull requests
- Reporting bugs
- Suggesting enhancements

### Quick Contribution Steps
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel, Docker, Coolify, etc.
- [Authentication Guide](AUTH_README.md) - NextAuth.js setup and configuration
- [Demo Accounts](DEMO_ACCOUNTS.md) - Test user credentials
- [Status & Roadmap](STATUS.md) - Current features and upcoming plans

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? We'd love to hear from you!

- **Bug Reports**: [Open an issue](../../issues/new?template=bug_report.md)
- **Feature Requests**: [Open an issue](../../issues/new?template=feature_request.md)
- **Questions**: [Start a discussion](../../discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**TL;DR**: Free to use for personal and commercial purposes. Attribution appreciated but not required!

## 🌟 Show Your Support

If this project helped you, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔀 Contributing code
- 📢 Sharing with others

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - Composable charting library

---

**Made with ❤️ by the community | [Star this repo](../../stargazers) if you find it useful!**
