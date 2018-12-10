var IONSdk = require('ion-sdk');
var server = new IONSdk.Server('https://api.ion.one');

// Keys for accounts to issue and receive the new asset
var issuingKeys = IONSdk.Keypair
    .fromSecret('SATJXVDGHP2Q7KE2JRKDALWHHSUWSVP33FXUIVGH3RJQ5OZNGZZ2RT54');

// Create an object to represent the new asset
var testDollar = new IONSdk.Asset('TestDollar', issuingKeys.publicKey());
console.log(testDollar);

console.log(IONSdk.Asset.native())
