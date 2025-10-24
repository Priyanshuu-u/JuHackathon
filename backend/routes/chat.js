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

console.log('Startup: OPENAI_API_KEY present?:', !!OPENAI_API_KEY);
console.log('Startup: GEMINI_API_KEY present?:', !!GEMINI_API_KEY);

/**
 * Helper: call Gemini REST API using server-side API key (updated payload to avoid invalid fields)
 */
async function callGemini(message) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');

  const modelSegment = encodeURIComponent(GEMINI_MODEL.split('/').pop());
  const url = `${GEMINI_API_BASE}/models/${modelSegment}:generateContent`;

  // Use the body shape that the generative API expects for generateContent
  const body = {
    contents: [
      {
        parts: [{ text: message }]
      }
    ]
    // NOTE: removed temperature / maxOutputTokens here because they caused INVALID_ARGUMENT errors.
    // If you need generation controls, verify the correct parameter names for your API version
    // and add them in the exact shape the docs require.
  };

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': GEMINI_API_KEY
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

  const candidate = data?.candidates?.[0];
  let reply = null;
  if (candidate) {
    if (typeof candidate.output === 'string') {
      reply = candidate.output;
    } else if (candidate.content && Array.isArray(candidate.content)) {
      reply = candidate.content.map((c) => (c?.text ?? c?.output ?? JSON.stringify(c))).join('\n');
    } else if (typeof candidate.text === 'string') {
      reply = candidate.text;
    }
  }

  if (!reply) {
    reply =
      data?.result?.[0]?.content ||
      (Array.isArray(data?.outputs) && data.outputs[0]) ||
      JSON.stringify(data);
  }

  return reply;
}

/**
 * POST /api/chat
 * Tries OpenAI first; on quota (429) falls back to Gemini.
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
          // Non-quota OpenAI error: return info to client
          return res.status(500).json({ error: 'AI service error', details: { status, data } });
        }

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
