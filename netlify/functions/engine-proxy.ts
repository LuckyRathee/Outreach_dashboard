import { Handler } from '@netlify/functions';

// Allowed endpoints: method + path pattern
const ALLOWED_ENDPOINTS = [
  { method: 'GET', pattern: /^\/health$/ },
  { method: 'GET', pattern: /^\/api\/v1\/dashboard\/metrics$/ },
  { method: 'GET', pattern: /^\/api\/v1\/leads$/ },
  { method: 'GET', pattern: /^\/api\/v1\/leads\/[^/]+$/ },
  { method: 'GET', pattern: /^\/api\/v1\/outreach\/whatsapp-queue$/ },
  { method: 'GET', pattern: /^\/api\/v1\/leads\/[^/]+\/outreach-draft$/ },
  { method: 'GET', pattern: /^\/api\/v1\/followups$/ },
  { method: 'GET', pattern: /^\/api\/v1\/activity$/ },
  { method: 'GET', pattern: /^\/api\/v1\/leads\/[^/]+\/activity$/ },
  { method: 'POST', pattern: /^\/api\/v1\/sync$/ },
  { method: 'POST', pattern: /^\/api\/v1\/leads\/[^/]+\/whatsapp\/opened$/ },
  { method: 'POST', pattern: /^\/api\/v1\/leads\/[^/]+\/whatsapp\/mark-sent$/ },
  { method: 'POST', pattern: /^\/api\/v1\/followups\/[^/]+\/complete$/ },
  { method: 'POST', pattern: /^\/api\/v1\/followups\/[^/]+\/snooze$/ },
  { method: 'POST', pattern: /^\/api\/v1\/leads\/[^/]+\/outreach\/approve$/ },
  { method: 'POST', pattern: /^\/api\/v1\/leads\/[^/]+\/outreach\/reject$/ },
  { method: 'POST', pattern: /^\/api\/v1\/leads\/[^/]+\/email\/send$/ },
];

const REQUEST_TIMEOUT = 30000; // 30 seconds

function isAllowedEndpoint(method: string, path: string): boolean {
  return ALLOWED_ENDPOINTS.some(
    endpoint => endpoint.method === method && endpoint.pattern.test(path)
  );
}

export const handler: Handler = async (event) => {
  const { httpMethod, path, queryStringParameters, body, headers } = event;

  // Get configuration from environment
  const engineApiBaseUrl = process.env.ENGINE_API_BASE_URL;
  const engineApiToken = process.env.ENGINE_API_TOKEN;

  if (!engineApiBaseUrl || !engineApiToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Server configuration error',
        message: 'Engine API not configured'
      }),
    };
  }

  // Validate endpoint is allowed
  if (!isAllowedEndpoint(httpMethod, path)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ 
        error: 'Forbidden',
        message: 'Endpoint not allowed'
      }),
    };
  }

  // Build target URL
  const targetUrl = `${engineApiBaseUrl}${path}${
    queryStringParameters 
      ? '?' + new URLSearchParams(queryStringParameters).toString() 
      : ''
  }`;

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    // Forward request to engine
    const response = await fetch(targetUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${engineApiToken}`,
      },
      body: body || undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Get response body
    const responseBody = await response.text();

    // Return response to browser
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: responseBody,
    };

  } catch (error: any) {
    // Handle specific errors
    if (error.name === 'AbortError') {
      return {
        statusCode: 504,
        body: JSON.stringify({ 
          error: 'Gateway Timeout',
          message: 'Engine API request timed out'
        }),
      };
    }

    // Network errors
    if (error.cause?.code === 'ECONNREFUSED' || error.cause?.code === 'ENOTFOUND') {
      return {
        statusCode: 502,
        body: JSON.stringify({ 
          error: 'Bad Gateway',
          message: 'Engine API unavailable'
        }),
      };
    }

    // Generic error
    console.error('Proxy error:', error.message);
    return {
      statusCode: 502,
      body: JSON.stringify({ 
        error: 'Bad Gateway',
        message: 'Failed to communicate with Engine API'
      }),
    };
  }
};
