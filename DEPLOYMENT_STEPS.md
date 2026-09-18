# Deployment Steps

## Quick Deploy (Drag & Drop)
1. Open the `dist` folder: `D:\HermesDEmos\dashboard\dist`
2. Go to https://app.netlify.com/drop
3. Drag the entire `dist` folder onto the page

## After Deployment

### Check the Console
1. Open https://dp-dashboad.netlify.app
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Navigate to WhatsApp Queue page
5. Look for messages starting with `📱` to see:
   - Raw API response
   - Items count
   - First item structure
   - Transformed items
   - Final queue

### What to Report Back
1. **Raw Response** - What does the API return?
2. **First Item Structure** - What fields does it have?
3. **Transformed Items** - Are the WhatsApp URLs showing?
4. **Any Error Messages** - Red error messages in console

## Alternative: Use Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
