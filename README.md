# 💰 Crypto Trading Desktop App

A modern desktop cryptocurrency trading application built with **Electron**, featuring real-time price feeds, live candlestick charts, and paper trading capabilities.

## ✨ Features

- **Real-time Price Feeds** - Live cryptocurrency prices from Binance WebSocket API
- **Live Candlestick Charts** - Interactive charts using Lightweight Charts library
- **Paper Trading** - Simulate buy/sell orders without real money ($10,000 starting balance)
- **Multi-Pair Support** - Trade BTC, ETH, BNB, XRP, SOL, ADA
- **Portfolio Tracking** - Monitor your holdings and balance in real-time
- **Trade History** - View all executed trades with timestamps
- **Beautiful Modern UI** - Gradient interface with smooth animations

## 🚀 Quick Start

### Prerequisites

You need to have these installed:
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** (comes automatically with Node.js)

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/samroda46-oss/crypto-trading-app.git
cd crypto-trading-app

# 2. Install dependencies
npm install

# 3. Start the app
npm start
```

That's it! The Electron window will launch automatically.

## 🎮 How to Use

1. **Select Cryptocurrency**: Click one of the ticker buttons (BTC, ETH, BNB, XRP, SOL, ADA)
2. **View Live Price**: Chart updates in real-time with latest prices
3. **Enter Trade Amount**: Type the amount in USDT you want to trade
4. **Execute Trade**: Click **BUY** or **SELL** button
5. **Monitor Portfolio**: See your holdings and trade history on the right panel

## 📊 Supported Trading Pairs

| Pair | Ticker |
|------|--------|
| Bitcoin | BTCUSDT |
| Ethereum | ETHUSDT |
| Binance Coin | BNBUSDT |
| Ripple | XRPUSDT |
| Solana | SOLUSDT |
| Cardano | ADAUSDT |

## 🏗️ Project Structure

```
crypto-trading-app/
├── src/
│   ├── main.js          # Electron main process
│   ├── preload.js       # Security preload script
│   ├── index.html       # Main UI
│   └── app.js           # Trading logic & WebSocket
├── package.json         # Dependencies & scripts
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🔌 API Integration

**Real-time Data Source**: [Binance WebSocket API](https://binance-docs.github.io/apidocs/spot/en/)

The app uses Binance's public WebSocket streams for:
- Live price updates
- Trade execution simulation
- Market data

**No API key required** for paper trading with public data!

## 📦 Built With

- **[Electron](https://www.electronjs.org/)** - Desktop application framework
- **[Lightweight Charts](https://github.com/tradingview/lightweight-charts)** - Fast candlestick charts
- **[Binance API](https://binance-docs.github.io/apidocs/)** - Real-time price data
- **[Node.js](https://nodejs.org/)** - JavaScript runtime

## 🛠️ Build for Production

Create executable installers for distribution:

**Windows:**
```bash
npm run build:win
```

**macOS:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

Built files will be in the `dist/` directory.

## ⚙️ Configuration

### Change Starting Balance

Edit `src/app.js` and modify:
```javascript
state.balance = 10000; // Change this value
```

### Add More Trading Pairs

1. Add button in `src/index.html`:
```html
<button class="ticker-btn" data-ticker="LTCUSDT">₿ LTC/USDT</button>
```

2. Add to portfolio in `src/app.js`:
```javascript
state.portfolio = {
  // ... existing pairs
  LTCUSDT: 0,
};

state.prices = {
  // ... existing pairs
  LTCUSDT: 0,
};
```

## 🐛 Troubleshooting

### App won't start
```bash
# Clear dependencies and reinstall
rm -rf node_modules
npm cache clean --force
npm install
npm start
```

### WebSocket connection fails
- Check your internet connection
- Binance API might be temporarily unavailable
- App will auto-reconnect every 3 seconds

### Chart not displaying
- Ensure window is at least 1000x600px
- Try resizing the window
- Check browser console (F12 → Console tab)

## 📝 Paper Trading Notes

- **Starting Balance**: $10,000 USDT
- **Trade Execution**: Instant at current market price
- **Real Prices**: Using actual Binance market prices
- **No Real Money**: This is simulation only
- **Session Data**: Trade history clears when app closes

Perfect for learning and practice!

## 🔐 Security

- Context isolation enabled
- No node integration in renderer process
- Secure preload script
- No sensitive data stored locally
- Safe WebSocket connections only

## 🚧 Future Enhancements

- [ ] Live trading integration with Binance
- [ ] SQLite database for persistent trade history
- [ ] Technical indicators (RSI, MACD, Bollinger Bands)
- [ ] Portfolio statistics and analytics
- [ ] Customizable price alerts
- [ ] Multiple timeframe support
- [ ] Advanced drawing tools

## 📄 License

MIT License - Feel free to use this project freely

## 💬 Support

- **Issues**: Open an [issue on GitHub](https://github.com/samroda46-oss/crypto-trading-app/issues)
- **Questions**: Use [GitHub Discussions](https://github.com/samroda46-oss/crypto-trading-app/discussions)

## 🙏 Acknowledgments

- [Binance](https://binance.com) for real-time market data
- [TradingView](https://www.tradingview.com/) for Lightweight Charts
- [Electron](https://www.electronjs.org/) for the framework

---

**Happy Trading!** 🚀📈

Made with ❤️ for cryptocurrency enthusiasts