const React = window.React = require('react');
import Generic from './Generic.jsx';

export default class Footer extends React.Component {
  render() {
    return <div className="so-back Footer">
      <div className="so-chunk Footer__chunk">
        <div className="Footer__disclaimer">
          &nbsp;&nbsp;&nbsp;&nbsp; Disclaimer: ION is alpha software, proceed at your own risk. All trading currently involve testnet tokens only, for functional testing. It doesn't consitute monetary transaction in any form. 
        </div>
      </div>
    </div>
  }
}

