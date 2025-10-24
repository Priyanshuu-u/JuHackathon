import express from 'express';

const router = express.Router();

// Configuration from environment
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'models/gemini-2.0-flash'; // change if needed
const API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';

// NOTE: Do not log the secret value itself in production.
console.log('GEMINI_API_KEY present?:', !!API_KEY);
if (!API_KEY) {
  console.warn('GEMINI_API_KEY not set; /api/gemini will fail until configured');
}
if (!MODEL) {
  console.warn('GEMINI_MODEL not set; using default:', MODEL);
}

/**
 * POST /api/gemini
 * body: { message: "..." }
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message (string) is required in request body' });
    }

    // Build URL: e.g.
    // https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY
    const url = `${API_BASE}/models/${encodeURIComponent(MODEL.split('/').pop())}:generateContent?key=${encodeURIComponent(API_KEY)}`;

    // Request body shape for generateContent: use "contents" array with parts -> text
    const body = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ],
      // Optional generation parameters - adjust as desired
      // Note: different API versions may use different names for parameters
      // (e.g., temperature / maxOutputTokens). Adjust based on responses.
      temperature: 0.2,
      maxOutputTokens: 600
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // If your API key method requires X-goog-api-key, uncomment next line and remove key param in URL.
        // 'X-goog-api-key': API_KEY
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();

    if (!r.ok) {
      console.error('/api/gemini upstream error:', r.status, data);
      return res.status(500).json({ error: 'Gemini API error', status: r.status, details: data });
    }

    // Typical response contains candidates with generated text, e.g.:
    // { candidates: [ { output: "..." }, ... ] }
    // Or the response may vary by API version - try common keys:
    const candidateOutput =
      data?.candidates?.[0]?.output ||
      data?.candidates?.[0]?.content ||
      data?.candidates?.[0]?.text ||
      data?.result?.[0]?.content ||
      (Array.isArray(data?.outputs) && data.outputs[0]) ||
      null;

    const reply = candidateOutput ?? JSON.stringify(data);

    return res.json({ reply });
  } catch (err) {
    console.error('/api/gemini error:', err);
    return res.status(500).json({ error: 'Gemini service error', details: err?.message ?? String(err) });
  }
});

export default router;
