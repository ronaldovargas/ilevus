/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Ad";

var AdModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var AdStore = Fluxbone.Store.extend({
    ACTION_RETRIEVE_ADS: 'ad-retrieveAds',
    dispatchAcceptRegex: /^ad-[a-zA-Z0-9]+$/,

	url: URL,
	model: AdModel,

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

	retrieveMyMeetings(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/MyMeetings",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-my-meetings", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	bookMeeting(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/BookMeeting",
	        dataType: 'json',
	        data: {
	            UserId: params.UserId,
	            CoacheeEmail: params.CoacheeEmail,
	            CoacheeFullName: params.CoacheeFullName,
	            CoacheePhone: params.CoacheePhone,
	            Subject: params.Subject,
	            Begin: params.Begin
	        },
	        success(data, status, opts) {
	            me.trigger("book-meeting", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	saveConfig(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Config",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("save-config", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	}

});

module.exports = new AdStore();
