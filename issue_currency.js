var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server('https://api.ion.one');

// Keys for accounts to issue and receive the new asset
var issuingKeys = StellarSdk.Keypair
    .fromSecret('SATJXVDGHP2Q7KE2JRKDALWHHSUWSVP33FXUIVGH3RJQ5OZNGZZ2RT54');

// Create an object to represent the new asset
var testDollar = new StellarSdk.Asset('TestDollar', issuingKeys.publicKey());
console.log(testDollar);

console.log(StellarSdk.Asset.native())
