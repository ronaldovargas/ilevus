/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL+"System";

var SystemConfigModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var SystemStore = Fluxbone.Store.extend({
    ACTION_RETRIEVE_CONFIG: 'system-retrieveConfig',
    ACTION_UPDATE_CONFIG_EMAIL: 'system-updateConfigEmail',
    dispatchAcceptRegex: /^system-[a-zA-Z0-9]+$/,

	url: URL,
	model: SystemConfigModel,

	retrieveConfig() {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Config",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-config", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateConfigEmail(params) {
	    var me = this;
	    var which = params.which;
	    delete params.which;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Config/"+which,
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("update-config-email", data);
	            me.trigger("retrieve-config", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	}

});

module.exports = new SystemStore();
