// ─── MODELO ───────────────────────────────────────────────────────────────
const ChartsModel = {
  // Datos de respaldo por si falla la API
  fallback: {
    meses: {
      labels: ["Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic","Ene","Feb","Mar"],
      "Dólar (TRM)": [4100,4150,4200,4180,4250,4300,4280,4350,4400,4280,4320,4380],
      "Gasolina":    [8500,8800,9000,9200,9500,9800,10200,10500,10800,11000,11300,11600],
      "Alimentos":   [100,104,107,110,113,116,120,123,127,130,134,138]
    },
    años: {
      labels: ["2020","2021","2022","2023","2024","2025"],
      "Dólar (TRM)": [3550,3800,4500,4800,4200,4380],
      "Gasolina":    [7200,7800,9100,9800,10500,11600],
      "Alimentos":   [100,108,118,128,135,138]
    }
  },

  unidades: {
    "Gasolina":    "$/galón",
    "Dólar (TRM)": "$/USD",
    "Alimentos":   "índice base 100"
  },

  // Trae USD/COP mensual de Alpha Vantage
  async fetchDolar(periodo) {
    const outputsize = periodo === "meses" ? "compact" : "full";
    const url = `${CONFIG.ALPHA_URL}?function=FX_MONTHLY&from_symbol=USD&to_symbol=COP&apikey=${CONFIG.ALPHA_KEY}&outputsize=${outputsize}`;
    const res  = await fetch(url);
    const data = await res.json();
    const series = data["Time Series FX (Monthly)"];
    if (!series) throw new Error("Sin datos");

    const entradas = Object.entries(series)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]));

    const slice = periodo === "meses"
      ? entradas.slice(-12)
      : entradas.filter(([fecha]) => fecha.startsWith("202")).slice(-6);

    return {
      labels:  slice.map(([fecha]) => periodo === "meses"
        ? new Date(fecha).toLocaleString("es-CO", { month: "short" })
        : fecha.substring(0, 4)),
      valores: slice.map(([, v]) => parseFloat(parseFloat(v["4. close"]).toFixed(0)))
    };
  },

  // Trae precio del petróleo (proxy de gasolina) mensual
  async fetchGasolina(periodo) {
    const url = `${CONFIG.ALPHA_URL}?function=WTI&interval=monthly&apikey=${CONFIG.ALPHA_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    const series = data["data"];
    if (!series) throw new Error("Sin datos");

    const entradas = series
      .filter(d => d.value !== ".")
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const slice = periodo === "meses"
      ? entradas.slice(-12)
      : entradas.filter(d => d.date.startsWith("202")).slice(-6);

    // Convierte USD a pesos colombianos aproximado (×4200 + margen)
    return {
      labels:  slice.map(d => periodo === "meses"
        ? new Date(d.date).toLocaleString("es-CO", { month: "short" })
        : d.date.substring(0, 4)),
      valores: slice.map(d => Math.round(parseFloat(d.value) * 42 + 7000))
    };
  },

  // Trae índice CPI global (proxy de alimentos)
  async fetchAlimentos(periodo) {
    const url = `${CONFIG.ALPHA_URL}?function=CPI&interval=monthly&apikey=${CONFIG.ALPHA_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    const series = data["data"];
    if (!series) throw new Error("Sin datos");

    const entradas = series
      .filter(d => d.value !== ".")
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const slice = periodo === "meses"
      ? entradas.slice(-12)
      : entradas.filter(d => d.date.startsWith("202")).slice(-6);

    const base = parseFloat(slice[0]?.value || 100);

    return {
      labels:  slice.map(d => periodo === "meses"
        ? new Date(d.date).toLocaleString("es-CO", { month: "short" })
        : d.date.substring(0, 4)),
      valores: slice.map(d => parseFloat((parseFloat(d.value) / base * 100).toFixed(1)))
    };
  }
};

// ─── VISTA ────────────────────────────────────────────────────────────────
const ChartsView = {
  chart: null,

  colores: {
    "Gasolina":    { line: "#e8c547", fill: "rgba(232,197,71,0.08)"  },
    "Dólar (TRM)": { line: "#3de89a", fill: "rgba(61,232,154,0.08)"  },
    "Alimentos":   { line: "#e83d5a", fill: "rgba(232,61,90,0.08)"   }
  },

  showLoading() {
    document.getElementById("chartLoading").style.display = "flex";
    document.getElementById("chartCanvas").style.display  = "none";
  },

  hideLoading() {
    document.getElementById("chartLoading").style.display = "none";
    document.getElementById("chartCanvas").style.display  = "block";
  },

  render(labels, valores, producto) {
    const color  = this.colores[producto];
    const unidad = ChartsModel.unidades[producto];
    const canvas = document.getElementById("chartCanvas");

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: `${producto} (${unidad})`,
          data: valores,
          backgroundColor: color.fill,
          borderColor: color.line,
          borderWidth: 2,
          borderRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#18181d",
            borderColor: "#2a2a32",
            borderWidth: 1,
            titleColor: "#e8e8ec",
            bodyColor: color.line,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y.toLocaleString("es-CO")} ${unidad}`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#7a7a8a", font: { family: "IBM Plex Mono", size: 10 } },
            grid:  { color: "#2a2a32" }
          },
          y: {
            ticks: {
              color: "#7a7a8a",
              font: { family: "IBM Plex Mono", size: 10 },
              callback: (v) => v.toLocaleString("es-CO")
            },
            grid: { color: "#2a2a32" }
          }
        }
      }
    });
  }
};

// ─── CONTROLADOR ──────────────────────────────────────────────────────────
const ChartsController = {
  producto: "Dólar (TRM)",
  periodo:  "meses",

  init() {
    this.render();
  },

  setProducto(p) {
    this.producto = p;
    document.querySelectorAll(".chart-prod-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.prod === p);
    });
    this.render();
  },

  setPeriodo(p) {
    this.periodo = p;
    document.querySelectorAll(".chart-period-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.period === p);
    });
    this.render();
  },

  async render() {
    ChartsView.showLoading();
    try {
      let resultado;
      if      (this.producto === "Dólar (TRM)") resultado = await ChartsModel.fetchDolar(this.periodo);
      else if (this.producto === "Gasolina")    resultado = await ChartsModel.fetchGasolina(this.periodo);
      else                                      resultado = await ChartsModel.fetchAlimentos(this.periodo);

      ChartsView.hideLoading();
      ChartsView.render(resultado.labels, resultado.valores, this.producto);

    } catch (err) {
      // Fallback con datos estáticos
      ChartsView.hideLoading();
      const fb = ChartsModel.fallback[this.periodo];
      ChartsView.render(fb.labels, fb[this.producto], this.producto);
    }
  },

  // ─── GRÁFICO CIRCULAR ─────────────────────────────────────────────────
  pieChart: null,

  renderPie() {
    const labels = ["Dólar (TRM)", "Gasolina", "Alimentos"];
    const fallback = ChartsModel.fallback.meses;
    const valores = [fallback["Dólar (TRM)"][11], fallback["Gasolina"][11], fallback["Alimentos"][11]];

    const container = document.getElementById("pieChartContainer");
    container.style.display = "block";

    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(document.getElementById("pieChartCanvas"), {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data: valores,
          backgroundColor: ["#3de89a", "#e8c547", "#e83d5a"],
          borderWidth: 2,
          borderColor: "#18181d"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#e8e8ec", font: { family: "IBM Plex Sans" } }
          }
        }
      }
    });
  }
};