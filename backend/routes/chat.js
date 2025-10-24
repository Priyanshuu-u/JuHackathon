import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// OpenAI config
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Gemini config (for fallback)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'; // last segment only
const GEMINI_API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';

// Log presence only (do NOT log secrets)
console.log('Startup: OPENAI_API_KEY present?:', !!OPENAI_API_KEY);
console.log('Startup: GEMINI_API_KEY present?:', !!GEMINI_API_KEY);

/**
 * Helper: call Gemini REST API using server-side API key
 */
async function callGemini(message) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');

  const modelSegment = encodeURIComponent(GEMINI_MODEL.split('/').pop());
  const url = `${GEMINI_API_BASE}/models/${modelSegment}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [
      {
        parts: [{ text: message }]
      }
    ],
    temperature: 0.2,
    maxOutputTokens: 600
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // If your key requires X-goog-api-key header instead, use:
      // 'X-goog-api-key': GEMINI_API_KEY
    },
    body: JSON.stringify(body)
  });

  const data = await r.json();
  if (!r.ok) {
    const err = new Error('Gemini upstream error');
    err.status = r.status;
    err.data = data;
    throw err;
  }

  // Extract common response shapes (adjust if your API returns different fields)
  const candidateOutput =
    data?.candidates?.[0]?.output ||
    data?.candidates?.[0]?.content ||
    data?.candidates?.[0]?.text ||
    data?.result?.[0]?.content ||
    (Array.isArray(data?.outputs) && data.outputs[0]) ||
    null;

  return candidateOutput ?? JSON.stringify(data);
}

/**
 * POST /api/chat
 * Tries OpenAI first; on quota (429) or quota message, falls back to Gemini.
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message (string) is required in request body' });
    }

    console.log('[api/chat] incoming message (truncated):', message.slice(0, 200));

    // Try OpenAI if configured
    if (OPENAI_API_KEY) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are Aarogyam Assistant. Provide concise, medically-sensible guidance and triage advice. Use disclaimers where appropriate.' },
            { role: 'user', content: message }
          ],
          temperature: 0.2,
          max_tokens: 600
        });

        const reply = completion?.choices?.[0]?.message?.content?.trim() || 'I could not generate a response.';
        return res.json({ reply });
      } catch (err) {
        // Inspect OpenAI error. If quota-related, fall back to Gemini.
        const status = err?.response?.status;
        const data = err?.response?.data ?? err?.message ?? String(err);
        console.error('/api/chat OpenAI error - status:', status, 'data:', data);

        const isQuotaError =
          status === 429 ||
          (typeof data === 'string' && data.toLowerCase().includes('quota')) ||
          (data && data?.message && typeof data.message === 'string' && data.message.toLowerCase().includes('quota'));

        if (!isQuotaError) {
          // Non-quota OpenAI error: return info to client (you can change this behavior)
          return res.status(500).json({ error: 'AI service error', details: { status, data } });
        }

        // else fall through to Gemini fallback
        console.log('Falling back to Gemini due to OpenAI quota error');
      }
    } else {
      console.log('OPENAI_API_KEY not set; using Gemini (if configured)');
    }

    // Gemini fallback (or primary if OpenAI absent)
    try {
      const geminiReply = await callGemini(message);
      return res.json({ reply: String(geminiReply) });
    } catch (gemErr) {
      console.error('/api/chat Gemini fallback error:', gemErr?.status ?? '', gemErr?.data ?? gemErr?.message ?? gemErr);
      return res.status(500).json({ error: 'AI service error', details: gemErr?.data ?? gemErr?.message ?? String(gemErr) });
    }
  } catch (err) {
    console.error('/api/chat unexpected error:', err);
    return res.status(500).json({ error: 'AI service error', details: err?.message ?? String(err) });
  }
});

export default router;
