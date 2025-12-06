# Demo Accounts

Your CRM has been seeded with 4 demo accounts to test all role levels.

## Login Credentials

All demo accounts use the password: **`demo123`**

### 1. Admin Account
- **Email**: `admin@demo.com`
- **Password**: `demo123`
- **Access**: Full system access including user management

### 2. Manager Account
- **Email**: `manager@demo.com`
- **Password**: `demo123`
- **Access**: Can view, create, edit, and delete all CRM data (no user management)

### 3. Sales Rep Account
- **Email**: `sales@demo.com`
- **Password**: `demo123`
- **Access**: Can create and edit contacts, deals, activities

### 4. Viewer Account
- **Email**: `viewer@demo.com`
- **Password**: `demo123`
- **Access**: Read-only access to all data

## Quick Start

1. **Visit**: http://localhost:3000
2. **Login** with any demo account above
3. **Test permissions** by trying to create/edit data with different roles

## Reset Demo Data

To reset all demo accounts and data:

```bash
npm run seed
```

This will:
- Delete all existing users and data
- Recreate the 4 demo accounts
- Add fresh sample companies, contacts, and deals

## Current Data Sharing

**Note**: Currently, all users can see ALL data regardless of role.

### What This Means:
- ✅ **Logout**: Yes, logout button in sidebar
- ✅ **Role permissions**: Yes, different roles have different edit/delete permissions
- ❌ **Data isolation**: No, everyone sees the same data

### For Multi-Tenant (Each User Sees Their Own Data):
If you want each user to ONLY see their own data, you'll need data isolation where records are tied to users. Let me know if you want this!

## Production Use

**Before deploying to production:**

1. Delete demo accounts or change their passwords
2. Create real user accounts with secure passwords
3. Consider adding email verification
4. Enable 2FA (optional but recommended)

---

**Currently Running**: http://localhost:3000

**Prisma Studio** (view database): http://localhost:5555
