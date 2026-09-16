# Netlify Deployment Guide

## Architecture

```
Browser (Dashboard)
  ↓ HTTPS
Netlify Function (engine-proxy)
  ↓ Server-side authentication
FastAPI Engine API (Azure/Remote)
  ↓
Python Outreach Engine
```

**Security Benefits:**
- ✅ API token never exposed to browser
- ✅ All requests authenticated server-side
- ✅ CORS and rate limiting handled by proxy
- ✅ Request validation and sanitization

---

## Step 1: Configure Netlify Environment Variables

In your Netlify dashboard, go to **Site Settings > Environment Variables** and add:

```env
ENGINE_API_BASE_URL=https://hermes-vm.tail5e4a2f.ts.net
ENGINE_API_TOKEN=your-actual-engine-token-here
```

**Important:** 
- Never commit these values to Git
- Use the actual engine token configured on your engine machine
- The base URL should be your Tailscale or public HTTPS endpoint

---

## Step 2: Deploy to Netlify

### Option A: Connect Git Repository

1. Push your dashboard code to GitHub/GitLab/Bitbucket
2. Log in to Netlify
3. Click "Add new site" > "Import an existing project"
4. Connect your repository
5. Build settings auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

### Option B: Drag & Drop

```bash
cd D:\HermesDEmos\dashboard
npm run build
```

Then drag the `dist` folder to Netlify's deploy dropzone.

### Option C: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to existing site or create new
cd D:\HermesDEmos\dashboard
netlify init

# Deploy
netlify deploy --prod
```

---

## Step 3: Test the Deployment

### 1. Check Health Endpoint

```bash
curl https://your-site.netlify.app/api/health
```

Expected response:
```json
{"status": "ok"}
```

### 2. Check Metrics

```bash
curl https://your-site.netlify.app/api/v1/dashboard/metrics
```

### 3. Verify in Dashboard

1. Open dashboard in browser
2. Click **Settings** button in header
3. Mode should show **"API (Live Data)"**
4. Check console - no API token in browser Network tab

---

## Step 4: Configure Dashboard Mode

### For Demo Mode (Sample Data)

Click **Settings** > **Switch to Demo**

### For API Mode (Live Data)

1. Ensure Netlify environment variables are set
2. Dashboard auto-detects API mode when deployed
3. No token configuration needed in browser

---

## Security Checklist

✅ **Never expose token in browser:**
   - Token only in Netlify environment variables
   - Proxy adds `Authorization` header server-side
   - Browser only sees `/api/*` endpoints

✅ **Validate all requests:**
   - Proxy only allows whitelisted endpoints
   - Arbitrary paths rejected with 403
   - Request timeout enforced (30 seconds)

✅ **Do not log secrets:**
   - Proxy never logs Authorization header
   - Errors sanitized before returning

✅ **HTTPS required:**
   - Netlify enforces HTTPS
   - Engine API should use HTTPS

✅ **Rate limiting:**
   - Netlify provides DDoS protection
   - Consider adding API rate limits

---

## Local Development

### With Netlify Dev

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Create .env file for local testing
echo "ENGINE_API_BASE_URL=http://127.0.0.1:8000" > .env
echo "ENGINE_API_TOKEN=local-dev-token" >> .env

# Run Netlify Dev (simulates production)
netlify dev
```

This runs:
- Dashboard at `http://localhost:8888`
- Functions at `http://localhost:9999/.netlify/functions/`
- Hot reload enabled

### Without Netlify Dev

```bash
# Use demo mode
npm run dev
```

Dashboard runs with sample data, no API needed.

---

## Troubleshooting

### 403 Forbidden

**Cause:** Endpoint not in allowlist

**Fix:** Add endpoint to `ALLOWED_ENDPOINTS` in `netlify/functions/engine-proxy.ts`

### 502 Bad Gateway

**Cause:** Engine API unreachable

**Fix:**
- Check `ENGINE_API_BASE_URL` in Netlify env vars
- Verify engine is running and accessible
- Check Tailscale/network connectivity

### 504 Gateway Timeout

**Cause:** Engine API took too long

**Fix:**
- Check engine logs for slow queries
- Increase `REQUEST_TIMEOUT` in proxy (default 30s)

### CORS Errors

**Cause:** Trying to call engine directly from browser

**Fix:** Always use `/api/*` endpoints, which route through proxy

---

## Allowed Endpoints

```http
GET  /health
GET  /api/v1/dashboard/metrics
GET  /api/v1/leads
GET  /api/v1/leads/{lead_id}
GET  /api/v1/outreach/whatsapp-queue
GET  /api/v1/leads/{lead_id}/outreach-draft
GET  /api/v1/followups
GET  /api/v1/activity
GET  /api/v1/leads/{lead_id}/activity
POST /api/v1/sync
POST /api/v1/leads/{lead_id}/whatsapp/opened
POST /api/v1/leads/{lead_id}/whatsapp/mark-sent
POST /api/v1/followups/{followup_id}/complete
POST /api/v1/followups/{followup_id}/snooze
POST /api/v1/leads/{lead_id}/outreach/approve
POST /api/v1/leads/{lead_id}/outreach/reject
POST /api/v1/leads/{lead_id}/email/send
```

To add more endpoints, update the `ALLOWED_ENDPOINTS` array in the proxy function.

---

## Monitoring

### Netlify Functions Logs

1. Go to Netlify Dashboard
2. Click **Functions** tab
3. View real-time logs

### Request Flow

```
Browser Request
  → Netlify Edge
  → Function Execution
  → Engine API Call
  → Response
```

All logged in Netlify dashboard.

---

## Next Steps

1. **Deploy** to Netlify
2. **Set** environment variables
3. **Test** health endpoint
4. **Verify** no token in browser
5. **Start** using dashboard!

---

## Questions?

- Dashboard shows demo data? → Click Settings > Switch to API mode
- API errors? → Check Netlify function logs
- Need help? → Check engine API health endpoint first
