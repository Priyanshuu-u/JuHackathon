import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// NOTE: this logs only presence, not the key value.
const apiKey = process.env.OPENAI_API_KEY;
console.log('Startup: OPENAI_API_KEY present?:', !!apiKey);
if (!apiKey) {
  console.warn('OPENAI_API_KEY not set; /api/chat will fail until configured');
}
const openai = new OpenAI({ apiKey });

router.post('/', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message (string) is required in request body' });
    }

    console.log('[api/chat] incoming message (truncated):', message.slice(0, 200));

    const messages = [
      { role: 'system', content: 'You are Aarogyam Assistant. Provide concise, medically-sensible guidance and triage advice. Use disclaimers where appropriate.' },
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.2,
      max_tokens: 600
    });

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a response.';

    return res.json({ reply });
  } catch (err) {
    // Log richer debug info (DO NOT log the API key). This prints status and body from OpenAI if present.
    const status = err?.response?.status;
    const data = err?.response?.data;
    console.error('/api/chat error - status:', status, 'data:', data ?? err?.message ?? err);

    // For debugging, return the status/data from upstream (safe to reveal for now).
    // Remove or reduce this before production to avoid leaking provider details.
    return res.status(500).json({
      error: 'AI service error',
      details: data ? { status, data } : { message: err?.message }
    });
  }
});

export default router;
