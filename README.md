# Digital Patron - Outreach Dashboard

A modern React + TypeScript dashboard for managing B2B leads, WhatsApp outreach, follow-ups, and reports.

## 📊 Features

- **Home Dashboard** - Real-time metrics, pipeline overview, activity feed
- **Lead Management** - Search, filter, bulk operations, CSV/Excel export
- **WhatsApp Queue** - Priority-sorted message queue with workflow tracking
- **Follow-ups** - Today/Overdue/Upcoming tabs with reschedule capability
- **Reports & Analytics** - Charts, response rates, template performance

## 🎯 Use Case

Built for Digital Patron's tri-city B2B tech lead outreach:
- Target: Chandigarh, Mohali, Panchkula
- ICP: 30-140 employees, B2B tech companies
- 800-1500 leads/day processing capacity

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev
# Opens at http://localhost:3000

# Production build
npm run build
npm run preview
```

## ⚙️ Configuration

Create `.env` file:
```env
VITE_ENGINE_API_URL=http://localhost:8000
VITE_ENGINE_API_TOKEN=your-api-token-here
VITE_LEAD_ARCHIVE_DAYS=7
```

## 🔗 API Connection

Dashboard connects to the Digital Patron engine API:
- **Local**: `http://localhost:8000`
- **Server**: `http://YOUR_SERVER_IP:8000`

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Metrics, pipeline, quick actions |
| Leads | `/leads` | Searchable table with bulk ops |
| Lead Detail | `/leads/:id` | Full lead information |
| WhatsApp Queue | `/whatsapp` | Message processing workflow |
| Follow-ups | `/followups` | Due/overdue follow-up management |
| Reports | `/reports` | Charts and analytics |

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP**: Axios
- **Charts**: Recharts
- **Export**: PapaParse (CSV), XLSX (Excel)

## 📦 Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── common/       # Button, Card, Modal, etc.
│   │   ├── home/         # Metric cards, pipeline
│   │   ├── leads/        # Table, filters, bulk actions
│   │   ├── whatsapp/     # Queue items, stats
│   │   ├── followups/    # Tabs, reschedule modal
│   │   ├── reports/      # Charts, date picker
│   │   └── layout/       # Sidebar, header
│   ├── pages/            # Route pages
│   ├── lib/              # API client, types, export
│   ├── hooks/            # Custom React hooks
│   └── context/          # App state context
```

## 🔐 Authentication

Single shared API token for all users (3-4 team members).

## 📋 Key Workflows

### WhatsApp Outreach
1. View prioritized queue
2. Click "Open WhatsApp" → opens wa.me link
3. Send message manually in WhatsApp
4. Click "Mark as Sent" → updates CRM

### Lead Management
1. Search and filter leads
2. Select multiple for bulk operations
3. Bulk mark sent/unsent/archive
4. Export to CSV or Excel

### Follow-ups
1. View Today/Overdue/Upcoming tabs
2. Complete or reschedule follow-ups
3. Add notes and reasons

## 📈 Reports

- Outreach volume by day (bar chart)
- Response rate trend (line chart)
- Lead status distribution (pie chart)
- Template performance (table)

## 🎨 Branding

Dashboard branded for **Digital Patron** with:
- Professional blue color scheme
- DP logo in sidebar
- Clean, modern UI

## 📝 License

Proprietary - Digital Patron

## 🆘 Support

For issues or questions, contact the Digital Patron team.
