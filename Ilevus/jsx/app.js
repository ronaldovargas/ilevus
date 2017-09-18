
require("bootstrap/scss/bootstrap.scss");
require("ilevus/css/html5-boilerplate/main.css");
require("ilevus/sass/anvil.scss");

window.jQuery = require("jquery");
require("blueimp-file-upload/js/jquery.iframe-transport.js");
require("blueimp-file-upload");
window.Tether = require("tether");
require("bootstrap/dist/js/bootstrap.js");
require("ilevus/jsx/AppSetup.jsx");


//     // configure Stripe Checkout
// this.stripeHandler = window.StripeCheckout.configure({
//     key: "<YOUR_STRIPE_PUBLISHABLE_KEY>",
//     image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
//     locale: 'auto',
//     token: this.onGetStripeToken.bind(this)
// });
