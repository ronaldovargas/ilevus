
var S = require("string");
var React = require("react");
var MaskedInput = require("react-maskedinput");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    render() {
        console.log(this.props.user);
        var user = this.props.addressData;
        return <div className={this.props.className}>
            <h3 className="ilv-text-primary">{this.props.user.get("Name")} {this.props.user.get("Surname")}</h3>
            <h4>{Messages.get("LabelPhoneNumber")}: {this.props.user.get("PhoneNumber")}</h4>
        </div>;
    }
});
