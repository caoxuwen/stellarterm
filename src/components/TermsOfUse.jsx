const React = window.React = require('react');
import Generic from './Generic.jsx';

export default class TermsOfUse extends React.Component {
  render() {
    return <div>
      <Generic>
        <h2 className="Session__welcomeTitle">Terms of use</h2>
        <div>
          <h3>1. It's a god damn alpha software </h3>
	  So use at your own god damn risk. Don't use your real keys. Probably a lot of bugs for sure, even though we are good programmers. If you encounter anything wrong or anything you don't like, let us know. 
          <br />
          <br />
          <h3>2. Fill in for some GDPR bluh later </h3>
          Your privacy is important to us bluh. We track nothing, we know nothing. If you have read this far, I want to thank you for being an early tester. I really do.
          <br />
          <br />
          {this.props.accept ? <div>
            By pressing "<strong>Accept and Continue</strong>", you acknowledge that you have read this document and agree to these terms of use.
            <div className="Session__tos__next">
              <button className="s-button" onClick={this.props.accept}>Accept and Continue</button>
            </div>
          </div> : null}
        </div>
      </Generic>
    </div>
  }
}

