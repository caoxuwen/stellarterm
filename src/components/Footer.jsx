const React = window.React = require('react');
import Generic from './Generic.jsx';

export default class Footer extends React.Component {
  render() {
    return <div className="so-back Footer">
      <div className="so-chunk Footer__chunk">
        <div className="Footer__disclaimer">
          ION is currently alpha software, proceed at your own risk. All trading only involve testnet tokens. Trading doesn't consitute monetary transaction in any form. 
        </div>
      </div>
    </div>
  }
}

