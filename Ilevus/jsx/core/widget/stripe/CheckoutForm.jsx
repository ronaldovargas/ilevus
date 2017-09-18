var React = require('react');

var injectStripe = require('react-stripe-elements/lib/index').injectStripe

var CardNumberSection = require('./CardNumberSection.jsx');
var CardCVCSection = require('./CardCVCSection.jsx');
var CardPostalCode = require('./CardPostalCodeSection.jsx');
var UserSession = require('./../../store/Financial.jsx');


module.exports = React.createClass({
  propTypes: {
    service: React.PropTypes.object.isRequired
  },
  getInitialState() {
    return {
      user: null
    }
  },
  handleSubmit(ev) {

    ev.preventDefault();
    this.props.stripe.createToken({
      postalCode: this.refs['postalCode'].value
    }).then(({ token, error }) => {
      this.toHireService(token);
      console.log('Received Stripe token:', token, error);
    });
  },
  toHireService(params) {
    UserSession.toHireService({ service: this.props.service, stripe: params });
  },
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="ilv-form-group text-center">
          <ul className="ilv-list-inline">
            <li className="ilv-list-inline-item">
              <i className="text-muted fa fa-cc-visa fa-2x"></i>
            </li>
            <li className="ilv-list-inline-item">
              <i className="fa fa-cc-mastercard fa-2x"></i>
            </li>
            <li className="ilv-list-inline-item">
              <i className="fa fa-cc-amex fa-2x"></i>
            </li>
            <li className="ilv-list-inline-item">
              <i className="fa fa-cc-discover fa-2x"></i>
            </li>
          </ul>
        </div>
        <CardNumberSection />
        <CardCVCSection />
        <div className="ilv-form-group">
          <label className="ilv-control-label mb-1">CEP</label>
          <input className="ilv-form-control" type="text" ref="postalCode" />
        </div>
        <button>Confirm order</button>
      </form>
    );
  }
});