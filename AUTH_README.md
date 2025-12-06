# Authentication & Role-Based Access Control

## Overview

Your CRM now has a complete multi-user authentication system with role-based permissions.

## User Roles

### 1. **Admin**
- Full system access
- User management (create, edit roles, delete users)
- All CRUD operations on contacts, companies, deals, activities
- Access to User Management page

### 2. **Manager**
- View, create, edit, and delete all data
- Cannot manage users
- Full access to CRM features

### 3. **Sales Rep**
- Create and edit contacts, deals, and activities
- View all data
- Limited edit permissions (own records only)

### 4. **Viewer**
- Read-only access
- Can view all contacts, companies, deals, and activities
- Cannot create, edit, or delete any data

## Getting Started

### First Time Setup

1. **Start the app**:
```bash
cd crm-app
npm run dev
```

2. **Register first admin**:
   - Visit: http://localhost:3000
   - You'll be redirected to `/login`
   - Click "Create one" to go to registration
   - **The first user registered automatically becomes Admin**

3. **Login**:
   - Use your email and password
   - You'll see your role badge in the sidebar

## User Management (Admin Only)

Admins can access User Management from the sidebar:

### Add New Users
1. Click "Invite User" button
2. Assign appropriate role
3. User receives credentials

### Change User Roles
- Use the dropdown in the user table
- Changes take effect immediately
- Cannot change your own role

### Delete Users
- Click the trash icon next to a user
- Cannot delete yourself
- Requires confirmation

## Role Permissions Matrix

| Feature | Admin | Manager | Sales | Viewer |
|---------|-------|---------|-------|--------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| View Contacts | ✅ | ✅ | ✅ | ✅ |
| Create/Edit Contacts | ✅ | ✅ | ✅ | ❌ |
| Delete Contacts | ✅ | ✅ | ❌ | ❌ |
| View Companies | ✅ | ✅ | ✅ | ✅ |
| Create/Edit Companies | ✅ | ✅ | ✅ | ❌ |
| View Deals | ✅ | ✅ | ✅ | ✅ |
| Create/Edit Deals | ✅ | ✅ | ✅ | ❌ |
| View Activities | ✅ | ✅ | ✅ | ✅ |
| Create/Edit Activities | ✅ | ✅ | ✅ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |

## Security Features

### Password Security
- Passwords hashed with bcrypt (10 rounds)
- Minimum 6 characters required
- Stored securely in database

### Session Management
- JWT-based sessions via NextAuth.js
- Automatic session refresh
- Secure cookie storage

### Route Protection
- Middleware guards all protected routes
- API routes check user permissions
- Unauthorized access redirects to login

## API Authentication

All API routes check authentication:

```typescript
// Example: Only admins can access
const session = await auth()
if (!session || session.user.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## Environment Variables

Required in `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secure AUTH_SECRET**:
```bash
openssl rand -base64 32
```

## For Production

### Important Security Steps

1. **Change AUTH_SECRET**:
   - Generate new secret for production
   - Never use the same secret across environments

2. **Use HTTPS**:
   - Set `NEXTAUTH_URL="https://yourdomain.com"`
   - NextAuth requires HTTPS in production

3. **Database**:
   - Consider PostgreSQL for production
   - SQLite works but has limitations

4. **Environment Variables**:
```env
# Production .env
DATABASE_URL="your-production-db-url"
AUTH_SECRET="production-secret-32-chars"
NEXTAUTH_URL="https://yourapp.com"
NODE_ENV="production"
```

## Common Tasks

### Reset a User's Password
Admins can delete and recreate the user account with a new password.

### Lock Out a User
Change their role to "viewer" or delete the account.

### View All Sessions
Check Prisma Studio → Session table

### Promote User to Admin
In User Management, change role dropdown to "Admin"

## Troubleshooting

### "Unauthorized" on Login
- Check email/password
- Verify user exists in database
- Check AUTH_SECRET is set

### Redirect Loop
- Clear browser cookies
- Verify NEXTAUTH_URL matches your domain
- Check middleware configuration

### Can't Access User Management
- Only admins can access `/users`
- Check your role in sidebar
- First registered user is auto-admin

## Database Schema

### User Table
```prisma
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password      String
  role          String    @default("viewer")
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## Testing

### Test Accounts
Create test users for each role:

1. Admin: admin@test.com
2. Manager: manager@test.com
3. Sales: sales@test.com
4. Viewer: viewer@test.com

All with password: `test123`

## Support

- NextAuth Docs: https://next-auth.js.org
- Prisma Auth: https://www.prisma.io/docs/guides/auth
- Security Best Practices: https://cheatsheetseries.owasp.org/

---

**Ready to use!** Visit http://localhost:3000 and create your admin account.
