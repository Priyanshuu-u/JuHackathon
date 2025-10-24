import express from 'express';

const router = express.Router();

// Configuration from environment
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'; // just the model id segment is fine
const API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';

console.log('GEMINI_API_KEY present?:', !!API_KEY);
if (!API_KEY) {
  console.warn('GEMINI_API_KEY not set; /api/gemini will fail until configured');
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

    // Build URL for generateContent (we will use X-goog-api-key header)
    const modelSegment = encodeURIComponent(MODEL.split('/').pop());
    const url = `${API_BASE}/models/${modelSegment}:generateContent`;

    // Use the request body shape that your working curl used: contents -> parts -> text
    const body = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ]
      // NOTE: removed temperature/maxOutputTokens here because this API surface (generateContent)
      // returned "Unknown name" errors for those fields in your logs.
      // If you later want to pass generation controls, consult the exact API version docs
      // and add the allowed fields in the correct names/structure.
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Prefer sending API key in header; some keys also accept ?key= in URL if you prefer
        'X-goog-api-key': API_KEY
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();

    if (!r.ok) {
      console.error('/api/gemini upstream error:', r.status, data);
      return res.status(500).json({ error: 'Gemini API error', status: r.status, details: data });
    }

    // Extract likely reply shapes:
    // - data.candidates[0].output (string)
    // - data.candidates[0].content -> array of parts with .text
    // - other shapes: fall back to stringifying response
    const candidate = data?.candidates?.[0];
    let reply = null;
    if (candidate) {
      if (typeof candidate.output === 'string') {
        reply = candidate.output;
      } else if (candidate.content && Array.isArray(candidate.content)) {
        // join any text segments into a single string
        reply = candidate.content.map((c) => (c?.text ?? c?.output ?? JSON.stringify(c))).join('\n');
      } else if (typeof candidate.text === 'string') {
        reply = candidate.text;
      }
    }

    if (!reply) {
      // fallback: try older/other fields
      reply =
        data?.result?.[0]?.content ||
        (Array.isArray(data?.outputs) && data.outputs[0]) ||
        JSON.stringify(data);
    }

    return res.json({ reply });
  } catch (err) {
    console.error('/api/gemini error:', err);
    return res.status(500).json({ error: 'Gemini service error', details: err?.message ?? String(err) });
  }
});

export default router;
