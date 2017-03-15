/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Coaching";

var CoachingModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var CoachingStore = Fluxbone.Store.extend({
    ACTION_RETRIEVE_ADS: 'coaching-retrieveAds',
    ACTION_HIRE_PROFESSIONAL: 'coaching-hireProfessional',
    dispatchAcceptRegex: /^coaching-[a-zA-Z0-9]+$/,

	url: URL,
	model: CoachingModel,

	retrieveAds(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Retrieve",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-ads", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	hireProfessional(id) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Hire/" + id,
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("professional-hired", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

});

module.exports = new CoachingStore();
