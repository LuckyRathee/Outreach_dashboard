# Quick Connection Guide

## ✅ Your Funnel is Working!

Your Tailscale funnel is confirmed working:
- **URL**: `https://hermes-vm.tail5e4a2f.ts.net`
- **Health**: Passing ✅
- **API Version**: v1

---

## 🚀 Connect Your Dashboard

### Step 1: Start Dashboard

```bash
cd D:\HermesDEmos\dashboard
npm run dev
```

Dashboard will open at: `http://localhost:5173`

---

### Step 2: Configure API

On the landing page, enter:

**Engine API URL:**
```
https://hermes-vm.tail5e4a2f.ts.net
```

**API Token:**
```
your-engine-token-here
```

(Replace with your actual token from the engine)

---

### Step 3: Connect

Click **"Connect to API"**

Dashboard will load with live data from your engine!

---

## 🔑 Getting Your API Token

If you don't have the token, check your engine configuration:

On your server:
```bash
# Check engine config for token
cat /path/to/website-outreach-engine/.env | grep API_TOKEN

# Or check engine logs
sudo journalctl -u engine-api | grep token
```

---

## 🎯 What You Should See

After connecting:

✅ **Dashboard Home** with live metrics
✅ **Lead List** showing actual leads from engine
✅ **WhatsApp Queue** with real messages
✅ **Follow-ups** from the engine
✅ **Reports** with live data

---

## 🔧 Troubleshooting

### If Dashboard Shows Error

1. **Check browser console** (F12)
2. **Verify token is correct**
3. **Check CORS settings on engine**

### CORS Configuration

Your engine needs to allow requests from `http://localhost:5173`:

```python
# In your FastAPI app (api/main.py)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local dashboard
        "http://localhost:3000",  # Alternative
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Restart your engine after adding CORS.

---

## 🌐 Architecture

```
Your Browser (localhost:5173)
  ↓ HTTPS with token in header
Tailscale Funnel (hermes-vm.tail5e4a2f.ts.net)
  ↓ Forwards to
Engine API (localhost:8000 on server)
  ↓ Returns
Live Data → Dashboard
```

---

## ✅ Success Checklist

- [ ] Dashboard running (`npm run dev`)
- [ ] Funnel confirmed working ✅
- [ ] API URL entered correctly
- [ ] API token entered
- [ ] CORS configured on engine
- [ ] Dashboard loads data

---

Need help? Check browser console for specific errors!
