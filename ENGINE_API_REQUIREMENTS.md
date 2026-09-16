# Engine API Requirements for Dashboard

## ✅ Current Status

- **Health endpoint ✅ WORKING**: `GET /health` returns `{"status":"ok"}`
- **API endpoints ❌ TIMEOUT**: All `/api/v1/*` endpoints are timing out

---

## 🔧 What Your Engine API Needs

Your FastAPI engine must implement these endpoints for the dashboard to work:

---

## 1. **Dashboard Metrics**

```http
GET /api/v1/dashboard/metrics
```

**Response:**
```json
{
  "emails_sent_today": 10,
  "whatsapp_queue_count": 5,
  "followups_due_today": 3,
  "leads_new": 15,
  "leads_contacted": 8,
  "leads_responded": 4,
  "leads_qualified": 2,
  "leads_won": 1,
  "replies_today": 6
}
```

**Implementation:**
```python
@app.get("/api/v1/dashboard/metrics")
async def get_dashboard_metrics():
    # Count emails sent today
    emails_sent_today = count_emails_sent_today()
    
    # Count WhatsApp queue
    whatsapp_queue_count = count_whatsapp_queue()
    
    # Count follow-ups due today
    followups_due_today = count_followups_due_today()
    
    # Count leads by status
    leads_new = count_leads_by_status("new")
    leads_contacted = count_leads_by_status("contacted")
    leads_responded = count_leads_by_status("responded")
    leads_qualified = count_leads_by_status("qualified")
    leads_won = count_leads_by_status("won")
    
    # Count replies today
    replies_today = count_replies_today()
    
    return {
        "emails_sent_today": emails_sent_today,
        "whatsapp_queue_count": whatsapp_queue_count,
        "followups_due_today": followups_due_today,
        "leads_new": leads_new,
        "leads_contacted": leads_contacted,
        "leads_responded": leads_responded,
        "leads_qualified": leads_qualified,
        "leads_won": leads_won,
        "replies_today": replies_today
    }
```

---

## 2. **Leads List**

```http
GET /api/v1/leads?status=new&city=Mohali&search=tech&page=1&limit=50
```

**Response:**
```json
{
  "data": [
    {
      "id": "lead_123",
      "company_name": "TechStart Solutions",
      "website": "https://techstart.com",
      "employees": 65,
      "city": "Mohali",
      "industry": "SaaS",
      "linkedin_url": "https://linkedin.com/company/techstart",
      "phone": "+91 98765 43210",
      "whatsapp_number": "919876543210",
      "whatsapp_status": "pending",
      "status": "new",
      "notes": "Interested in automation",
      "created_at": "2025-09-15T10:30:00Z",
      "updated_at": "2025-09-15T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "has_more": true
}
```

**Implementation:**
```python
@app.get("/api/v1/leads")
async def list_leads(
    status: Optional[str] = None,
    city: Optional[str] = None,
    industry: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 50
):
    leads = query_leads_from_json(
        status=status,
        city=city,
        industry=industry,
        search=search,
        page=page,
        limit=limit
    )
    
    return {
        "data": leads,
        "total": count_total_leads(),
        "page": page,
        "has_more": has_more_leads(page, limit)
    }
```

---

## 3. **Single Lead**

```http
GET /api/v1/leads/{lead_id}
```

**Response:**
```json
{
  "id": "lead_123",
  "company_name": "TechStart Solutions",
  "website": "https://techstart.com",
  "employees": 65,
  "city": "Mohali",
  "industry": "SaaS",
  "linkedin_url": "https://linkedin.com/company/techstart",
  "phone": "+91 98765 43210",
  "whatsapp_number": "919876543210",
  "whatsapp_status": "pending",
  "status": "new",
  "notes": "Interested in automation",
  "created_at": "2025-09-15T10:30:00Z",
  "updated_at": "2025-09-15T10:30:00Z"
}
```

---

## 4. **WhatsApp Queue**

```http
GET /api/v1/outreach/whatsapp-queue
```

**Response:**
```json
{
  "data": [
    {
      "lead_id": "lead_123",
      "company_name": "TechStart Solutions",
      "whatsapp_number": "919876543210",
      "whatsapp_url": "https://wa.me/919876543210?text=Hello",
      "status": "READY",
      "priority": 1,
      "template": "Initial outreach"
    }
  ],
  "total": 10
}
```

**Implementation:**
```python
@app.get("/api/v1/outreach/whatsapp-queue")
async def get_whatsapp_queue():
    # Get leads ready for WhatsApp
    queue = get_leads_for_whatsapp()
    
    return {
        "data": queue,
        "total": len(queue)
    }
```

---

## 5. **WhatsApp Opened**

```http
POST /api/v1/leads/{lead_id}/whatsapp/opened
```

**Response:**
```json
{
  "status": "success",
  "message": "WhatsApp opened event recorded"
}
```

**Implementation:**
```python
@app.post("/api/v1/leads/{lead_id}/whatsapp/opened")
async def mark_whatsapp_opened(lead_id: str):
    # Update lead's WhatsApp status
    update_lead_whatsapp_status(lead_id, "opened")
    
    # Log event
    log_activity(lead_id, "whatsapp_opened")
    
    return {"status": "success"}
```

---

## 6. **WhatsApp Mark Sent**

```http
POST /api/v1/leads/{lead_id}/whatsapp/mark-sent
```

**Response:**
```json
{
  "status": "success",
  "message": "WhatsApp marked as sent"
}
```

**Implementation:**
```python
@app.post("/api/v1/leads/{lead_id}/whatsapp/mark-sent")
async def mark_whatsapp_sent(lead_id: str):
    # Update lead status to CONTACTED
    update_lead_status(lead_id, "contacted")
    
    # Update WhatsApp status
    update_lead_whatsapp_status(lead_id, "sent")
    
    # Schedule follow-up
    schedule_followup(lead_id, days=3)
    
    # Log event
    log_activity(lead_id, "whatsapp_sent")
    
    return {"status": "success"}
```

---

## 7. **Follow-ups List**

```http
GET /api/v1/followups?status=today
```

**Response:**
```json
{
  "data": [
    {
      "id": "followup_123",
      "lead_id": "lead_123",
      "company_name": "TechStart Solutions",
      "type": "email",
      "due_date": "2025-09-16T10:00:00Z",
      "status": "pending",
      "notes": "Check if they reviewed proposal"
    }
  ],
  "total": 5
}
```

---

## 8. **Complete Follow-up**

```http
POST /api/v1/followups/{followup_id}/complete
```

**Response:**
```json
{
  "status": "success"
}
```

---

## 9. **Activity Feed**

```http
GET /api/v1/activity?limit=50
```

**Response:**
```json
{
  "data": [
    {
      "id": "activity_123",
      "lead_id": "lead_123",
      "company_name": "TechStart Solutions",
      "type": "email_sent",
      "description": "Sent initial outreach email",
      "timestamp": "2025-09-15T10:30:00Z"
    }
  ],
  "total": 100
}
```

---

## 10. **Reports (Optional)**

```http
GET /api/v1/reports/outreach?start_date=2025-09-01&end_date=2025-09-16
```

---

## 🔒 **Authentication**

Your API should require a Bearer token:

```python
from fastapi import Security, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if token != os.getenv("API_TOKEN"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return token

# Use in endpoints
@app.get("/api/v1/leads")
async def list_leads(token: str = Security(verify_token)):
    ...
```

---

## 🌐 **CORS Configuration**

**Critical for browser access:**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",  # Your dashboard
        "http://localhost:3000",
        "http://localhost:5173",
        "http://192.168.1.3:3001",  # Network access
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📋 **Minimum Viable Endpoints**

Start with these 5 endpoints to get the dashboard working:

1. ✅ `GET /health` (already working)
2. ⚠️ `GET /api/v1/dashboard/metrics`
3. ⚠️ `GET /api/v1/leads`
4. ⚠️ `GET /api/v1/outreach/whatsapp-queue`
5. ⚠️ `GET /api/v1/activity`

---

## 🚀 **Quick Test Commands**

Run these on your server to test:

```bash
# Test health
curl http://localhost:8000/health

# Test metrics (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/dashboard/metrics

# Test leads
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/leads

# Test WhatsApp queue
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/outreach/whatsapp-queue
```

---

## 📁 **Your Engine Structure**

Your engine should read from these JSON files:

```
website-outreach-engine/
├── crm/
│   ├── leads.json          # Lead data
│   └── activities.json     # Activity log
├── followups/
│   └── upcoming.json       # Follow-up tasks
├── whatsapp/
│   └── queue.json          # WhatsApp queue
└── api/
    ├── main.py             # FastAPI app
    ├── auth.py             # Token validation
    └── routes/
        ├── dashboard.py    # Metrics endpoint
        ├── leads.py        # Lead endpoints
        ├── whatsapp.py     # WhatsApp endpoints
        └── followups.py    # Follow-up endpoints
```

---

## ✅ **Checklist for Your Engine**

- [ ] FastAPI running on port 8000
- [ ] CORS middleware configured
- [ ] Bearer token authentication implemented
- [ ] `/api/v1/dashboard/metrics` endpoint working
- [ ] `/api/v1/leads` endpoint working
- [ ] `/api/v1/outreach/whatsapp-queue` endpoint working
- [ ] `/api/v1/activity` endpoint working
- [ ] `/api/v1/followups` endpoint working
- [ ] JSON files being read correctly
- [ ] API responding within 5 seconds

---

## 🧪 **Test from Your Local Machine**

```bash
# Test funnel
curl https://hermes-vm.tail5e4a2f.ts.net/health

# Test metrics with token
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics
```

If this times out, your engine needs to implement the endpoints above!
