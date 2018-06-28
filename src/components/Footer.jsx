const React = window.React = require('react');
import Generic from './Generic.jsx';

export default class Footer extends React.Component {
  render() {
    return <div className="so-back Footer">
      <div className="so-chunk Footer__chunk">
        <div className="Footer__disclaimer">
          ION is currently alpha software, proceed at your own risk. Cryptocurrency assets are subject to high market risks and volatility. Past performance is not indicative of future results. Investments in blockchain assets may result in loss of part or all of your investment.
        </div>
      </div>
    </div>
  }
}

