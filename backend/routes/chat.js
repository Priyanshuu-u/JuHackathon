import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn('OPENAI_API_KEY not set; /api/chat will fail until configured');
}
const configuration = new Configuration({ apiKey });
const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message (string) is required in request body' });
    }

    const messages = [
      { role: 'system', content: 'You are Aarogyam Assistant. Provide concise, medically-sensible guidance and triage advice. Use disclaimers where appropriate.' },
      { role: 'user', content: message }
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.2,
      max_tokens: 600
    });

    const reply = completion?.data?.choices?.[0]?.message?.content?.trim() || 'I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error('/api/chat error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'AI service error' });
  }
});

export default router;
