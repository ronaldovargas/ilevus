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

    ACTION_RETRIEVE_ADS_BALANCE: 'ad-retrieveAdsBalance',

    ACTION_RETRIEVE_ADS: 'ad-retrieveAds',
    ACTION_SAVE: 'ad-saveAd',

    ACTION_SEARCH_ADS: 'ad-searchAds',
    ACTION_SEARCH_MOBILE_ADS: 'ad-searchMobileAds',

    ACTION_CHECK_MODERATIONS_ADS: 'ad-checkModerationsAds',
    ACTION_RETRIEVE_MODERATIONS_ADS: 'ad-retrieveModerationsAds',

    ACTION_LEAVE_MODERATION: 'ad-leaveModerationsAds',
    ACTION_CATCH_MODERATION: 'ad-catchModerationsAds',
    ACTION_SAVE_MODERATION: 'ad-saveModerationsAds',

    ACTION_COUNT_PREVIEWS_MODERATION: 'ad-getCountPreviewsModeration',

    dispatchAcceptRegex: /^ad-[a-zA-Z0-9]+$/,

    url: URL,
    model: AdModel,

    retrieveAdsBalance(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/RetrieveBalance",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("retrieve-ads-balance", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    //

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

    searchAds(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/Search",
            dataType: 'json',
            data: { Keyword: params.keyword, Limit: params.limit, isMobile: params.isMobile },
            success(data, status, opts) {
                me.trigger("search-ads", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    searchMobileAds(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/Search",
            dataType: 'json',
            data: { Keyword: params.keyword, Limit: params.limit, isMobile: params.isMobile },
            success(data, status, opts) {
                me.trigger("search-mobile-ads", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    checkModerationsAds(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/CheckPendingModerations",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("check-moderation-ads", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    retrieveModerationsAds(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/RetrievePendingModerations",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("retrieve-moderation-ads", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    catchModerationsAds(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/CatchAdModeration",
            dataType: 'json',
            data: { Id: params.Id, Status: params.Status },
            success(data, status, opts) {
                me.trigger("catch-moderation-ad", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    saveModerationsAds(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/SaveAdModeration",
            dataType: 'json',
            data: { Id: params.Id, Status: params.Status },
            success(data, status, opts) {
                me.trigger("save-moderation-ad", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    leaveModerationsAds(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/LeaveAdModeration",
            dataType: 'json',
            data: { Id: params.Id },
            success(data, status, opts) {
                me.trigger("leave-moderation-ad", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    getCountPreviewsModeration(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/CountPreviewsModeration",
            dataType: 'json',
            //data: { Id: params.Id },
            success(data, status, opts) {
                me.trigger("count-previews-moderation-ad", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    }
});

module.exports = new AdStore();
