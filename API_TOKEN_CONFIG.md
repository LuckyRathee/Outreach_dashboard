# API Token Configuration

## Your API Token
```
LCYwG2URBHUvYP0i9qheby4vFrU7eu1o3iYigg5xM2ey5TStSInAMcVW52IEqI2U
```

## API Base URL
```
https://hermes-vm.tail5e4a2f.ts.net
```

---

## Setup Dashboard

### Option 1: Via Dashboard UI

1. Open `http://localhost:3001`
2. Click **Settings** button (gear icon)
3. Enter:
   - **API URL**: `https://hermes-vm.tail5e4a2f.ts.net`
   - **API Token**: `LCYwG2URBHUvYP0i9qheby4vFrU7eu1o3iYigg5xM2ey5TStSInAMcVW52IEqI2U`
4. Click **Save & Reload**

### Option 2: Via Browser Console

Open `http://localhost:3001`, press F12, and paste:

```javascript
localStorage.setItem('engine_api_url', 'https://hermes-vm.tail5e4a2f.ts.net');
localStorage.setItem('engine_api_token', 'LCYwG2URBHUvYP0i9qheby4vFrU7eu1o3iYigg5xM2ey5TStSInAMcVW52IEqI2U');
window.location.reload();
```

### Option 3: Test API Manually

```javascript
// In browser console
const token = 'LCYwG2URBHUvYP0i9qheby4vFrU7eu1o3iYigg5xM2ey5TStSInAMcVW52IEqI2U';

fetch('https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

---

## Expected Results

When connected, you should see:
- **1 qualified lead** (already contacted)
- **0 WhatsApp queue** (lead already contacted)
- **0 new leads**
- **1 contacted lead**

---

## Next Steps

After configuring:
1. ✅ Dashboard will load real data
2. ✅ All endpoints will work
3. ✅ WhatsApp queue will show pending leads
4. ✅ Activity timeline will populate
