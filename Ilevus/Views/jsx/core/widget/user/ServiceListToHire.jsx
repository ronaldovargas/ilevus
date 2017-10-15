var S = require("string");
var React = require("react");
var MaskedInput = require("react-maskedinput");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var cartStore = require("./../../store/Cart.jsx");
var classNames = require('classnames');
var isInCart = false;
module.exports = React.createClass({
    propTypes: {
        service: React.PropTypes.object.isRequired
    },

    getInitialState() {
        console.log(cartStore.getCacheServicesHired());
        console.log(this.props.service);
        console.log(cartStore.isInCart(this.props.service));
        return {
            isInCart: cartStore.isInCart(this.props.service)
        }
    },
    handleClick() {

        if (this.state.isInCart) {
            this.removeFromCart(this.props.service);
        } else {
            this.addToCart(this.props.service);
        }
        
        this.setState({
             isInCart: cartStore.isInCart(this.props.service)
        });
        console.log(cartStore.getCacheServicesHired());
    },
    addToCart(service) {
         cartStore.dispatch({
            action: cartStore.ACTION_TO_HIRE_SERVICE,
            data: service
        });
    },
    removeFromCart(service) {
        cartStore.dispatch({
            action: cartStore.ACTION_REMOVE_HIRED_SERVICE,
            data: service
        });
    },
    render() {
        let text = this.state.isInCart ? Messages.get("ActionToCancelHireService") : Messages.get("ActionToHireService");
        var btnClass = classNames({
            'ilv-btn': true,
            'ilv-btn-primary': !this.state.isInCart,
            'ilv-btn-danger': this.state.isInCart,
        });

        return <tr>
            <td className="ilv-font-weight-semibold">{this.props.service.Name}</td>
            <td className="ilv-text-xs-right">{this.props.service.Price}</td>
            <td className="ilv-text-xs-right">
                <button
                    onClick={this.handleClick}
                    className={btnClass}>
                    {text}</button>
            </td>
        </tr>
    }
});
