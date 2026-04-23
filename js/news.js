// ─── MODELO ───────────────────────────────────────────────────────────────
const NewsModel = {
  fallbackNews: [
    {
      titulo: "Fed mantiene tasas altas: el dólar se fortalece frente a monedas emergentes",
      region: "ECONOMÍA",
      impacto: "ALTO",
      impacto_colombia: "El peso colombiano se deprecia, encareciendo importaciones de alimentos, maquinaria y medicamentos.",
      tags: ["Dólar", "Inflación", "Fed"],
      destacada: true
    },
    {
      titulo: "Conflicto en Medio Oriente dispara precio del petróleo por encima de $90",
      region: "GUERRA",
      impacto: "ALTO",
      impacto_colombia: "La gasolina interna subirá en el próximo ajuste del ACPM y la gasolina corriente.",
      tags: ["Petróleo", "Ecopetrol", "Energía"],
      destacada: false
    },
    {
      titulo: "El Niño intenso arasa cultivos en Sudamérica: escasez de alimentos se acerca",
      region: "CLIMA",
      impacto: "ALTO",
      impacto_colombia: "Sequías en la Costa Atlántica y el Meta reducen cosechas de arroz y maíz.",
      tags: ["El Niño", "Agricultura", "Alimentos"],
      destacada: false
    },
    {
      titulo: "China reduce importaciones de café: Vietnam gana terreno en Asia",
      region: "COMERCIO",
      impacto: "MEDIO",
      impacto_colombia: "Los caficultores del Eje Cafetero verán sus ingresos reducidos.",
      tags: ["Café", "FNC", "Exportaciones"],
      destacada: false
    },
    {
      titulo: "Inflación en Colombia se ubica en 9.28% anual, superando expectativas",
      region: "ECONOMÍA",
      impacto: "ALTO",
      impacto_colombia: "El costo de vida sigue elevado, afectando el poder adquisitivo de los colombianos.",
      tags: ["Inflación", "DANE", "Economía"],
      destacada: false
    },
    {
      titulo: "Ecopetrol anuncia nueva inversión en proyectos de energía límpia",
      region: "ECONOMÍA",
      impacto: "MEDIO",
      impacto_colombia: "Se espera la creación de nuevos empleos en el sector energético colombiano.",
      tags: ["Ecopetrol", "Energía", "Empleo"],
      destacada: false
    },
    {
      titulo: "Dólar supera los $4,200 pesos tras declaraciones de la Fed",
      region: "ECONOMÍA",
      impacto: "ALTO",
      impacto_colombia: "Las importaciones serán más costosas, afectando precios de electrodomésticos y tecnología.",
      tags: ["Dólar", "TRM", "Importaciones"],
      destacada: false
    },
    {
      titulo: "Aumento en el precio de los fertilizantes impacta al sector agrícola",
      region: "ECONOMÍA",
      impacto: "MEDIO",
      impacto_colombia: "Los agricultores enfrentan mayores costos de producción que se trasladarán al consumidor.",
      tags: ["Agricultura", "Fertilizantes", "Precios"],
      destacada: false
    },
    {
      titulo: "La bolsa colombiana cae por tensiones geopolíticas internacionales",
      region: "ECONOMÍA",
      impacto: "MEDIO",
      impacto_colombia: "Inversores pierden confianza, afectando fondos de pensiones y ahorros.",
      tags: ["Bolsa", "Colcap", "Inversión"],
      destacada: false
    },
    {
      titulo: "Sequía en el canal de Panamá afecta exportaciones colombianas",
      region: "COMERCIO",
      impacto: "MEDIO",
      impacto_colombia: "Fletes marítimos más caros y retrasos en envíos de flores, café y banano.",
      tags: ["Canal de Panamá", "Exportaciones", "Fletes"],
      destacada: false
    },
    {
      titulo: "Gobierno anuncia subsidios para mitigar el alto costo de vida",
      region: "ECONOMÍA",
      impacto: "MEDIO",
      impacto_colombia: "Familias de menores ingresos recibirán apoyo directo para alimentos.",
      tags: ["Gobierno", "Subsidios", "Ayuda social"],
      destacada: false
    },
    {
      titulo: "Aumentan casos de desnutrición infantil por alza de precios de alimentos",
      region: "CLIMA",
      impacto: "ALTO",
      impacto_colombia: "Programas de alimentación escolar enfrentan crisis presupuestal en varias regiones.",
      tags: ["Desnutrición", "Salud", "Alimentos"],
      destacada: false
    },
    {
      titulo: "Nuevas restricciones de visas afectan turismo y negocios en Colombia",
      region: "COMERCIO",
      impacto: "BAJO",
      impacto_colombia: "Menos turistas extranjeros visitarán Colombia, afectando hotelería y comercio.",
      tags: ["Visas", "Turismo", "Migración"],
      destacada: false
    },
    {
      titulo: "Cafeteros se adaptan al cambio climático con variedades resistentes",
      region: "CLIMA",
      impacto: "MEDIO",
      impacto_colombia: "Innovación en el campo ayuda a mantener la producción cafetera nacional.",
      tags: ["Café", "Cambio climático", "Innovación"],
      destacada: false
    },
    {
      titulo: "Colombia aumenta exportaciones de aguacate a Europa y Asia",
      region: "COMERCIO",
      impacto: "MEDIO",
      impacto_colombia: "Los agricultores colombianos diversifican sus mercados internacionales.",
      tags: ["Aguacate", "Exportaciones", "Agricultura"],
      destacada: false
    }
  ],

  clasificar(titulo) {
    const t = (titulo || "").toLowerCase();

    if (t.match(/guerra|conflicto|ataque|militar|bomba|misil/))
      return { region: "GUERRA", impacto: "ALTO" };

    if (t.match(/precio|inflaci|econom|dólar|banco|fed|mercado|bolsa/))
      return { region: "ECONOMÍA", impacto: "ALTO" };

    if (t.match(/clima|sequía|inundaci|huracán|temblor|terremoto/))
      return { region: "CLIMA", impacto: "MEDIO" };

    if (t.match(/comercio|exportaci|importaci|arancel|trade/))
      return { region: "COMERCIO", impacto: "MEDIO" };

    return { region: "ECONOMÍA", impacto: "BAJO" };
  },

  impactosColombia: {
    GUERRA:
      "Los conflictos globales afectan los precios del petróleo y generan incertidumbre en los mercados colombianos.",
    ECONOMÍA:
      "Las variaciones económicas mundiales impactan directamente el peso colombiano y el costo de las importaciones.",
    CLIMA:
      "Los fenómenos climáticos globales afectan la producción agrícola y los precios de alimentos en Colombia.",
    COMERCIO:
      "Los cambios en el comercio mundial afectan las exportaciones colombianas de café, petróleo y carbón."
  }
};

// ─── VISTA ────────────────────────────────────────────────────────────────
const NewsView = {
  regionClass: {
    ECONOMÍA: "economy",
    GUERRA: "war",
    CLIMA: "climate",
    COMERCIO: "trade"
  },

  impactoClass: {
    ALTO: "impact-high",
    MEDIO: "impact-medium",
    BAJO: "impact-low"
  },

  impactoIcon: {
    ALTO: "⬆ ALTO",
    MEDIO: "→ MEDIO",
    BAJO: "⬇ BAJO"
  },

  showSkeletons() {
    const grid = document.getElementById("newsGrid");

    if (!grid) return;

    grid.innerHTML = `
      <div class="loading-card">
        <div class="skeleton" style="height:12px;width:30%"></div>
        <div class="skeleton" style="height:20px;width:80%"></div>
        <div class="skeleton" style="height:14px;width:100%"></div>
        <div class="skeleton" style="height:14px;width:70%"></div>
      </div>
      <div class="loading-card">
        <div class="skeleton" style="height:12px;width:25%"></div>
        <div class="skeleton" style="height:20px;width:90%"></div>
        <div class="skeleton" style="height:14px;width:100%"></div>
        <div class="skeleton" style="height:14px;width:60%"></div>
      </div>`;
  },

  formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  },

  render(noticias) {
    const grid = document.getElementById("newsGrid");

    if (!grid) return;

    grid.innerHTML = "";

    noticias.forEach((n, i) => {
      const card = document.createElement("div");

      card.className = `news-card ${n.destacada ? "featured" : ""}`;
      card.style.animationDelay = `${i * 0.08}s`;

      card.innerHTML = `
        <div class="card-meta">
          <span class="card-region ${this.regionClass[n.region] || ""}">
            ${n.region}
          </span>

          <span class="card-impact ${this.impactoClass[n.impacto] || ""}">
            ${this.impactoIcon[n.impacto]}
          </span>

          ${n.fecha ? `<span class="card-date">${this.formatDate(n.fecha)}</span>` : ""}
        </div>

        <div class="card-title">${n.titulo}</div>

        <div class="card-colombia">
          🇨🇴 <strong>Colombia:</strong> ${n.impacto_colombia}
        </div>

        <div class="card-tags">
          ${(n.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
      `;

      card.onclick = () => {
        if (typeof AssistantController !== "undefined") {
          AssistantController.askQuick(
            `Cuéntame más sobre: "${n.titulo}" y su impacto en Colombia`
          );
        }
      };

      grid.appendChild(card);
    });
  }
};

// ─── CONTROLADOR ──────────────────────────────────────────────────────────
const NewsController = {
  async load() {
    NewsView.showSkeletons();

    try {
      const queries = [
        "economia colombia",
        "precio petroleo",
        "inflacion latinoamerica",
        "exportaciones colombia",
        "crisis financiera mundial"
      ];

      const query = queries[Math.floor(Math.random() * queries.length)];

      const url =
        `${CONFIG.NEWS_URL}?q=${encodeURIComponent(query)}` +
        `&language=es&sortBy=publishedAt&pageSize=20&apiKey=${CONFIG.NEWS_API_KEY}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "ok" || !data.articles?.length) {
        throw new Error("Sin artículos");
      }

      const noticias = data.articles
        .filter(a => a.title)
        .slice(0, 15)
        .map((art, i) => {
          const { region, impacto } = NewsModel.clasificar(art.title);

          return {
            titulo: art.title,
            region,
            impacto,
            impacto_colombia: NewsModel.impactosColombia[region],
            tags: [art.source?.name || "Internacional"],
            destacada: i === 0,
            fecha: art.publishedAt
          };
        });

      NewsView.render(noticias);
    } catch (err) {
      console.warn("Error cargando noticias:", err);
      NewsView.render(NewsModel.fallbackNews);
    }
  }
};