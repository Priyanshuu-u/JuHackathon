import express from 'express';

const router = express.Router();

// Configuration from environment
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';

console.log('GEMINI_API_KEY present?:', !!API_KEY);
if (!API_KEY) {
  console.warn('GEMINI_API_KEY not set; /api/gemini will fail until configured');
}

/**
 * Helper to extract text from various Gemini response shapes
 */
function extractTextFromGeminiResponse(data) {
  if (!data) return null;

  // Common: candidates array
  const candidate = data?.candidates?.[0];
  if (candidate) {
    // candidate.output is sometimes a string
    if (typeof candidate.output === 'string' && candidate.output.trim()) {
      return candidate.output.trim();
    }

    // candidate.content may be an object with parts, or an array
    const content = candidate.content;
    if (content) {
      // if content is array
      if (Array.isArray(content)) {
        return content
          .map((c) => {
            if (typeof c === 'string') return c;
            if (c?.text) return c.text;
            if (c?.output) return c.output;
            if (c?.parts) return c.parts.map(p => p?.text ?? p?.output ?? JSON.stringify(p)).join('');
            return JSON.stringify(c);
          })
          .join('\n')
          .trim();
      }

      // if content is object with parts
      if (content?.parts && Array.isArray(content.parts)) {
        return content.parts.map(p => p?.text ?? p?.output ?? JSON.stringify(p)).join('').trim();
      }

      // fallback content.text or content.output
      if (typeof content.text === 'string') return content.text.trim();
      if (typeof content.output === 'string') return content.output.trim();
      return JSON.stringify(content);
    }

    // candidate.text
    if (typeof candidate.text === 'string') return candidate.text.trim();
  }

  // Some responses return `outputs` or `result`
  if (Array.isArray(data?.outputs) && typeof data.outputs[0] === 'string') {
    return data.outputs[0].trim();
  }
  if (Array.isArray(data?.result) && data.result[0]?.content) {
    // join parts in result[0].content if present
    const resContent = data.result[0].content;
    if (Array.isArray(resContent)) {
      return resContent.map(c => c?.text ?? c?.output ?? JSON.stringify(c)).join('\n').trim();
    }
    return JSON.stringify(resContent);
  }

  // As last resort, stringify the whole thing
  return JSON.stringify(data);
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

    // Build URL for generateContent and send API key in header
    const modelSegment = encodeURIComponent(MODEL.split('/').pop());
    const url = `${API_BASE}/models/${modelSegment}:generateContent`;

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
      // Keep payload minimal and compatible with generateContent surface
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();

    if (!r.ok) {
      console.error('/api/gemini upstream error:', r.status, data);
      return res.status(500).json({ error: 'Gemini API error', status: r.status, details: data });
    }

    const reply = extractTextFromGeminiResponse(data) ?? 'I could not generate a response.';
    // Return only the reply string to frontend
    return res.json({ reply });
  } catch (err) {
    console.error('/api/gemini error:', err);
    return res.status(500).json({ error: 'Gemini service error', details: err?.message ?? String(err) });
  }
});

export default router;
