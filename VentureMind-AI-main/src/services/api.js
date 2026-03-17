const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function post(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Main unified pipeline endpoint
  generateStartup: (payload) => post('/generate-startup', payload),

  // Legacy endpoints (optional, kept for compatibility)
  generateIdea: (payload) => post('/generate-idea', payload),
  marketAnalysis: (payload) => post('/market-analysis', payload),
  competitorAnalysis: (payload) => post('/competitor-analysis', payload),
  validateIdea: (payload) => post('/validate-idea', payload),
};
