export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }
  const { message } = req.body || {};

  // YAHAN APNI AQ WALI KEY DALEIN
  const API_KEY = "AQ.Ab8RN6LAyCcBhqsWsEP0NhztxRy0M5wVg4KTrbFdeARBoLeLOQ";

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });
    const data = await resp.json();
    if (data.error) {
      return res.json({ reply: "Error: " + data.error.message });
    }
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Jawab nahi mila";
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ reply: "Server Error: " + e.message });
  }
}
