# Digital Patron CRM Dashboard

A modern React dashboard for managing B2B tech lead outreach operations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- API token for Digital Patron engine

### Installation

```bash
# Navigate to project
cd D:\HermesDEmos\dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Opens at: `http://localhost:3001`

### First Time Setup

1. Open `http://localhost:3001`
2. Click gear icon (Settings) in top-right
3. Enter API configuration:
   - **API URL:** `https://hermes-vm.tail5e4a2f.ts.net`
   - **API Token:** `[Get from engine .env file]`
4. Click "Save & Test Connection"
5. Dashboard loads automatically

---

## 📊 Features

### Home Dashboard
- Pipeline breakdown chart
- Quick statistics
- Recent activity timeline
- Sync button

### Leads Management
- Paginated lead list (50 per page)
- Filter by status, city, industry
- Search leads
- Lead detail view
- Export to CSV/Excel

### WhatsApp Outreach
- Queue of leads ready for outreach
- Pre-generated WhatsApp URLs
- One-click open with pre-filled message
- Manual send confirmation
- Automatic status tracking

### Follow-ups
- View due today, overdue, upcoming
- Mark as completed
- Snooze to new date

### Reports
- Date range selection
- Summary statistics
- Response rate charts
- Lead status distribution

---

## 🛠️ Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **State:** React Hooks + Context
- **HTTP:** Fetch API

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── home/           # Dashboard-specific
│   ├── leads/          # Lead management
│   ├── whatsapp/       # WhatsApp queue
│   ├── followups/      # Follow-up management
│   ├── reports/        # Reporting widgets
│   └── layout/         # App layout
├── pages/              # Main page components
├── lib/                # Utilities & API
│   ├── apiEngineAdapter.ts  # API client
│   ├── dataAdapter.ts       # Data layer
│   ├── types.ts             # TypeScript types
│   └── export.ts            # Export utilities
├── hooks/              # Custom React hooks
└── App.tsx             # Main app component
```

---

## 🔧 Configuration

### API Settings
Stored in browser localStorage:
- `api_url` - Engine API base URL
- `api_token` - Authentication token

Update via Settings modal (gear icon).

### Environment Variables (Optional)
For production deployment:
```env
VITE_API_URL=https://hermes-vm.tail5e4a2f.ts.net
```

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` folder.

### Local Preview
```bash
npm run preview
```
Preview production build locally.

### Deploy to Netlify
1. Push to Git repository
2. Connect Netlify to repo
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/dashboard/metrics` | GET | Dashboard metrics |
| `/api/v1/leads` | GET | Lead list |
| `/api/v1/leads/:id` | GET | Lead details |
| `/api/v1/outreach/whatsapp-queue` | GET | WhatsApp queue |
| `/api/v1/leads/:id/whatsapp/opened` | POST | Log WhatsApp opened |
| `/api/v1/leads/:id/whatsapp/mark-sent` | POST | Mark as sent |
| `/api/v1/followups` | GET | Follow-up list |
| `/api/v1/followups/:id/complete` | POST | Complete follow-up |
| `/api/v1/followups/:id/snooze` | POST | Snooze follow-up |
| `/api/v1/activity` | GET | Activity timeline |
| `/api/v1/sync` | POST | Trigger sync |

---

## 📚 Documentation

- **Full Documentation:** `PROJECT_DOCUMENTATION.md`
- **Technical Changes:** `TECHNICAL_CHANGES.md`
- **API Integration:** See `src/lib/apiEngineAdapter.ts`

---

## 🐛 Known Issues

- **WebSocket Error in Dev:** `ws://localhost:8081` connection fails - cosmetic only, can be ignored
- **Reports Empty:** Reports endpoints not implemented on engine yet - shows empty data with message

---

## 🔒 Security

- **Token Storage:** localStorage (suitable for shared team token)
- **Production:** Token handled server-side via Netlify Functions
- **HTTPS:** All API calls use HTTPS
- **No Credentials:** Passwords/secrets never exposed in code

---

## 👥 Users

**Target Users:** 3-4 team members
**Authentication:** Single shared API token
**Access:** Desktop-only (local network or Tailscale)

---

## 📝 License

Copyright © 2026 Digital Patron. All rights reserved.

---

## 🆘 Support

**Local Development:** `http://localhost:3001`
**Production:** Netlify deployment
**API Issues:** Check engine logs at `/home/hermesadmin/website-outreach-engine/`
**Dashboard Issues:** Check browser console (F12)

---

**Built with ❤️ for Digital Patron**
