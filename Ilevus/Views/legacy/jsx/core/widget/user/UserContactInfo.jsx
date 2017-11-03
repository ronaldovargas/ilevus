
var S = require("string");
var React = require("react");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    propTypes: {
        user: PropTypes.object.isRequired
    },

    render() {
        console.log(this.props.user);
        var user = this.props.addressData;
        return <div className={this.props.className}>
            <h3 className="ilv-text-primary">{this.props.user.Name} {this.props.user.Surname}</h3>
            <h4>{Messages.get("LabelPhoneNumber")}: {this.props.user.PhoneNumber}</h4>
        </div>;
    }
});
