# Deployment Guide

## Quick Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"
7. Your app will be live in ~2 minutes!

## Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy
5. Get your public URL

## For Production Use

### Add Database (Supabase)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Create tables:

```sql
-- Loans table
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID,
  customer_name TEXT NOT NULL,
  date_recorded DATE NOT NULL,
  amount_borrowed DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  payment_frequency TEXT NOT NULL,
  term_length INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  remaining_balance DECIMAL(10,2) NOT NULL,
  penalty_rate DECIMAL(5,2),
  agreement_photo TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id UUID REFERENCES loans(id),
  payment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  amount_due DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  paid_date DATE,
  is_paid BOOLEAN DEFAULT FALSE,
  is_overdue BOOLEAN DEFAULT FALSE,
  penalty DECIMAL(10,2) DEFAULT 0,
  receipt_photo TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. Get your Supabase URL and anon key
5. Add to environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Add Authentication

1. Enable Email auth in Supabase
2. Install: `npm install @supabase/supabase-js`
3. Create auth context and protect routes
4. Add user_id to loans table

### Add Image Storage

1. Enable Storage in Supabase
2. Create buckets: `loan-documents`, `receipts`, `ids`
3. Update image upload to use Supabase storage
4. Set proper RLS policies

### Add Notifications

For SMS notifications:
- Use Twilio API
- Send reminders 1 day before due date
- Send overdue notifications

For Email:
- Use SendGrid or Resend
- Email payment confirmations
- Weekly summary reports

## Environment Variables

Create `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_auth_token
```

## Mobile App (Optional)

Convert to mobile app using:
- Capacitor: `npm install @capacitor/core @capacitor/cli`
- Build for iOS/Android
- Add native features (camera, notifications)

## Security Checklist

- [ ] Enable RLS on all Supabase tables
- [ ] Add user authentication
- [ ] Validate all inputs
- [ ] Sanitize image uploads
- [ ] Use HTTPS only
- [ ] Add rate limiting
- [ ] Implement proper error handling
- [ ] Add data backup system

## Performance Optimization

- [ ] Enable image compression
- [ ] Add lazy loading for images
- [ ] Implement virtual scrolling for large lists
- [ ] Add service worker for offline support
- [ ] Optimize bundle size
- [ ] Add CDN for static assets

## Monitoring

- Add error tracking (Sentry)
- Add analytics (Google Analytics, Plausible)
- Monitor API usage
- Set up uptime monitoring
- Track user engagement

Your loan management system is now ready for production! 🚀
