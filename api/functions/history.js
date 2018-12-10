const Promise = require('bluebird');
const _ = require('lodash');
const rp = require('request-promise');
const IONSdk = require('ion-sdk');

const PQueue = require('p-queue');
const queue = new PQueue({concurrency: 20});
const run = queue.add;

const directory = require('../directory.json');

IONSdk.Network.usePublicNetwork();

S = new IONSdk.Server('https://horizon.stellar.org');
IONSdk.Network.usePublicNetwork();

function historyGenerator() {
  let finish;
  let ticker = {
    _meta: {
      start: Math.floor(Date.now()/1000),
      startISO: Date(),
      apiLicense: 'Apache-2.0',
    },
  };

  let historyPromise = Promise.resolve()
    .then(() => phase1(ticker))
    .then(() => phase2(ticker))
    .then(() => phase3(ticker))
    .then(() => {
      return {
        'v1/ticker.json': JSON.stringify(ticker, null, 2)
      };
    })

  return historyPromise;
}

function phase1(ticker) {
  return Promise.all([
    getHorizonMain()
      .then(main => {
        ticker._meta.horizon = {
          core_latest_ledger: main.core_latest_ledger,
          network_passphrase: main.network_passphrase,
        }
      })
    ,
    getExternalPrices()
      .then(externalPrices => {
        ticker._meta.externalPrices = externalPrices;
      })
  ])
}

function phase2(ticker) {
  ticker.assets = [];

  ticker.assets.push({
    id: 'XLM-native',
    code: 'XLM',
    issuer: null,
    domain: 'native',
    slug: 'XLM-native',
    website: 'https://www.stellar.org/lumens/',
  })
  _.each(directory.assets, (asset, id) => {
    let r = {};
    r.id = id;
    r.code = asset.code;
    r.issuer = asset.issuer;
    r.domain = asset.domain;
    r.slug = asset.code + '-' + asset.domain;
    r.website = directory.anchors[asset.domain].website;
    ticker.assets.push(r)
  });
}

function phase3(ticker) {

}

function getExternalPrices() {
  return Promise.all([
    getBtcPrice(),
    getLumenPrice(),
  ])
  .then(externalData => {
    return {
      USD_BTC: externalData[0],
      BTC_XLM: externalData[1],
      USD_XLM: _.round(externalData[0]*externalData[1],6),
    }
  })
}

function getBtcPrice() {
  return Promise.all([
    rp('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(data => {
        return _.round(JSON.parse(data).bpi.USD.rate_float, 3);
      })
      .catch(() => {
        return null;
      })
    ,
    rp('https://api.bitfinex.com/v2/ticker/tBTCUSD')
      .then(data => {
        return _.round(JSON.parse(data)[2], 3);
      })
      .catch(() => {
        return null;
      })
    ,
    rp('https://api.coinbase.com/v2/prices/spot?currency=USD')
      .then(data => {
        return _.round(JSON.parse(data).data.amount, 3);
      })
      .catch(() => {
        return null;
      })
    ,
    rp('https://api.kraken.com/0/public/Ticker?pair=XBTUSD')
      .then(data => {
        return _.round(JSON.parse(data).result.XXBTZUSD.c[0], 3);
      })
      .catch(() => {
        return null;
      })
  ])
  .then(allPrices => {
    return _.round(_.mean(_.filter(allPrices, price => price !== null)), 2);
  })
}

// Get lumen price in terms of btc
function getLumenPrice() {
  return Promise.all([
    rp('https://poloniex.com/public?command=returnTicker')
      .then(data => {
        return parseFloat(JSON.parse(data).BTC_STR.last);
      })
      .catch(() => {
        return null;
      })
    ,
    rp('https://bittrex.com/api/v1.1/public/getticker?market=BTC-XLM')
      .then(data => {
        return parseFloat(JSON.parse(data).result.Last);
      })
      .catch(() => {
        return null;
      })
    ,
    rp('https://api.kraken.com/0/public/Ticker?pair=XLMXBT')
      .then(data => {
        return parseFloat(JSON.parse(data).result.XXLMXXBT.c[0]);
      })
      .catch(() => {
        return null;
      })
  ])
  .then(allPrices => {
    return _.round(_.mean(_.filter(allPrices, price => price !== null)), 8);
  })
}

function getHorizonMain() {
  return rp('https://horizon.stellar.org/')
    .then(horizonMain => {
      return JSON.parse(horizonMain);
    })
}

module.exports = historyGenerator;
