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
    this.props.stripe.createToken().then(({ token, error }) => {
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

        <table style={{ width: '100%', marginBottom: '20px' }}>
          <tr>
            <th>Serviço</th>
            <th style={{textAlign:'right'}}>Valor</th>
          </tr>
          <tr>
            <td className="ilv-font-weight-semibold">{this.props.service.Name}</td>
            <td className="ilv-text-xs-right">{this.props.service.Price}</td>
          </tr>
        </table>
        <CardNumberSection />
        <CardCVCSection />
        <button className="ilv-btn-primary" style={{ width: '100%', padding: '11px' }}>Confirm order</button>
      </form>
    );
  }
});