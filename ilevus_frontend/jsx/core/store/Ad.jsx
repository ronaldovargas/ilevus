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
    ACTION_SAVE: 'ad-saveAd',
    ACTION_SEARCH_ADS: 'ad-searchAds',
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

	saveAd(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Save",
	        dataType: 'json',
	        data: JSON.stringify(params),
	        contentType: "application/json",
	        traditional: true,
	        success(data, status, opts) {
	            me.trigger("save-ad", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
    
	searchAds(keyword) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Search",
	        dataType: 'json',
	        data: {
	            Keyword: keyword
	        },
	        success(data, status, opts) {
	            me.trigger("search-ads", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	}

});

module.exports = new AdStore();
