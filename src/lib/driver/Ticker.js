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
    this.data = {"assets":[{"id":"IONX-native","code":"IONX","issuer":null,"domain":"native","slug":"IONX-native","website":"https://ion.one","price_USD":0.189188,"volume24h_USD":2934,"change24h_USD":-2.4, topTradePairSlug: 'ETHI-ion.one/IONX-native'},
			   {"id":"ETHI-GDHXYFJQOENGL5FILWSCG2PFI3WJWVFU4S26RBFIS27H5KT3H6OJAXEA","code":"ETHI","issuer":"GDHXYFJQOENGL5FILWSCG2PFI3WJWVFU4S26RBFIS27H5KT3H6OJAXEA","domain":"token","slug":"ETH-ionized","website":"https://ion.one","price_USD":451.20,"volume24h_USD":3867.92, "change24h_USD":1.5, topTradePairSlug: 'ETHI-ion.one/USDI-ion.one'},
			   {"id":"USDI-GDHXYFJQOENGL5FILWSCG2PFI3WJWVFU4S26RBFIS27H5KT3H6OJAXEA","code":"USDI","issuer":"GDHXYFJQOENGL5FILWSCG2PFI3WJWVFU4S26RBFIS27H5KT3H6OJAXEA","domain":"token","slug":"USD-ionized","website":"https://ion.one","price_USD":1.00,"volume24h_USD":10.92, "change24h_USD":0.0, topTradePairSlug: 'USDI-ion.one/ETHI-ion.one'},
			   {"id":"ION1-GDHXYFJQOENGL5FILWSCG2PFI3WJWVFU4S26RBFIS27H5KT3H6OJAXEA","code":"ION1","issuer":"GDHXYFJQOENGL5FILWSCG2PFI3WJWVFU4S26RBFIS27H5KT3H6OJAXEA","domain":"token","slug":"ETH-ionized","website":"https://ion.one","price_USD":1.00,"volume24h_USD":212, "change24h_USD":0.1, topTradePairSlug: 'ION1-ion.one/USDI-ion.one'}]};

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
