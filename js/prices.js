// ─── MODELO: datos de precios ─────────────────────────────────────────────
const PricesModel = {
  items: [
    { nombre: "Gasolina",             cambio: "+8.2%",  tipo: "up" },
    { nombre: "Alimentos importados", cambio: "+5.4%",  tipo: "up" },
    { nombre: "Dólar (TRM)",          cambio: "$4,280", tipo: "up" },
    { nombre: "Fertilizantes",        cambio: "+12.1%", tipo: "up" },
    { nombre: "Gas natural",          cambio: "+6.7%",  tipo: "up" },
    { nombre: "Café exportación",     cambio: "-2.3%",  tipo: "down" }
  ]
};

// ─── VISTA: renderiza los precios ─────────────────────────────────────────
const PricesView = {
  render(items) {
    const container = document.getElementById("pricesContainer");
    container.innerHTML = items.map(item => `
      <div class="price-row">
        <span class="price-name">${item.nombre}</span>
        <span class="price-change ${item.tipo}">
          ${item.tipo === "up" ? "↑" : "↓"} ${item.cambio}
        </span>
      </div>
    `).join("");
  }
};

// ─── CONTROLADOR ──────────────────────────────────────────────────────────
const PricesController = {
  init() {
    PricesView.render(PricesModel.items);
  }
};