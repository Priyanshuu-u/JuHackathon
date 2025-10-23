import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const apiKey = process.env.OPENAI_API_KEY;
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

    console.log('[api/chat] incoming message:', message);

    const messages = [
      { role: 'system', content: 'You are Aarogyam Assistant. Provide concise, medically-sensible guidance and triage advice. Use disclaimers where appropriate.' },
      { role: 'user', content: message }
    ];

    // Using the modern OpenAI Node client (openai@4.x) interface
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
    console.error('/api/chat error:', err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'AI service error' });
  }
});

export default router;
