# Supabase Setup Instructions

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://hscxnaplrewvqjdhjlsj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 2. Get Your Supabase Keys

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/hscxnaplrewvqjdhjlsj)
2. Navigate to **Project Settings** > **API**
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Set Up Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute the schema

## 4. Verify Setup

After setting up the environment variables and running the schema:

1. Restart your development server: `npm run dev`
2. Check the browser console for any errors
3. The app should now be connected to Supabase

## 5. Database Tables Created

- **customers** - Customer information
- **products** - Watch inventory
- **orders** - Sales and purchase transactions
- **profiles** - User profile information

## 6. Sample Data

The schema includes sample data to get you started:
- 5 sample customers
- 5 sample products
- 2 sample orders

## 7. Next Steps

Once set up, the app will:
- Load data from Supabase instead of local state
- Persist all changes to the database
- Support real-time updates (if enabled)
- Handle authentication (if implemented)

## Troubleshooting

- Make sure all environment variables are set correctly
- Check that the database schema was created successfully
- Verify that Row Level Security policies are set up
- Check the browser console for any error messages
