export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const newsApiKey = process.env.NEWS_API_KEY;
  if (!newsApiKey) {
    return res.status(500).json({ error: 'News API key not configured' });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=es&sortBy=publishedAt&pageSize=20&apiKey=${newsApiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error('NewsAPI Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from NewsAPI' });
  }
}
