const CONFIG = {
  // Groq API - asistente IA
  API_URL: "https://api.groq.com/openai/v1/chat/completions",
  API_KEY: "", // Configurar via variable de entorno en Vercel
  MODEL:   "llama-3.3-70b-versatile",
  HEADERS: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + (window.GROQ_API_KEY || "")
  },

  // NewsAPI - noticias reales
  NEWS_API_KEY: "", // Configurar en Vercel
  NEWS_URL: "https://newsapi.org/v2/everything",

  ALPHA_KEY: "", // Configurar en Vercel
  ALPHA_URL: "https://www.alphavantage.co/query"

};
