#!/bin/bash

echo "🔍 Checking Tailscale Funnel Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test health endpoint
echo "Testing health endpoint..."
if curl -s -f --max-time 10 https://hermes-vm.tail5e4a2f.ts.net/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Funnel is responding!${NC}"
    echo ""
    echo "Response:"
    curl -s https://hermes-vm.tail5e4a2f.ts.net/health | jq . 2>/dev/null || curl -s https://hermes-vm.tail5e4a2f.ts.net/health
else
    echo -e "${RED}❌ Funnel not responding${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. SSH into your server"
    echo "2. Check if Engine API is running:"
    echo "   curl http://localhost:8000/health"
    echo ""
    echo "3. Start Engine API if not running:"
    echo "   uvicorn api.main:app --host 0.0.0.0 --port 8000"
    echo ""
    echo "4. Enable Tailscale funnel:"
    echo "   sudo tailscale funnel --bg 8000"
    echo ""
    echo "5. Check funnel status:"
    echo "   sudo tailscale funnel status"
fi

echo ""
echo "📋 OS-specific instructions:"
echo ""

# Detect OS
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    echo "Windows detected. Run these commands on your SERVER (not locally):"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "macOS detected. Run these commands on your SERVER (not locally):"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux detected. If this IS your server, run:"
    echo "  sudo systemctl start engine-api"
    echo "  sudo tailscale funnel --bg 8000"
fi

echo ""
echo "Server commands:"
echo "  ssh user@hermes-vm"
echo "  curl http://localhost:8000/health"
echo "  sudo tailscale funnel --bg 8000"
