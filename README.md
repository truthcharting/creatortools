# CreatorTools

A comprehensive project management and productivity app built with React, TypeScript, and Supabase.

## Features

- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Project Management**: Create, organize, and manage projects
- **Task Management**: Track tasks with status, priority, and due dates
- **Notes**: Create and organize notes with tags
- **Photo Management**: Upload and organize photos with cloud storage
- **Receipt Tracking**: Store and categorize receipts
- **Voice Notes**: Record and store voice memos
- **Timestamps**: Quick timestamp creation for project tracking
- **Cloud Storage**: All data stored securely in Supabase

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: GitHub Pages

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/truthcharting/creatortools.git
cd creatortools
npm install
```

### 2. Supabase Setup (Step-by-Step)

**IMPORTANT**: Run these SQL scripts in order to avoid permission issues.

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard/project/pyvpjmssbtvwkzzvobgf

2. **Navigate to SQL Editor** in the left sidebar

3. **Step 1: Create Tables**
   - Copy the contents of `supabase-schema-basic.sql`
   - Paste into SQL editor and run
   - This creates all the basic tables without permissions

4. **Step 2: Enable Security Policies**
   - Copy the contents of `supabase-policies.sql`
   - Paste into SQL editor and run
   - This enables Row Level Security and creates access policies

5. **Step 3: Setup Storage and Functions**
   - Copy the contents of `supabase-storage.sql`
   - Paste into SQL editor and run
   - This creates storage buckets and database functions

6. **Verify the setup**:
   - Check that all tables are created in the "Tables" section
   - Verify storage buckets are created in the "Storage" section
   - Ensure Row Level Security (RLS) is enabled on all tables

### 3. Environment Configuration

The app is already configured with your Supabase credentials in `src/lib/supabase.ts`:

- **Project URL**: `https://pyvpjmssbtvwkzzvobgf.supabase.co`
- **API Keys**: Already configured in the code

### 4. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Database Schema

The app uses the following main tables:

- **users**: User profiles (extends Supabase auth)
- **projects**: User projects
- **tasks**: Project tasks with status and priority
- **notes**: Text notes with tags
- **photos**: Photo metadata and storage paths
- **receipts**: Receipt tracking with amounts and categories
- **voice_notes**: Voice memo metadata
- **timestamps**: Quick timestamp entries

## Storage Buckets

- **photos**: User photo uploads
- **receipts**: Receipt image uploads  
- **voice_notes**: Voice memo audio files

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Secure user sign-up/sign-in
- **File Access Control**: Users can only access their own uploaded files
- **API Key Protection**: Service role key kept secure

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/            # Reusable UI components
│   └── ...            # Feature-specific components
├── contexts/           # React contexts (Auth)
├── lib/               # Library configurations
├── services/          # API services
├── types/             # TypeScript type definitions
└── styles/            # CSS styles
```

### Key Services

- **AuthContext**: Manages user authentication state
- **supabaseService**: Handles all database and storage operations
- **storageService**: Local storage fallback (legacy)

### Adding New Features

1. **Database**: Add new tables to the SQL schema files
2. **Types**: Update `src/types/database.ts`
3. **Services**: Add methods to `src/services/supabaseService.ts`
4. **Components**: Create new React components
5. **Integration**: Update existing components to use new features

## Deployment

The app is configured for automatic deployment to GitHub Pages:

- **Automatic**: Every push to `main` triggers deployment
- **Manual**: Run `npm run deploy` anytime
- **URL**: https://truthcharting.github.io/creatortools/

## Troubleshooting

### Common Issues

1. **Permission Errors**: Make sure to run SQL scripts in the correct order
2. **Authentication Errors**: Check Supabase project settings and API keys
3. **Database Errors**: Verify SQL schema was run successfully
4. **Storage Issues**: Check storage bucket policies and permissions
5. **Build Errors**: Ensure all dependencies are installed

### Supabase Dashboard Checks

- **Authentication**: Verify email confirmations are enabled
- **Database**: Check that all tables exist and RLS is enabled
- **Storage**: Confirm storage buckets are created
- **API**: Verify API keys are correct

### SQL Script Order

Always run the SQL scripts in this order:
1. `supabase-schema-basic.sql` - Creates tables
2. `supabase-policies.sql` - Enables security
3. `supabase-storage.sql` - Sets up storage and functions

## Support

For issues or questions:

1. Check the Supabase dashboard for errors
2. Review browser console for frontend errors
3. Check GitHub Actions for deployment issues
4. Verify database schema and policies
5. Ensure SQL scripts were run in the correct order

## License

This project is licensed under the MIT License.  