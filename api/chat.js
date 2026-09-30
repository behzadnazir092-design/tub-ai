export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const message = body?.message;

    if (!message) {
      return res.status(400).json({ reply: 'Message missing hai' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ reply: 'Server Error: GEMINI_API_KEY missing hai' });
    }

    // Updated Model to gemini-2.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      })
    });

    const data = await resp.json();

    if (!resp.ok || data.error) {
      return res.status(resp.status || 500).json({
        reply: `Gemini Error: ${data.error?.message || 'API issue'}`
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Jawab nahi mila";
    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(500).json({ reply: "Server error: " + e.message });
  }
}
