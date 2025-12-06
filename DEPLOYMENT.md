# Quick Deployment Guide

## One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Click the button above
2. Connect your GitHub account
3. Configure environment variable: `DATABASE_URL=file:./prod.db`
4. Deploy

**Note**: For production on Vercel, migrate to Vercel Postgres, PlanetScale, or Supabase for persistent data.

## Docker Deployment (Coolify, Railway, etc.)

### Using Docker Compose

```bash
git clone <your-repo>
cd crm-app
docker-compose up -d
```

Access at `http://localhost:3000`

### Using Dockerfile

```bash
# Build
docker build -t crm-app .

# Run with persistent volume
docker run -d -p 3000:3000 \
  -v crm-data:/app/prisma \
  --name crm-app \
  crm-app
```

### Coolify Deployment

1. **Create New Resource**
   - Choose "Docker Compose" or "Dockerfile"
   - Connect your Git repository

2. **Environment Variables**
   ```
   DATABASE_URL=file:/app/prisma/prod.db
   NODE_ENV=production
   ```

3. **Build Settings**
   - Build Pack: Docker
   - Port: 3000

4. **Persistent Storage**
   - Add volume: `/app/prisma` (for SQLite database)

5. **Deploy**
   - Click "Deploy" - Coolify handles the rest

### Railway Deployment

1. **New Project**
   - Click "Deploy from GitHub repo"
   - Select your repository

2. **Settings**
   - Railway auto-detects Next.js
   - Add environment variable: `DATABASE_URL=file:./prod.db`

3. **Deploy**
   - Railway builds and deploys automatically
   - Get your public URL

## Environment Variables

Required for all deployments:

```env
# Database
DATABASE_URL=file:./prod.db

# Authentication (REQUIRED)
AUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.com  # Your production URL
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Important:** Never commit `.env` files with real secrets to Git!

## Database Persistence

For SQLite deployments:
- **Docker/Coolify**: Mount volume at `/app/prisma`
- **Vercel**: NOT recommended (ephemeral filesystem)
- **Railway**: Use persistent disk

## Switching to PostgreSQL/MySQL

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // or "mysql"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` to your database connection string

3. Run:
```bash
npx prisma migrate dev
npx prisma db seed
```

## Health Check Endpoints

- `/api/contacts` - Returns contact list
- `/api/stats` - Returns dashboard stats

Use these for health checks in your deployment platform.

## Troubleshooting

### Database not persisting
- Ensure volume is mounted at `/app/prisma`
- Check write permissions in the container

### Build fails
- Run `npx prisma generate` before build
- Ensure Node.js 18+ is being used

### Port issues
- App runs on port 3000 by default
- Set `PORT` environment variable to change

## Support

For deployment issues, check:
- Platform-specific documentation
- [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying)
- [Prisma deployment docs](https://www.prisma.io/docs/guides/deployment)
