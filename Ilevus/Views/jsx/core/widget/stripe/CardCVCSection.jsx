var CardCVCElement = require('react-stripe-elements/lib/index').CardCVCElement;
var CardExpiryElement = require('react-stripe-elements/lib/index').CardExpiryElement;
var React = require('react');
module.exports = React.createClass({

  render() {
    return (

      <div className="row">
        <div className="col-6">
          <div className="ilv-form-group">
            <label for="cc-payment" className="ilv-control-label mb-1">Payment amount</label>
            <CardCVCElement className="ilv-form-control"/>
          </div>
        </div>
        <div className="col-6">
        <div className="ilv-form-group">
          <label for="cc-payment" className="ilv-control-label mb-1">Payment amount</label>
          <CardExpiryElement className="ilv-form-control"/>
        </div>
      </div>
      </div>
    );
  }
});