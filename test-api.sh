#!/bin/bash
# Test your Engine API connection

echo "🔍 Testing Engine API Connection..."
echo ""

# Get stored values
API_URL=$(cat ~/.local/share/hermes/dashboard-api-url.txt 2>/dev/null || echo "http://localhost:8000")
API_TOKEN=""

echo "API URL: $API_URL"
echo ""

# Test health endpoint
echo "Testing /health endpoint..."
curl -s -f "$API_URL/health" && echo "✅ Health check passed!" || echo "❌ Health check failed"

echo ""

# Test with auth
if [ ! -z "$API_TOKEN" ]; then
  echo "Testing /api/v1/dashboard/metrics with token..."
  curl -s -f -H "Authorization: Bearer $API_TOKEN" "$API_URL/api/v1/dashboard/metrics" | head -c 200
  echo ""
fi

echo ""
echo "💡 If tests fail, check:"
echo "  1. Is your Engine API running?"
echo "  2. Is the URL correct?"
echo "  3. Is the token valid?"
