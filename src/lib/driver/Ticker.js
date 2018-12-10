import req from '../req.js';
import Event from '../Event';


export default function Ticker() {
  this.event = new Event();

  this.ready = false;
  this.data = {};

  this.load();
}

const MAX_ATTEMPTS = 120;

Ticker.prototype.load = function(attempt) {
  if (attempt >= MAX_ATTEMPTS) {
    return;
  }

    this.ready = true;
    this.data = {"_meta":{"start":1530250811,"startISO":"Fri Jun 29 2018 05:40:11 GMT+0000 (UTC)","apiLicense":"Apache-2.0","externalPrices":{"USD_BTC":5820.7,"BTC_XLM":0.00003,"USD_XLM":0.174621,"USD_XLM_24hAgo":0.187081,"USD_XLM_change":-6.66}},
		 "assets":[{"id":"IONX-native","code":"IONX","issuer":null,"domain":"native","slug":"IONX-native","website":"https://ion.one","price_USD":0.189188,"volume24h_USD":2934,"change24h_USD":-2.4, topTradePairSlug: 'ETHI-ion.one/IONX-native'},
			   {"id":"ETHI-"+window.stCustomConfig.assetIssuer,"code":"ETHI","issuer":window.stCustomConfig.assetIssuer,"domain":"token","slug":"ETH-ionized","website":"https://ion.one","price_USD":451.20,"volume24h_USD":3867.92, "change24h_USD":1.5, topTradePairSlug: 'ETHI-ion.one/USDI-ion.one'},
			   {"id":"USDI-"+window.stCustomConfig.assetIssuer,"code":"USDI","issuer":window.stCustomConfig.assetIssuer,"domain":"token","slug":"USD-ionized","website":"https://ion.one","price_USD":1.00,"volume24h_USD":10.92, "change24h_USD":0.0, topTradePairSlug: 'USDI-ion.one/ETHI-ion.one'},
			   {"id":"ION1-"+window.stCustomConfig.assetIssuer,"code":"ION1","issuer":window.stCustomConfig.assetIssuer,"domain":"token","slug":"ETH-ionized","website":"https://ion.one","price_USD":1.00,"volume24h_USD":212, "change24h_USD":0.1, topTradePairSlug: 'ION1-ion.one/USDI-ion.one'}]};

    this.event.trigger();
    setTimeout(() => {this.load()}, 61*5*1000);
    /*
  req.getJson('https://api.stellarterm.com/v1/ticker.json')
  .then(tickerData => {
    this.ready = true;
    this.data = tickerData;
    console.log('Loaded ticker. Data generated ' + Math.round((new Date() - this.data._meta.start * 1000)/1000) + ' seconds ago.')
    this.event.trigger();
    setTimeout(() => {this.load()}, 61*5*1000) // Refresh every 5 minutes
  })
  .catch(e => {
    console.log('Unable to load ticker', e);
    if (!attempt) {
      attempt = 0;
    }
    setTimeout(() => {
      this.load(attempt + 1);
    }, 1000)
  })
*/
}
