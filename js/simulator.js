// ─── MODELO ───────────────────────────────────────────────────────────────
const SimulatorModel = {
  assets: {
    "EC":  { name: "Ecopetrol",      base: 2500,  volatility: 0.03 },
    "GV":  { name: "Grupo Aval",     base: 850,   volatility: 0.02 },
    "AV":  { name: "Avianca",        base: 1200,  volatility: 0.04 },
    "USD": { name: "Dólar TRM",      base: 4200,  volatility: 0.015 }
  },

  async fetchPrice(symbol) {
    if (symbol === "USD") {
      const url = `${CONFIG.ALPHA_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=COP&apikey=${CONFIG.ALPHA_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      return parseFloat(data["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"] || 4200);
    }
    const url = `${CONFIG.ALPHA_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${CONFIG.ALPHA_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    const quote = data["Global Quote"];
    return quote ? parseFloat(quote["05. price"]) : this.assets[symbol].base;
  },

  predictTrend(currentPrice, asset) {
    const change = (Math.random() - 0.48) * asset.volatility * currentPrice;
    const newPrice = currentPrice + change;
    const trend = change > 0 ? "subirá" : "bajará";
    const percent = Math.abs((change / currentPrice * 100).toFixed(2));
    return { newPrice, trend, percent, change };
  }
};

// ─── VISTA ────────────────────────────────────────────────────────────────
const SimulatorView = {
  showLoading() {
    document.getElementById("simResult").innerHTML = '<div class="skeleton" style="height:60px"></div>';
    document.getElementById("simPrediction").innerHTML = "";
  },

  renderResult(assetName, amount, currentPrice, predicted) {
    const returnAmount = (amount / currentPrice) * predicted.newPrice;
    const profit = returnAmount - amount;
    const isProfit = profit >= 0;

    document.getElementById("simResult").innerHTML = `
      <div class="sim-info">
        <div><strong>${assetName}</strong></div>
        <div>Precio actual: ${currentPrice.toLocaleString("es-CO")} COP</div>
        <div>Precio estimado: ${predicted.newPrice.toLocaleString("es-CO")} COP</div>
        <div>Inversión: ${amount.toLocaleString("es-CO")} COP</div>
        <div class="${isProfit ? 'sim-profit' : 'sim-loss'}">
          ${isProfit ? '↗' : '↘'} ${isProfit ? '+' : ''}${profit.toLocaleString("es-CO", {maximumFractionDigits:0})} COP
        </div>
      </div>
    `;
  },

  renderPrediction(trend, percent, assetName) {
    document.getElementById("simPrediction").innerHTML = `
      <div class="prediction-badge ${trend === 'subirá' ? 'prediction-up' : 'prediction-down'}">
        ⚡ En tiempo real: ${assetName} ${trend} (~${percent}%)
      </div>
    `;
  }
};

// ─── CONTROLADOR ──────────────────────────────────────────────────────────
const SimulatorController = {
  async simulate() {
    const symbol = document.getElementById("simAsset").value;
    const amount = parseFloat(document.getElementById("simAmount").value) || 1000000;
    const asset = SimulatorModel.assets[symbol];
    if (!asset) return;

    SimulatorView.showLoading();

    try {
      const currentPrice = await SimulatorModel.fetchPrice(symbol);
      const predicted = SimulatorModel.predictTrend(currentPrice, asset);

      SimulatorView.renderResult(asset.name, amount, currentPrice, predicted);
      SimulatorView.renderPrediction(predicted.trend, predicted.percent, asset.name);
    } catch (err) {
      document.getElementById("simResult").innerHTML = "⚠ Error al simular. Intenta de nuevo.";
    }
  }
};
