# Personal Loan Management System

A comprehensive, mobile-first loan tracking and management system built with React, TypeScript, and Tailwind CSS.

## Features

### 📱 Mobile-Optimized Interface
- Responsive design that works seamlessly on all devices
- Touch-optimized controls with 48px minimum tap targets
- Bottom navigation for easy thumb access
- Smooth animations and transitions

### 💰 Loan Management
- Create loans with customizable terms
- Support for multiple payment frequencies:
  - Daily
  - Weekly
  - Bi-monthly (15 days)
  - Monthly
- Automatic payment schedule calculation
- Interest and penalty rate configuration
- Customer information with ID photo upload

### 📊 Payment Tracking
- Visual payment schedule with status indicators
- Record payments with receipt photo upload
- Automatic penalty calculation for overdue payments
- Real-time balance updates
- Payment history with receipts

### 📸 Document Management
- Upload and store customer ID photos
- Upload loan agreement documents
- Upload payment receipt photos
- Camera integration for mobile devices

### 📈 Reports & Analytics
- Financial summary dashboard
- Collection rate tracking
- Active, overdue, and completed loan statistics
- Total outstanding balance
- Penalty tracking

### 🔍 Search & Filter
- Search loans by customer name
- Filter by loan status (active, overdue, completed)
- Filter by payment frequency
- Real-time filtering

### 💾 Data Persistence
- Local storage for offline access
- Automatic data saving
- No database setup required for basic use

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open your browser to the provided URL

## Usage

### Creating a New Loan
1. Click the "New Loan" button on the dashboard
2. Fill in customer information
3. Upload customer ID photo (optional)
4. Enter loan details:
   - Amount borrowed
   - Interest rate
   - Payment frequency
   - Term length
   - Start date
   - Penalty rate
5. Upload loan agreement photo (optional)
6. Add notes if needed
7. Click "Create Loan"

### Recording Payments
1. Select a loan from the dashboard
2. View the payment schedule
3. Click "Record Payment" on any unpaid payment
4. Enter payment amount and date
5. Upload receipt photo (optional)
6. Add notes if needed
7. Click "Save Payment"

### Viewing Reports
1. Click the "Reports" tab in bottom navigation
2. View financial summary
3. Check collection rate
4. Review loan statistics

DATABASE (PostgreSQL/Supabase)

## Technical Details

### Built With
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Vite

### Key Components
- `Dashboard`: Main loan overview
- `LoanFormComponent`: Create new loans
- `LoanDetails`: View individual loan details
- `PaymentScheduleView`: Display payment schedule
- `PaymentRecorder`: Record payments
- `SummaryReport`: Financial reports
- `SearchFilter`: Search and filter functionality

### Data Structure
All data is stored in localStorage with the following structure:
- Loans: Array of loan objects
- Payments: Array of payment objects linked to loans

## Future Enhancements

For production deployment, consider:
- Backend API integration
- User authentication
- Multi-user support
- SMS/Email notifications
- PDF report generation
- Data export (CSV/Excel)
- Cloud backup

## License

MIT License - feel free to use for personal or commercial projects.
