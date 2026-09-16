# Fix Dashboard Connection - Step by Step

## ✅ Dashboard Code is CORRECT

The dashboard is configured to:
- ✅ Call `https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics`
- ✅ Add `Authorization: Bearer ***` header
- ✅ Handle the metrics object directly (not data.items)
- ✅ Use HTTPS

---

## 🔑 What You Need to Do

### Step 1: Open Dashboard

```
http://localhost:3001
```

### Step 2: Open Browser Console

Press **F12** → Go to **Console** tab

### Step 3: Check Current Token

```javascript
// Check what token is stored
console.log('Current token:', localStorage.getItem('engine_api_token'));
console.log('Current URL:', localStorage.getItem('engine_api_url'));
```

### Step 4: Set the API Token

**If no token is stored, set it:**

```javascript
// Replace YOUR_ACTUAL_TOKEN with your real token
localStorage.setItem('engine_api_token', 'YOUR_ACTUAL_TOKEN_HERE');
localStorage.setItem('engine_api_url', 'https://hermes-vm.tail5e4a2f.ts.net');

// Reload the page
window.location.reload();
```

---

## 🧪 Test the API Directly

**In browser console, test the connection:**

```javascript
// Test health endpoint (no auth needed)
fetch('https://hermes-vm.tail5e4a2f.ts.net/health')
  .then(r => r.json())
  .then(data => console.log('✅ Health:', data));

// Test metrics endpoint (needs auth)
const token = localStorage.getItem('engine_api_token');
fetch('https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(data => console.log('✅ Metrics:', data))
  .catch(err => console.error('❌ Error:', err));
```

---

## 🔍 Debug Steps

**If still no data, run these in console:**

```javascript
// 1. Check token exists
console.log('Token:', localStorage.getItem('engine_api_token'));

// 2. Check URL
console.log('URL:', localStorage.getItem('engine_api_url'));

// 3. Test API manually
fetch('https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics', {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('engine_api_token')}` 
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

---

## 🎯 Expected Results

**When working correctly, you should see:**

```json
{
  "emails_sent_today": 0,
  "whatsapp_queue_count": 0,
  "followups_due_today": 0,
  "leads_new": 0,
  "leads_contacted": 1,
  "leads_responded": 0,
  "leads_qualified": 1,
  "leads_won": 0,
  "replies_today": 0
}
```

---

## 📋 Common Issues

### Issue 1: No token stored
**Fix:** Set token with localStorage (see above)

### Issue 2: Wrong token
**Fix:** Get correct token from server and update localStorage

### Issue 3: CORS error
**Fix:** Add dashboard URL to engine's CORS origins:
```python
allow_origins=["http://localhost:3001", "http://localhost:5173"]
```

---

## 🚀 Next Steps

1. ✅ Open `http://localhost:3001`
2. ✅ Open browser console (F12)
3. ✅ Check/set your API token
4. ✅ Refresh page
5. ✅ Data should load!

**Please run the debug commands above and tell me what you see!**
