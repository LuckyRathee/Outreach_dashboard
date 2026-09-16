# Digital Patron Dashboard

A secure React dashboard for B2B lead outreach management with server-side API authentication.

## Architecture

```
Browser Dashboard
  ↓ HTTPS
Netlify Function (engine-proxy)
  ↓ Server-side authentication
FastAPI Engine API (Azure/Remote)
  ↓
Python Outreach Engine
```

**Security:**
- ✅ API token never exposed to browser
- ✅ All requests authenticated server-side
- ✅ Whitelisted endpoints only
- ✅ Request validation and timeout

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Engine API running and accessible
- API token from your engine deployment

### Local Development

```bash
# Install dependencies
cd D:\HermesDEmos\dashboard
npm install

# Run development server
npm run dev
```

Dashboard runs at `http://localhost:5173`

### Production Deployment

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

## Configuration

### Environment Variables

Set in Netlify Dashboard → Site Settings → Environment Variables:

```env
ENGINE_API_BASE_URL=https://hermes-vm.tail5e4a2f.ts.net
ENGINE_API_TOKEN=your-engine-token-here
```

### Landing Page

On first load, the dashboard shows a landing page where you enter:

1. **Engine API URL** - Your engine's public URL
2. **API Token** - Authentication token

Click "Connect to API" to proceed.

## Features

### 📊 Dashboard Home
- Overview metrics (emails, WhatsApp, follow-ups)
- Pipeline visualization
- Recent activity feed

### 👥 Lead Management
- Filterable lead list
- Lead detail view
- Bulk operations
- Export to CSV/Excel

### 💬 WhatsApp Queue
- Prioritized queue
- Open WhatsApp → Mark as Sent workflow
- Confirmation dialogs
- Real-time updates

### 📅 Follow-ups
- Today, overdue, upcoming tabs
- Reschedule functionality
- Complete actions

### 📈 Reports
- Outreach charts
- Response rates
- Template performance
- Date range filtering

## API Endpoints Used

```http
GET  /health
GET  /api/v1/dashboard/metrics
GET  /api/v1/leads
GET  /api/v1/leads/{lead_id}
GET  /api/v1/outreach/whatsapp-queue
GET  /api/v1/followups
GET  /api/v1/activity
POST /api/v1/sync
POST /api/v1/leads/{lead_id}/whatsapp/opened
POST /api/v1/leads/{lead_id}/whatsapp/mark-sent
POST /api/v1/followups/{followup_id}/complete
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Charts and analytics
- **Axios** - HTTP client
- **React Router** - Navigation
- **Netlify Functions** - Serverless proxy

## Project Structure

```
D:\HermesDEmos\dashboard\
├── netlify/
│   └── functions/
│       └── engine-proxy.ts      # Secure API proxy
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   ├── home/
│   │   ├── leads/
│   │   ├── whatsapp/
│   │   ├── followups/
│   │   ├── reports/
│   │   └── layout/
│   ├── lib/
│   │   ├── apiEngineAdapter.ts  # API client
│   │   ├── dataAdapter.ts       # Unified adapter
│   │   ├── types.ts             # TypeScript types
│   │   └── export.ts            # Export utilities
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Leads.tsx
│   │   ├── LeadDetail.tsx
│   │   ├── WhatsAppQueue.tsx
│   │   ├── FollowUps.tsx
│   │   ├── Reports.tsx
│   │   └── Landing.tsx
│   ├── hooks/
│   └── context/
├── netlify.toml                 # Netlify config
└── package.json
```

## Security Features

✅ **No token in browser** - Server-side proxy handles auth  
✅ **Whitelisted endpoints** - Only allowed paths accepted  
✅ **Request timeout** - 30-second limit  
✅ **HTTPS enforcement** - Netlify provides SSL  
✅ **Confirmation dialogs** - Prevents accidental actions  
✅ **No secret logging** - Authorization header stripped from logs

## WhatsApp Workflow

1. Lead appears in WhatsApp Queue
2. Click **Open WhatsApp** → Opens in new tab
3. **Does NOT count as sent**
4. Manually send message in WhatsApp
5. Click **Mark as Manually Sent**
6. Confirmation dialog appears
7. Confirm → Updates lead status
8. Lead moves to CONTACTED
9. Follow-up scheduled

## Testing

### Health Check

```bash
curl https://your-dashboard.netlify.app/api/health
```

### Verify Token Security

Open browser DevTools → Network tab:
- ✅ No API token in requests
- ✅ Only `/api/*` endpoints called
- ✅ Authorization added server-side

## Troubleshooting

### 403 Forbidden
- Endpoint not whitelisted
- Add to `ALLOWED_ENDPOINTS` in `netlify/functions/engine-proxy.ts`

### 502 Bad Gateway
- Engine API unreachable
- Check `ENGINE_API_BASE_URL` environment variable
- Verify engine is running

### 504 Gateway Timeout
- Engine took too long
- Check engine logs
- Increase `REQUEST_TIMEOUT` (default 30s)

## Company

**Digital Patron** - B2B tech lead outreach for Chandigarh tri-city

- Target: 30-140 employees
- Industry: B2B technology
- Location: Chandigarh, Mohali, Panchkula
- Users: 3-4 team members

## License

Proprietary - Digital Patron

## Contact

For support, contact the Digital Patron team.
