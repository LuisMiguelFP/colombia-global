export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const groqApiKey = process.env.GROQ_API_KEY;  
  if (!groqApiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const body = req.body;
    
    // Asegurar que solo hay texto plano en los mensajes
    if (body.messages) {
      body.messages = body.messages.map(msg => ({
        role: msg.role,
        content: String(msg.content || '')
      }));
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Groq API' });
  }
}
