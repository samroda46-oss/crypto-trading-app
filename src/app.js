// Crypto Trading App - Main Logic

const state = {
  currentTicker: 'BTCUSDT',
  balance: 10000,
  portfolio: {
    BTCUSDT: 0,
    ETHUSDT: 0,
    BNBUSDT: 0,
    XRPUSDT: 0,
    SOLUSDT: 0,
    ADAUSDT: 0,
  },
  prices: {
    BTCUSDT: 0,
    ETHUSDT: 0,
    BNBUSDT: 0,
    XRPUSDT: 0,
    SOLUSDT: 0,
    ADAUSDT: 0,
  },
  trades: [],
  chart: null,
  candleSeries: null,
  candleData: {},
  ws: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 10,
};

// Initialize chart
function initChart() {
  const container = document.getElementById('chart');
  state.chart = LightweightCharts.createChart(container, {
    layout: { background: { color: '#ffffff' }, textColor: '#333' },
    width: container.clientWidth,
    height: container.clientHeight,
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  state.candleSeries = state.chart.addCandlestickSeries({
    upColor: '#11998e',
    downColor: '#f5576c',
    borderUpColor: '#11998e',
    borderDownColor: '#f5576c',
    wickUpColor: '#11998e',
    wickDownColor: '#f5576c',
  });

  // Initialize empty candlestick data for all pairs
  Object.keys(state.portfolio).forEach(ticker => {
    state.candleData[ticker] = [];
  });
}

// WebSocket connection
function connectWebSocket() {
  const ticker = state.currentTicker.toLowerCase();
  const wsUrl = `wss://stream.binance.com:9443/ws/${ticker}@trade`;

  state.ws = new WebSocket(wsUrl);

  state.ws.onopen = () => {
    console.log(`Connected to ${state.currentTicker}`);
    state.reconnectAttempts = 0;
    updateConnectionStatus(true);
  };

  state.ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const price = parseFloat(data.p);
    const qty = parseFloat(data.q);

    state.prices[state.currentTicker] = price;

    // Update UI
    updatePriceDisplay(price);
    updateCandleChart(price);
  };

  state.ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    updateConnectionStatus(false);
  };

  state.ws.onclose = () => {
    console.log('WebSocket closed');
    updateConnectionStatus(false);
    reconnectWebSocket();
  };
}

// Reconnect logic
function reconnectWebSocket() {
  if (state.reconnectAttempts < state.maxReconnectAttempts) {
    state.reconnectAttempts++;
    setTimeout(() => {
      console.log(`Reconnecting... Attempt ${state.reconnectAttempts}`);
      connectWebSocket();
    }, 3000);
  }
}

// Update price display
function updatePriceDisplay(price) {
  const priceEl = document.getElementById('currentPrice');
  priceEl.textContent = `$${price.toFixed(2)}`;
}

// Update candlestick chart
function updateCandleChart(price) {
  const now = Math.floor(Date.now() / 1000);
  const ticker = state.currentTicker;

  if (!state.candleData[ticker]) {
    state.candleData[ticker] = [];
  }

  const data = state.candleData[ticker];
  let lastCandle = data[data.length - 1];

  // Create new candle every 60 seconds
  if (!lastCandle || now - lastCandle.time >= 60) {
    lastCandle = {
      time: now,
      open: price,
      high: price,
      low: price,
      close: price,
    };
    data.push(lastCandle);
  } else {
    // Update current candle
    lastCandle.close = price;
    lastCandle.high = Math.max(lastCandle.high, price);
    lastCandle.low = Math.min(lastCandle.low, price);
  }

  // Keep only last 50 candles
  if (data.length > 50) {
    data.shift();
  }

  state.candleSeries.setData(data);
  state.chart.timeScale().fitContent();
}

// Update connection status
function updateConnectionStatus(connected) {
  const statusEl = document.getElementById('connectionStatus');
  const textEl = document.getElementById('connectionText');

  if (connected) {
    statusEl.classList.remove('disconnected');
    textEl.textContent = 'Connected';
  } else {
    statusEl.classList.add('disconnected');
    textEl.textContent = 'Disconnected - Reconnecting...';
  }
}

// Execute trade
function executeTrade(type) {
  const amountInput = document.getElementById('tradeAmount');
  const amount = parseFloat(amountInput.value);
  const price = state.prices[state.currentTicker];

  if (isNaN(amount) || amount <= 0) {
    showMessage('Please enter a valid amount', 'error');
    return;
  }

  if (type === 'buy') {
    if (amount > state.balance) {
      showMessage('Insufficient balance', 'error');
      return;
    }
    const crypto = amount / price;
    state.portfolio[state.currentTicker] += crypto;
    state.balance -= amount;
    state.trades.unshift({
      type: 'BUY',
      ticker: state.currentTicker,
      amount: amount,
      price: price,
      crypto: crypto,
      timestamp: new Date().toLocaleTimeString(),
    });
    showMessage(`Bought ${crypto.toFixed(4)} ${state.currentTicker} for $${amount.toFixed(2)}`, 'success');
  } else if (type === 'sell') {
    const holding = state.portfolio[state.currentTicker];
    const cryptoToSell = amount / price;
    if (cryptoToSell > holding) {
      showMessage('Insufficient holdings', 'error');
      return;
    }
    state.portfolio[state.currentTicker] -= cryptoToSell;
    state.balance += amount;
    state.trades.unshift({
      type: 'SELL',
      ticker: state.currentTicker,
      amount: amount,
      price: price,
      crypto: cryptoToSell,
      timestamp: new Date().toLocaleTimeString(),
    });
    showMessage(`Sold ${cryptoToSell.toFixed(4)} ${state.currentTicker} for $${amount.toFixed(2)}`, 'success');
  }

  amountInput.value = '';
  updateUI();
}

// Show status message
function showMessage(message, type) {
  const msgEl = document.getElementById('statusMessage');
  msgEl.textContent = message;
  msgEl.className = `status-message show ${type}`;
  setTimeout(() => {
    msgEl.classList.remove('show');
  }, 3000);
}

// Update UI
function updateUI() {
  // Update balance
  document.getElementById('balanceAmount').textContent = `$${state.balance.toFixed(2)}`;

  // Update portfolio
  const portfolioList = document.getElementById('portfolioList');
  const holdings = Object.entries(state.portfolio)
    .filter(([_, amount]) => amount > 0)
    .map(
      ([ticker, amount]) =>
        `<div class="portfolio-item"><span class="portfolio-item-ticker">${ticker}</span><span class="portfolio-item-amount">${amount.toFixed(4)}</span></div>`
    );

  if (holdings.length === 0) {
    portfolioList.innerHTML = '<div class="portfolio-item empty">No holdings yet</div>';
  } else {
    portfolioList.innerHTML = holdings.join('');
  }

  // Update trade history
  const historyEl = document.getElementById('tradeHistory');
  if (state.trades.length === 0) {
    historyEl.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">No trades yet</div>';
  } else {
    const trades = state.trades
      .map(
        (trade) =>
          `<div class="trade-history-item ${trade.type.toLowerCase()}">
        <div class="trade-type">${trade.type} ${trade.ticker}</div>
        <div class="trade-details">${trade.crypto.toFixed(4)} @ $${trade.price.toFixed(2)} = $${trade.amount.toFixed(2)}</div>
        <div class="trade-details">${trade.timestamp}</div>
      </div>`
      )
      .join('');
    historyEl.innerHTML = trades;
  }
}

// Event listeners
document.querySelectorAll('.ticker-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ticker-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentTicker = btn.getAttribute('data-ticker');

    // Disconnect old WebSocket and connect to new
    if (state.ws) {
      state.ws.close();
    }
    connectWebSocket();

    // Update chart with stored data
    if (state.candleData[state.currentTicker]) {
      state.candleSeries.setData(state.candleData[state.currentTicker]);
      state.chart.timeScale().fitContent();
    }

    // Clear status message
    document.getElementById('statusMessage').classList.remove('show');
  });
});

document.getElementById('buyBtn').addEventListener('click', () => {
  executeTrade('buy');
});

document.getElementById('sellBtn').addEventListener('click', () => {
  executeTrade('sell');
});

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  initChart();
  connectWebSocket();
  updateUI();

  // Resize chart on window resize
  window.addEventListener('resize', () => {
    const container = document.getElementById('chart');
    if (state.chart) {
      state.chart.applyOptions({ width: container.clientWidth });
    }
  });
});