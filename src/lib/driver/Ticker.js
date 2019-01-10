import req from '../req.js';
import Event from '../Event';
import directory from '../../directory';

export default function Ticker(Server) {
  this.event = new Event();
  this.server = Server;
  this.ready = false;
  this.data = {};

  this.load(0);
}

const MAX_ATTEMPTS = 120;

Ticker.prototype.load = function (attempt) {
  if (attempt >= MAX_ATTEMPTS) {
    return;
  }

  let now = (new Date()).getTime();
  let onehour= 1000 * 60 * 60;
  let oneday = onehour * 24;
  let lastweek = now - 7 * oneday;
  let selling = new IONSdk.Asset("USDI", window.stCustomConfig.assetIssuer_usdi);
  let base = new IONSdk.Asset("ETHI", window.stCustomConfig.assetIssuer_ethi);
  /*
  req.getJson('https://api.stellarterm.com/v1/ticker.json')
    .then(tickerData => {*/
  this.server.tradeAggregation(base, selling, lastweek, now + oneday, oneday, 0)
    .call()
    .then(response => {
      this.ready = true;
      //this.data = response;

      let price = 100.00;
      let volume = 0.0;
      let change = 0.0;
      var volume_7d = 0.0;

      if (response.records.length > 0) {
        let record = response.records[response.records.length - 1];
        price = parseFloat(record.close);
        volume = parseFloat(record.counter_volume);
        change = parseFloat((record.close - record.open) / record.open);

        response.records.forEach(arecord => {
          volume_7d += parseFloat(arecord.counter_volume);
        });
      }

      this.data = {
        "_meta": { "start": 1530250811, "startISO": "Fri Jun 29 2018 05:40:11 GMT+0000 (UTC)", "apiLicense": "Apache-2.0" },
        "assets": [{
          "id": "ETHI-" + window.stCustomConfig.assetIssuer_ethi, "code": "ETHI", "issuer": window.stCustomConfig.assetIssuer_ethi, "domain": "token", "slug": "ETH-ionized",
          "website": "https://ion.one", "price_USD": price, "volume24h_USD": volume, "volume7d_USD": volume_7d,"change24h_USD": change, topTradePairSlug: 'ETHI-ion.one/USDI-ion.one'
        }]
      };

      //console.log('Loaded ticker. Data generated ' + Math.round((new Date() - this.data._meta.start * 1000) / 1000) + ' seconds ago.')
      this.event.trigger();
      setTimeout(() => { this.load(attempt + 1) }, 60 * (attempt + 1) * 5 * 1000) // Refresh every attemp * 5 minutes
    })
    .catch(e => {
      console.log('Unable to load ticker', e);
      if (!attempt) {
        attempt = 0;
      }
      setTimeout(() => {
        this.load(attempt + 1);
      }, 30 * 1000)
    })

  /*
  
  this.ready = true;
  this.data = {
    "_meta": { "start": 1530250811, "startISO": "Fri Jun 29 2018 05:40:11 GMT+0000 (UTC)", "apiLicense": "Apache-2.0", "externalPrices": { "USD_BTC": 5820.7, "BTC_XLM": 0.00003, "USD_XLM": 0.174621, "USD_XLM_24hAgo": 0.187081, "USD_XLM_change": -6.66 } },
    "assets": [{ "id": "ETHI-" + window.stCustomConfig.assetIssuer_ethi, "code": "ETHI", "issuer": window.stCustomConfig.assetIssuer_ethi, "domain": "token", "slug": "ETH-ionized", "website": "https://ion.one", "price_USD": 150.20, "volume24h_USD": 3867.92, "change24h_USD": 1.5, topTradePairSlug: 'ETHI-ion.one/USDI-ion.one' }]
  };
  
  this.event.trigger();
  setTimeout(() => { this.load() }, 61 * 5 * 1000);
  */
}
