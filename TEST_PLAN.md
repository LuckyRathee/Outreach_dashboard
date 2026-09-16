# Dashboard Integration Test Plan

## Current Status

**Issue**: Tailscale funnel SSL/TLS certificate handshake failing
**Error**: `curl: (35) schannel: failed to receive handshake`

---

## Step 1: Fix Tailscale Funnel (On Server)

```bash
# SSH into your server
ssh user@hermes-vm

# Restart funnel
sudo tailscale funnel --stop
sudo tailscale funnel --bg 8000

# Verify it works
curl https://hermes-vm.tail5e4a2f.ts.net/health
```

**Expected output:**
```json
{"status":"ok","service":"website-outreach-engine","api_version":"v1"}
```

---

## Step 2: Update Dashboard for Live API

Once funnel is working, I'll update the dashboard to:
1. ✅ Use Netlify proxy for production (token server-side)
2. ✅ Call API directly in development (token in localStorage)
3. ✅ Handle all WhatsApp flow correctly
4. ✅ Handle all Email flow correctly
5. ✅ Display activity timeline
6. ✅ Show proper error states

---

## Step 3: Verification Checklist

After funnel is fixed, test each endpoint:

### Health Check
```bash
curl https://hermes-vm.tail5e4a2f.ts.net/health
```
✅ Should return: `{"status":"ok"}`

### Dashboard Metrics
```bash
curl -H "Authorization: Bearer ***" \
  https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics
```
✅ Should return metrics JSON

### Leads List
```bash
curl https://hermes-vm.tail5e4a2f.ts.net/api/v1/leads
```
✅ Should return leads array

### WhatsApp Queue
```bash
curl https://hermes-vm.tail5e4a2f.ts.net/api/v1/outreach/whatsapp-queue
```
✅ Should return queue items with `whatsapp.url`

---

## Step 4: Dashboard Features to Implement

### A. WhatsApp Flow
1. Load queue from `/api/v1/outreach/whatsapp-queue`
2. Display `whatsapp.url` from response
3. Open URL in new tab
4. Call `POST /api/v1/leads/{lead_id}/whatsapp/opened` with `{"actor":"dashboard-user"}`
5. Show confirmation dialog before marking sent
6. Call `POST /api/v1/leads/{lead_id}/whatsapp/mark-sent` with confirmation
7. Refresh all data

### B. Email Flow
1. Load draft from `/api/v1/leads/{lead_id}/outreach-draft`
2. Show email preview
3. Require approval: `POST /api/v1/leads/{lead_id}/outreach/approve`
4. Require send confirmation
5. Send: `POST /api/v1/leads/{lead_id}/email/send`

### C. Follow-ups
1. List from `/api/v1/followups`
2. Complete: `POST /api/v1/followups/{followup_id}/complete`
3. Snooze: `POST /api/v1/followups/{followup_id}/snooze`

### D. Activity Timeline
1. Load from `/api/v1/activity`
2. Display events by type
3. Filter by lead: `/api/v1/activity?lead_id={lead_id}`

---

## Next Steps

**You need to do:**
1. SSH into server
2. Restart Tailscale funnel
3. Verify funnel works with curl
4. Share the API token with me (I'll store it securely in the code)

**I'll do:**
1. Update dashboard to use all endpoints correctly
2. Implement WhatsApp flow with proper confirmation
3. Implement Email flow with approval steps
4. Add activity timeline
5. Test all workflows end-to-end

---

## Quick Test Script

Run this on your local machine after fixing the funnel:

```bash
#!/bin/bash
echo "Testing Engine API..."

# Health
echo "1. Health check:"
curl -s https://hermes-vm.tail5e4a2f.ts.net/health
echo -e "\n"

# Metrics
echo "2. Dashboard metrics:"
curl -s https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics
echo -e "\n"

# Leads
echo "3. Leads list:"
curl -s https://hermes-vm.tail5e4a2f.ts.net/api/v1/leads | head -c 500
echo -e "\n"

# WhatsApp Queue
echo "4. WhatsApp queue:"
curl -s https://hermes-vm.tail5e4a2f.ts.net/api/v1/outreach/whatsapp-queue
echo -e "\n"

echo "All tests complete!"
```

---

Once you confirm the funnel is working, I'll implement all the remaining dashboard features!
