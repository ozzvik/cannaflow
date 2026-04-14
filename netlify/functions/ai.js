exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: '{}' };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'GEMINI_API_KEY חסר' }) };

  const { system, messages } = JSON.parse(event.body || '{}');

  // Build contents — inject system as first user message
  const contents = [];
  if (system) {
    contents.push({ role: 'user',  parts: [{ text: `הוראות מערכת:\n${system}` }] });
    contents.push({ role: 'model', parts: [{ text: 'הבנתי, אפעל לפי ההוראות.' }] });
  }
  for (const m of (messages || [])) {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
      }),
    });

    const data = await res.json();

    if (!res.ok) return {
      statusCode: res.status, headers: cors,
      body: JSON.stringify({ error: data.error?.message || 'שגיאת Gemini' }),
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'אין תגובה';
    return {
      statusCode: 200, headers: cors,
      body: JSON.stringify({ content: [{ type: 'text', text }] }),
    };
  } catch (err) {
    return { statusCode: 502, headers: cors, body: JSON.stringify({ error: err.message }) };
  }
};
