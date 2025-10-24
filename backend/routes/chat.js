import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// OpenAI config
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Gemini config (for fallback)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';

console.log('Startup: OPENAI_API_KEY present?:', !!OPENAI_API_KEY);
console.log('Startup: GEMINI_API_KEY present?:', !!GEMINI_API_KEY);

/** minimal extractor copied from gemini route to keep consistent behaviour */
function extractTextFromGeminiResponse(data) {
  if (!data) return null;
  const candidate = data?.candidates?.[0];
  if (candidate) {
    if (typeof candidate.output === 'string') return candidate.output.trim();
    const content = candidate.content;
    if (content) {
      if (Array.isArray(content)) {
        return content.map(c => (typeof c === 'string' ? c : c?.text ?? c?.output ?? JSON.stringify(c))).join('\n').trim();
      }
      if (content?.parts && Array.isArray(content.parts)) return content.parts.map(p => p?.text ?? p?.output ?? JSON.stringify(p)).join('').trim();
      if (typeof content.text === 'string') return content.text.trim();
      if (typeof content.output === 'string') return content.output.trim();
      return JSON.stringify(content);
    }
    if (typeof candidate.text === 'string') return candidate.text.trim();
  }
  if (Array.isArray(data?.outputs) && typeof data.outputs[0] === 'string') return data.outputs[0].trim();
  if (Array.isArray(data?.result) && data.result[0]?.content) {
    const resContent = data.result[0].content;
    if (Array.isArray(resContent)) return resContent.map(c => c?.text ?? c?.output ?? JSON.stringify(c)).join('\n').trim();
    return JSON.stringify(resContent);
  }
  return JSON.stringify(data);
}

/** call Gemini (used as fallback) */
async function callGemini(message) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');
  const modelSegment = encodeURIComponent(GEMINI_MODEL.split('/').pop());
  const url = `${GEMINI_API_BASE}/models/${modelSegment}:generateContent`;
  const body = { contents: [{ parts: [{ text: message }] }] };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY },
    body: JSON.stringify(body)
  });

  const data = await r.json();
  if (!r.ok) {
    const err = new Error('Gemini upstream error');
    err.status = r.status;
    err.data = data;
    throw err;
  }
  return extractTextFromGeminiResponse(data) ?? JSON.stringify(data);
}

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
        const status = err?.response?.status;
        const data = err?.response?.data ?? err?.message ?? String(err);
        console.error('/api/chat OpenAI error - status:', status, 'data:', data);

        const isQuotaError =
          status === 429 ||
          (typeof data === 'string' && data.toLowerCase().includes('quota')) ||
          (data && data?.message && typeof data.message === 'string' && data.message.toLowerCase().includes('quota'));

        if (!isQuotaError) {
          return res.status(500).json({ error: 'AI service error', details: { status, data } });
        }
        console.log('Falling back to Gemini due to OpenAI quota error');
      }
    } else {
      console.log('OPENAI_API_KEY not set; using Gemini (if configured)');
    }

    // Gemini fallback
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
