## 🔧 Local Development Guide

### Quick Start

```bash
# Start development server
cd D:\HermesDEmos\dashboard
npm run dev
```

Then open `http://localhost:5173` and enter:
- **Engine API URL**: Your engine's URL (e.g., `http://localhost:8000` or `https://your-azure-url.com`)
- **API Token**: Your authentication token

### How It Works

#### Local Development
```
Browser (localhost:5173)
  ↓ Direct API call with token
Engine API (localhost:8000 or remote)
```

#### Production (Netlify)
```
Browser
  ↓ No token in request
Netlify Function
  ↓ Adds token server-side
Engine API
```

### Testing Your API Connection

#### 1. Test Health Endpoint

```bash
# Replace with your engine URL
curl http://localhost:8000/health

# Or for remote API
curl https://your-azure-url.com/health
```

Expected response:
```json
{"status": "ok"}
```

#### 2. Test with Authentication

```bash
# Replace URL and TOKEN with your values
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/dashboard/metrics
```

Expected response:
```json
{
  "emails_sent_today": 10,
  "whatsapp_queue_count": 5,
  "followups_due_today": 3,
  ...
}
```

### Common Issues

#### ❌ CORS Error

**Problem:** Browser blocks requests to different origin

**Solution:**
1. Ensure your Engine API has CORS configured:
   ```python
   # In your FastAPI app
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],  # Add your dashboard URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

#### ❌ Connection Refused

**Problem:** API not running or wrong URL

**Solution:**
1. Check your Engine API is running
2. Verify the URL is correct
3. Check firewall settings

#### ❌ 401 Unauthorized

**Problem:** Invalid or missing token

**Solution:**
1. Verify your API token is correct
2. Check token has necessary permissions
3. Ensure token is not expired

### Environment Variables (Optional)

For convenience, you can create a `.env` file:

```env
# .env file (DO NOT commit to git!)
VITE_ENGINE_API_URL=http://localhost:8000
VITE_ENGINE_API_TOKEN=your-token-here
```

Then update `apiEngineAdapter.ts` to use them:

```typescript
const getApiConfig = () => {
  const apiUrl = import.meta.env.VITE_ENGINE_API_URL || 
                 localStorage.getItem('engine_api_url') || 
                 'http://localhost:8000'
  const apiToken = import.meta.env.VITE_ENGINE_API_TOKEN || 
                   localStorage.getItem('engine_api_token') || ''
  return { apiUrl, apiToken }
}
```

### Production Deployment

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for production deployment instructions.

### Architecture Comparison

| Aspect | Local Dev | Production |
|--------|-----------|------------|
| **API Calls** | Direct to engine | Via Netlify proxy |
| **Token Storage** | localStorage + browser header | Netlify env vars + server header |
| **Token in Browser** | ✅ Visible (localhost only) | ❌ Never visible |
| **CORS Required** | ✅ Yes | ❌ No (same origin) |
| **HTTPS** | ❌ Optional | ✅ Required |

### Next Steps

1. ✅ Start your Engine API
2. ✅ Run `npm run dev`
3. ✅ Enter your API URL and token
4. ✅ Dashboard loads with live data!

### Need Help?

Check the browser console (F12) for detailed error messages.
