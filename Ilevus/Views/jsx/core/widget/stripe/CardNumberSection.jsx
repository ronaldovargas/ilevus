var React = require('react');

var CardNumberElement = require('react-stripe-elements/lib/index').CardNumberElement;
module.exports = React.createClass({

  render() {
    return (
      <div className="ilv-form-group">
        <label for="cc-payment" className="ilv-control-label mb-1">Numero Cartão</label>
        <CardNumberElement className="ilv-form-control"/>
      </div>
    );
  }
});