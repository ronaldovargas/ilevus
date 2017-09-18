var React = require('react');

var Elements = require('react-stripe-elements/lib/index').Elements
var CheckoutForm = require('./CheckoutForm');
var injectStripe = require('react-stripe-elements/lib/index').injectStripe
var StripeCheckoutForm = injectStripe(CheckoutForm);

module.exports = React.createClass({
  propTypes: {
    service: React.PropTypes.object.isRequired
  },
  render() {
    return (
      <div id="pay-invoice" className="card">
        <div className="ilv-card-body">
          <div className="ilv-card-title">
            <h3 className="text-center">Pay Invoice</h3>
          </div>
          <hr/>
          <Elements>
            <StripeCheckoutForm service={this.props.service}/>
          </Elements>
        </div>
      </div>
    );
  }
});