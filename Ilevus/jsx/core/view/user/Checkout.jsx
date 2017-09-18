var React = require("react");

var Modal = require('boron/DropModal');

var MyStoreCheckout = require('./../../widget/stripe/MyStoreCheckout.jsx');
var StripeProvider = require('react-stripe-elements/lib/index').StripeProvider;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

module.exports = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
},
  getInitialState(){
    return {
      user: null
    }
  },

  componentDidMount() {

  },

  showModal() {
    this.refs.modal.show();
  },
  hideModal() {
    this.refs.modal.hide();
  },

  callback(event) {
    var me = this;
    if (!UserSession.get("logged")) {
      me.context.router.push("/login");
      return;
    }
    me.state.user = UserSession.get("user");
  },

  render() {
    return (
      <div>
        <button onClick={this.showModal}>Open</button>
        <Modal ref="modal" onShow={this.callback}>
          <StripeProvider apiKey="pk_RXwtgk4Z5VR82S94vtwmam6P8qMXQ">
            <MyStoreCheckout></MyStoreCheckout>
          </StripeProvider>
        </Modal>
      </div>
    );
  }
});