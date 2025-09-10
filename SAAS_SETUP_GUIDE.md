# Multi-Tenant SaaS Setup Guide

## Overview
This guide sets up a complete multi-tenant SaaS system for watch businesses using Supabase. Each company gets one shared login account, and the system owner has a master account that can access everything.

## 🚀 Quick Setup

### Step 1: Create Database Schema
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/hscxnaplrewvqjdhjlsj)
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-saas-schema.sql`
4. Click **Run** to create all tables, policies, and sample data

### Step 2: Set Up File Storage
1. In the same SQL Editor
2. Copy and paste the contents of `supabase-storage-setup.sql`
3. Click **Run** to create storage buckets and policies

### Step 3: Create Users
1. In the same SQL Editor
2. Copy and paste the contents of `supabase-user-management.sql`
3. Click **Run** to create example users

## 📊 Database Schema

### Core Tables
- **companies** - Company information and subscription details
- **customers** - Customer data (scoped to company)
- **watches** - Watch inventory (scoped to company)
- **orders** - Sales and purchase orders (scoped to company)
- **transactions** - Financial transaction tracking (scoped to company)

### Key Features
- **Multi-tenant**: All business tables include `company_id`
- **RLS Security**: Row-level security based on user role and company
- **Real-time**: Live updates for watches and orders
- **File Storage**: Secure image and PDF storage per company

## 🔐 Authentication & Authorization

### User Roles
- **master**: System owner - can access all companies and data
- **user**: Company staff - can only access their company's data

### User Metadata
```json
{
  "role": "master" | "user",
  "company_id": "uuid" | null,
  "name": "User Display Name"
}
```

### RLS Policies
- **Master users**: Full access to all data
- **Company users**: Restricted to `company_id = auth.jwt()->>'company_id'`

## 📁 File Storage

### Buckets
- **watches**: Watch images (5MB limit, images only)
- **invoices**: PDF receipts (10MB limit, PDFs only)

### File Organization
```
watches/
  {company_id}/
    {watch_id}/
      image.jpg

invoices/
  {company_id}/
    {order_id}/
      invoice.pdf
```

### Security
- Files are private by default
- Users can only access files from their company
- Master users can access all files

## 🔄 Real-time Features

### Enabled Tables
- `watches` - Live watch inventory updates
- `orders` - Live order status changes
- `customers` - Live customer data updates
- `transactions` - Live financial updates

### Frontend Integration
```javascript
// Subscribe to watch updates
const { data, error } = await supabase
  .channel('watches')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'watches' }, 
    (payload) => {
      // Update UI with new data
      console.log('Watch updated:', payload)
    }
  )
  .subscribe()
```

## 👥 User Management

### Create Company User
```sql
SELECT create_company_user(
  'staff@company.com',
  'secure_password',
  'company-uuid-here',
  'Staff Name'
);
```

### Update User Company
```sql
SELECT update_user_company(
  'user-uuid-here',
  'new-company-uuid-here'
);
```

## 📈 Example Queries

### Master User Queries
```sql
-- See all companies and their stats
SELECT 
  c.name,
  c.subscription_plan,
  COUNT(DISTINCT cu.id) as customer_count,
  COUNT(DISTINCT w.id) as watch_count
FROM companies c
LEFT JOIN customers cu ON cu.company_id = c.id
LEFT JOIN watches w ON w.company_id = c.id
GROUP BY c.id, c.name, c.subscription_plan;
```

### Company User Queries
```sql
-- See only their company's data (automatically filtered by RLS)
SELECT 
  w.brand,
  w.model,
  w.status,
  w.retail_price
FROM watches w
ORDER BY w.created_at DESC;
```

## 🛡️ Security Features

### Row Level Security
- All tables have RLS enabled
- Policies automatically filter data based on user role
- Master users bypass all restrictions
- Company users only see their company's data

### File Storage Security
- Files organized by company ID
- RLS policies prevent cross-company access
- Automatic cleanup when companies are deleted

### Data Isolation
- Complete data separation between companies
- No risk of data leakage between tenants
- Automatic cleanup on company deletion

## 🚀 Next Steps

1. **Run the SQL scripts** in order
2. **Test the authentication** with the example users
3. **Update your frontend** to use the new multi-tenant structure
4. **Implement real-time subscriptions** for live updates
5. **Add file upload functionality** for watch images and invoices

## 🔧 Frontend Integration

### Update Your App Store
Replace your current store with the multi-tenant version:

```typescript
// Use company-scoped queries
const { data: watches } = await supabase
  .from('watches')
  .select('*')
  .order('created_at', { ascending: false })

// RLS automatically filters by company
```

### Real-time Updates
```typescript
// Subscribe to live updates
useEffect(() => {
  const channel = supabase
    .channel('watches')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'watches' }, 
      (payload) => {
        // Update your local state
        setWatches(prev => updateWatches(prev, payload))
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

## 📞 Support

If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Verify RLS policies are working correctly
3. Test with both master and company user accounts
4. Ensure file storage buckets are created properly

The system is now ready for production use with complete multi-tenant isolation! 🎉
