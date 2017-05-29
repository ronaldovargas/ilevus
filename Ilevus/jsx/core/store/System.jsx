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
    ACTION_RETRIEVE_MESSAGES: 'system-retrieveMessages',
    ACTION_RETRIEVE_CONFIG: 'system-retrieveConfig',
    ACTION_UPDATE_CONFIG_EMAIL: 'system-updateConfigEmail',
    ACTION_UPDATE_CONFIG_APIS: 'system-updateConfigApis',
    ACTION_ADD_TRANSLATION_KEY: "system-addTranslationKey",
    ACTION_REVIEW_TRANSLATION_KEY: "system-reviewTranslationKey",
    ACTION_UPDATE_TRANSLATION: "system-updateTranslation",
    ACTION_SYNC_TRANSLATIONS: "system-syncTranslations",
    dispatchAcceptRegex: /^system-[a-zA-Z0-9]+$/,

	url: URL,
	model: SystemConfigModel,

	addTranslationKey(key) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: BACKEND_URL + "Messages/Report?key=" + key,
	        success() {
	            me.trigger("add-translation-key");
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	reviewTranslationKey(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Messages/Review",
	        data: params,
	        success() {
	            me.trigger("review-translation-key");
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateTranslation(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Messages",
            data: params,
	        success() {
	            me.trigger("update-translation");
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	retrieveMessages() {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Messages",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-messages", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

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
	},

	updateConfigApis(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Config/Apis",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("update-config-apis", data);
	            me.trigger("retrieve-config", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	syncTranslations(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Messages/Sync",
	        dataType: 'json',
            contentType: "application/json",
	        data: JSON.stringify(params),
	        success(data, status, opts) {
	            me.trigger("translations-synced", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	}

});

module.exports = new SystemStore();
