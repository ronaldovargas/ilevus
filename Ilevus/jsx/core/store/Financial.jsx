/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");
var cartStore = require("./Cart.jsx");
var URL = Fluxbone.BACKEND_URL + "Financial";

var FinancialModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var FinancialStore = Fluxbone.Store.extend({
    ACTION_RETRIEVE_SUBSCRIPTIONS_CUSTOMER: 'financial-retrieveSubscriptionsCustomer',
    ACTION_RETRIEVE_SUBSCRIPTIONS_CUSTOMERS: 'financial-retrieveSubscriptionsCustomers',
    ACTION_RETRIEVE_USER_SUBSCRIPTION: 'financial-retrieveUserSubscription',
    ACTION_UPDATE_USER_SUBSCRIPTION: 'financial-updateUserSubscription',
    ACTION_TO_HIRE_SERVICE: 'financial-toHireService',
    dispatchAcceptRegex: /^financial-[a-zA-Z0-9]+$/,

	url: URL,
	model: FinancialModel,

	retrieveSubscriptionsCustomer(id) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Subscriptions/Customers/" + id,
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-subscriptions-customer", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	retrieveSubscriptionsCustomers(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Subscriptions/Customers",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-subscriptions-customers", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	retrieveUserSubscription(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Subscription",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-user-subscription", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateUserSubscription(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Subscription",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            UserSession.get("user").Premium = {
	                Active: true,
                    Late: false
	            };
	            me.trigger("update-user-subscription", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	toHireService(params) {
		var me = this;
		console.log('contratou');
		console.log(cartStore.getCacheServicesHired());
	    $.ajax({
	        method: "POST",
	        url: me.url + "/HireService",
	        dataType: 'json',
			data: {Services: cartStore.getCacheServicesHired() },
	        success(data, status, opts) {
	            me.trigger("update-user-subscription", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
});

module.exports = new FinancialStore();
