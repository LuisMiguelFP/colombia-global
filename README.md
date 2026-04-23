# Colombia Global - Pulso Mundial

Aplicación web que muestra noticias mundiales y su impacto en Colombia, con asistente IA, gráficos de precios y simulador de inversión.

## Características

- 📰 Noticias en tiempo real con fechas e impacto en Colombia
- 🤖 Asistente IA con Groq API (llama3-8b-8192) - sin consumir recursos locales
- 📊 Gráficos de barras y circulares de precios (Dólar, Gasolina, Alimentos)
- 💹 Simulador de inversión con predicciones en tiempo real
- ▲ Despliegue fácil en Vercel

## Despliegue en Vercel (Recomendado)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repositorio GitHub
3. La configuración `vercel.json` ya está incluida
4. ¡Listo! Vercel detectará automáticamente la configuración

## Despliegue con Docker

### Localmente
```bash
docker-compose up -d
```
La aplicación estará en `http://localhost:8080`

## Estructura

```
├── index.html          # Página principal
├── css/styles.css      # Estilos
├── js/
│   ├── config.js      # Configuración y APIs (Groq, NewsAPI, Alpha Vantage)
│   ├── news.js        # Noticias con fechas
│   ├── assistant.js   # Asistente IA (Groq API)
│   ├── charts.js      # Gráficos de barras y pastel
│   ├── simulator.js   # Simulador de inversión
│   └── prices.js      # Precios
├── vercel.json        # Configuración Vercel
├── Dockerfile         # Configuración Docker
└── docker-compose.yml # Orquestación
```

## APIs Utilizadas

- [Groq API](https://console.groq.com) - Modelo de IA en la nube
- [NewsAPI](https://newsapi.org) - Noticias en tiempo real
- [Alpha Vantage](https://www.alphavantage.co) - Datos financieros

## Configuración

Edita `js/config.js` para cambiar:
- API_KEY: Tu clave de Groq
- NEWS_API_KEY: Tu clave de NewsAPI
- ALPHA_KEY: Tu clave de Alpha Vantage

