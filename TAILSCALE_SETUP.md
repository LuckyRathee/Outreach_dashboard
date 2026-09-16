# Tailscale Funnel Setup Guide

## Current Issue

Your Tailscale funnel endpoint `https://hermes-vm.tail5e4a2f.ts.net` is **not responding**.

This guide will help you set up the funnel correctly.

---

## Step 1: Check Tailscale Status on Server

SSH into your server (or access it directly) and run:

```bash
# Check Tailscale status
sudo tailscale status

# Should show something like:
# 100.x.x.x   hermes-vm   your-user@  linux -
```

---

## Step 2: Enable Funnel

On your server:

```bash
# Enable HTTPS funnel on port 8000
sudo tailscale funnel 8000

# Or for specific port
sudo tailscale funnel --bg 8000
```

This will:
- Generate a public HTTPS URL
- Forward traffic from `https://hermes-vm.tail5e4a2f.ts.net` to `http://localhost:8000`

---

## Step 3: Start Your Engine API

On the server:

```bash
# Navigate to your engine directory
cd /path/to/website-outreach-engine

# Start the API
uvicorn api.main:app --host 0.0.0.0 --port 8000

# Or if using a different command
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000
```

---

## Step 4: Verify Funnel is Working

### From Your Server

```bash
# Test local connection
curl http://localhost:8000/health

# Should return:
# {"status":"ok"}
```

### From Your Local Machine

```bash
# Test funnel connection
curl https://hermes-vm.tail5e4a2f.ts.net/health

# Should return:
# {"status":"ok"}
```

---

## Step 5: Update Dashboard Configuration

Once funnel is working:

1. Open dashboard: `http://localhost:5173`
2. Enter API URL: `https://hermes-vm.tail5e4a2f.ts.net`
3. Enter API Token: (your token from the engine)
4. Click **Connect to API**

---

## Troubleshooting

### Funnel Not Starting

```bash
# Check if port is already in use
sudo lsof -i :8000

# Kill process if needed
sudo kill -9 <PID>

# Restart funnel
sudo tailscale funnel --bg 8000
```

### Permission Denied

```bash
# Make sure you're using sudo
sudo tailscale funnel 8000
```

### Already Running

```bash
# Check what's running on port 443 (HTTPS)
sudo tailscale funnel status

# Stop existing funnel
sudo tailscale funnel --stop

# Start fresh
sudo tailscale funnel --bg 8000
```

### Firewall Issues

```bash
# On the server, allow port 8000
sudo ufw allow 8000
```

---

## Permanent Setup (Recommended)

### Create a systemd service for the engine API

```bash
# Create service file
sudo nano /etc/systemd/system/engine-api.service
```

Add:

```ini
[Unit]
Description=Digital Patron Engine API
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/website-outreach-engine
ExecStart=/usr/bin/python -m uvicorn api.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable engine-api
sudo systemctl start engine-api

# Check status
sudo systemctl status engine-api
```

### Create a systemd service for Tailscale funnel

```bash
# Create service file
sudo nano /etc/systemd/system/tailscale-funnel.service
```

Add:

```ini
[Unit]
Description=Tailscale Funnel
After=network.target tailscaled.service
Requires=tailscaled.service

[Service]
Type=simple
ExecStart=/usr/bin/tailscale funnel --bg 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:

```bash
# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable tailscale-funnel
sudo systemctl start tailscale-funnel

# Check status
sudo systemctl status tailscale-funnel
```

---

## Quick Check Commands

Run these on your server:

```bash
# 1. Check Tailscale is running
sudo systemctl status tailscaled

# 2. Check engine API is running
curl http://localhost:8000/health

# 3. Check funnel is active
sudo tailscale funnel status

# 4. Test external access
curl https://hermes-vm.tail5e4a2f.ts.net/health
```

---

## Expected Output

When everything is working:

```bash
$ curl https://hermes-vm.tail5e4a2f.ts.net/health

{"status":"ok"}
```

```bash
$ curl https://hermes-vm.tail5e4a2f.ts.net/api/v1/dashboard/metrics
{
  "emails_sent_today": 10,
  "whatsapp_queue_count": 5,
  "followups_due_today": 3,
  ...
}
```

---

## Next Steps

1. ✅ SSH into your server
2. ✅ Start the Engine API: `uvicorn api.main:app --host 0.0.0.0 --port 8000`
3. ✅ Enable funnel: `sudo tailscale funnel --bg 8000`
4. ✅ Test: `curl https://hermes-vm.tail5e4a2f.ts.net/health`
5. ✅ Update dashboard with the URL

---

## Need Help?

If you see errors, share:
- Output of `sudo systemctl status tailscaled`
- Output of `curl http://localhost:8000/health` (on server)
- Output of `sudo tailscale funnel status`
