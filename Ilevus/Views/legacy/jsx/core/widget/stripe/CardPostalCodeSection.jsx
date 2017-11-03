var React = require('react');

var PostalCodeElement = require('react-stripe-elements/lib/index').PostalCodeElement;
module.exports = React.createClass({

  render() {
    return (
      <div className="ilv-form-group">
        <label className="ilv-control-label mb-1">CEP</label>
        <PostalCodeElement className="ilv-form-control"/>
      </div>
    );
  }
});