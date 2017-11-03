var S = require("string");
var React = require("react");
var MaskedInput = require("react-maskedinput");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var cartStore = require("./../../store/Cart.jsx");
var Modal = require('boron/DropModal');

var Checkout = require('./../../widget/stripe/MyStoreCheckout.jsx');
var StripeProvider = require('react-stripe-elements/lib/index').StripeProvider;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var CurrencyUtils = require("ilevus/jsx/core/util/CurrencyUtils.jsx");
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    propTypes: {
        service: React.PropTypes.object.isRequired,
        blocked: React.PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            user: null,
        }
    },
    componentDidMount() {
        this.state.userLooged = UserSession.get("logged");
    },

    showModal() {
        this.refs.modal.show();
    },
    hideModal() {
        this.refs.modal.hide();
    },

    callback(event) {
        if (!UserSession.get("logged")) {
            this.context.router.push("/login");
            return;
        }
        this.state.user = UserSession.get("user");
    },
    render() {
        var divStyle = {
            visibility: 'hidden'
        };

        const hidden = !this.props.blocked ? {} : divStyle;
        return <tr>
            <td className="ilv-font-weight-semibold">{this.props.service.Name}
                <Modal ref="modal" onShow={this.callback}>
                    <StripeProvider apiKey="pk_test_p00RSg3UpH2EcSOh7Qsu0Aif">
                        <Checkout service={this.props.service}></Checkout>
                    </StripeProvider>
                </Modal>
            </td>
            <td className="ilv-text-xs-right">{CurrencyUtils.format(this.props.service.Price)}</td>

            <td className="ilv-text-xs-right">
                <div style={hidden}>
                    <button onClick={this.showModal} className={'ilv-btn-primary'}>
                        {Messages.get("ActionToHireService")}
                    </button>
                </div>
            </td>
        </tr>
    }
});
