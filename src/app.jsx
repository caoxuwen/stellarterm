const React = window.React = require('react');
const ReactDOM = require('react-dom');
const mountNode = document.getElementById('app');
import GlobalModal from './components/GlobalModal.jsx';
import NotFound from './components/NotFound.jsx';
import AssetList from './components/AssetList.jsx';
import Markets from './components/Markets.jsx';
import Session from './components/Session.jsx';
import Exchange from './components/Exchange.jsx';
import Margin from './components/Margin.jsx';
import Generic from './components/Generic.jsx';
import Download from './components/Download.jsx';
import Loading from './components/Loading.jsx';
import Stellarify from './lib/Stellarify';
import url from 'url';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import TermsOfUse from './components/TermsOfUse.jsx';
import Driver from './lib/Driver';
import MailchimpSubscribe from "./components/Mailsubscribe.jsx";

let network = {
  horizonUrl: 'https://api.ion.one',
  networkPassphrase: 'Test ION Network ; Nov 2018',
  isDefault: true, // If it's default, then we don't show a notice bar at the top
  isTestnet: false,
  isCustom: false,
};

if (window.location.hash === '#testnet') {
  network.isDefault = false;
  network.isTestnet = true;
  network.horizonUrl = 'https://horizon-testnet.stellar.org';
  network.networkPassphrase = IONSdk.Networks.TESTNET;
} else if (window.stCustomConfig.horizonUrl) {
  network.isDefault = false;
  network.isCustom = true;
  network.horizonUrl = window.stCustomConfig.horizonUrl;
  if (window.stCustomConfig.networkPassphrase) {
    network.networkPassphrase = window.stCustomConfig.networkPassphrase;
  }
}

IONSdk.Network.use(new IONSdk.Network(network.networkPassphrase));

let driver = new Driver({
  network,
});

const parseUrl = (href) => {
  let hash = url.parse(href).hash;
  if (hash === null) {
    return '';
  }
  return hash.substr(1);
}

const mailchimp_url = "https://one.us7.list-manage.com/subscribe/post?u=3b8bf21900c91f2fa3b994955&amp;id=f0c8c4c945"
const SimpleForm = () => <MailchimpSubscribe url={mailchimp_url} />

class TermApp extends React.Component {
  constructor(props) {
    super(props);
    this.d = props.d;
    this.state = {
      // The url is the hash cleaned up
      url: parseUrl(window.location.href)
    };
    window.addEventListener('hashchange', (e) => {
      if (e.newURL.indexOf('/#testnet') !== -1) {
        window.location.reload();
      }
      this.setState({
        url: parseUrl(e.newURL)
      })
    }, false);
  }

  renderHomePageActions() {
    const { d: { session: { state } } } = this.props;
    return state === 'out' && (
      <div className="HomePage__lead__actions">
        <a
          className="HomePage__lead__actions__sign-up-button HomePage__lead__actions__button s-button"
          href="#signup"
        >
          Sign Up
        </a>
        &nbsp;
        <a
          className="s-button HomePage__lead__actions__button"
          href="#account"
        >
          Login
        </a>
      </div>
    );
  }

  render() {
    let url = this.state.url;
    let urlParts = url.split('/');

    let body;
    if (url === '') {
      // Home page
      body = <div>
        <div className="HomePage__black">
          <SimpleForm />
          <div className="so-back">
            <div className="HomePage__lead">
              <h2 className="HomePage__lead__title">Trade on the <a href="#margin">ION Decentralized Exchange</a><sup className="HomePage__lead__title_sup">Alpha</sup></h2>
              <p className="HomePage__lead__summary">ION is a decentralized derivatives market, built with SCP <br />No margin interest, Trade with leverage, <a href="https://explorer.ion.one" target="_blank" rel="nofollow noopener noreferrer">100% Transparency</a></p>
              {this.renderHomePageActions()}
            </div>
          </div>
        </div>
        <div className="so-back islandBack HomePage__assetList">
          <div className="island">
            <AssetList d={this.props.d} limit={6}></AssetList>
            <div className="AssetListFooter">
              More trading pairs to be listed during beta launch. Stay tuned.
            </div>
          </div>
        </div>
      </div>
    } else if (urlParts[0] === 'download') {
      body = <Download />
    } else if (urlParts[0] === 'testnet') {
      if (network.isTestnet) {
        body = <Generic title="Test network">
          You are running on the <a href="https://www.stellar.org/developers/guides/concepts/test-net.html" target="_blank" rel="nofollow noopener noreferrer">Stellar test network</a>. This network is for development purposes only and the test network may be occasionally reset.
          <br />
          To create a test account on the test network, use the <a href="https://www.stellar.org/laboratory/#account-creator?network=test" target="_blank" rel="nofollow noopener noreferrer">Friendbot to get some test lumens</a>.
        </Generic>
      } else {
        body = <Generic title="Please refresh the page to switch to testnet"><Loading darker={true}>
          Please refresh the page to switch to testnet.
        </Loading></Generic>
      }
    } else if (urlParts[0] === 'privacy') {
      body = <Generic title="Privacy Policy">
        <p>This policy may be updated or revised without notice. It is the responsibility of the user to stay informed about privacy policy changes.</p>
        <p>StellarTerm does track your actions on this client.</p>
        <p>StellarTerm does not store cookies and the website does not contain any analytics scripts.</p>
        <p>StellarTerm developers never see your private keys.</p>
        <p>However, StellarTerm.com is hosted on GitHub, AWS, and Cloudflare infrastructure. They may and do have their own tracking systems on their servers. Those services have their own privacy policies and they are not covered by this privacy policy.</p>
        <p>While StellarTerm does not track you, this does not mean your actions are private. Take note of other privacy issues that may affect you:</p>
        <ul className="privacy__ul">
          <li>Stellar is a public ledger. Anyone can see anything that happens on the network.</li>
          <li>Your inflation vote is publicly visible.</li>
          <li>Your computer might be compromised.</li>
          <li>The StellarTerm website might be compromised.</li>
        </ul>
      </Generic>
    } else if (urlParts[0] === 'terms-of-use') {
      body = <TermsOfUse />
    } else if (['account', 'signup', 'ledger'].indexOf(urlParts[0]) > -1) {
      body = <Session d={this.d} urlParts={urlParts}></Session>
    } else if (urlParts[0] === 'markets') {
      body = <Markets d={this.d}></Markets>
    } else if (urlParts[0] === 'exchange') {
      if (urlParts.length === 3) {
        try {
          let baseBuying = Stellarify.parseAssetSlug(urlParts[1]);
          let counterSelling = Stellarify.parseAssetSlug(urlParts[2]);

          this.d.orderbook.handlers.setOrderbook(baseBuying, counterSelling);
          body = <Exchange d={this.d}></Exchange>
        } catch (e) {
          console.error(e);
          body = <Generic title="Pick a market">Exchange url was invalid. To begin, go to the <a href="#markets">market list page</a> and pick a trading pair.</Generic>
        }
      } else {
        if (this.d.orderbook.data.ready) {
          setTimeout(() => {
            let newUrl = 'exchange' + Stellarify.pairToExchangeUrl(this.d.orderbook.data.baseBuying, this.d.orderbook.data.counterSelling);
            history.replaceState(null, null, '#' + newUrl);
            this.setState({
              url: newUrl,
            })
          }, 0);
          body = <Generic title="Loading orderbook">Loading</Generic>
        } else {
          // Default to a market with good activity
          let baseBuying = new IONSdk.Asset('ETHI', window.stCustomConfig.assetIssuer_ethi);
          let counterSelling = new IONSdk.Asset('USDI', window.stCustomConfig.assetIssuer_usdi);

          this.d.orderbook.handlers.setOrderbook(baseBuying, counterSelling);
          setTimeout(() => {
            let newUrl = 'exchange' + Stellarify.pairToExchangeUrl(baseBuying, counterSelling);
            history.replaceState(null, null, '#' + newUrl);
            this.setState({
              url: newUrl,
            })
          }, 0);
        }
      }
    } else if (urlParts[0] === 'margin') {
      if (urlParts.length === 3) {
        try {
          let baseBuying = Stellarify.parseAssetSlug(urlParts[1]);
          let counterSelling = Stellarify.parseAssetSlug(urlParts[2]);

          this.d.orderbook.handlers.setOrderbook(baseBuying, counterSelling);
          body = <Margin d={this.d}></Margin>
        } catch (e) {
          console.error(e);
          body = <Generic title="Pick a market">Exchange url was invalid. To begin, go to the <a href="#markets">market list page</a> and pick a trading pair.</Generic>
        }
      } else {
        if (this.d.orderbook.data.ready) {
          setTimeout(() => {
            let newUrl = 'margin' + Stellarify.pairToExchangeUrl(this.d.orderbook.data.baseBuying, this.d.orderbook.data.counterSelling);
            history.replaceState(null, null, '#' + newUrl);
            this.setState({
              url: newUrl,
            })
          }, 0);
          body = <Generic title="Loading orderbook">Loading</Generic>
        } else {
          // Default to a market with good activity
          let baseBuying = new IONSdk.Asset('ETHI', window.stCustomConfig.assetIssuer_ethi);
          let counterSelling = new IONSdk.Asset('USDI', window.stCustomConfig.assetIssuer_usdi);

          this.d.orderbook.handlers.setOrderbook(baseBuying, counterSelling);
          setTimeout(() => {
            let newUrl = 'margin' + Stellarify.pairToExchangeUrl(baseBuying, counterSelling);
            history.replaceState(null, null, '#' + newUrl);
            this.setState({
              url: newUrl,
            })
          }, 0);
        }
      }
    } else if (urlParts[0] === 'whitepaper') {

    } else {
      body = <NotFound></NotFound>
    }

    return <div className="AppStretch">
      <GlobalModal d={this.props.d}></GlobalModal>
      <div className="AppStretch AppContainer">
        <div>
          <Header d={this.props.d} urlParts={urlParts} network={network}></Header>
          {body}
        </div>
        <Footer />
      </div>
    </div>;

  }
};

ReactDOM.render(<TermApp d={driver} />, mountNode);
