/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

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
    ACTION_RETRIEVE_USER_SUBSCRIPTION: 'financial-retrieveUserSubscription',
    ACTION_UPDATE_USER_SUBSCRIPTION: 'financial-updateUserSubscription',
    dispatchAcceptRegex: /^financial-[a-zA-Z0-9]+$/,

	url: URL,
	model: FinancialModel,

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


});

module.exports = new FinancialStore();
