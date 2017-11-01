/**
    Esta é a store da entidade de Relatórios do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Report";

var ReportsModel = Fluxbone.Model.extend({
    url: URL,
    validate(attrs, options) {
        var errors = [];

        if (errors.length > 0)
            return errors;
    }
});

var ReportsStore = Fluxbone.Store.extend({
    ACTION_DOWNLOAD_PRODUTIVITY_CSV: 'rep-downloadProductivityCSV',

    ACTION_ADS_CLICKS: 'rep-adsClicks',
    ACTION_ADS_VIEWS: 'rep-adsViews',

    dispatchAcceptRegex: /^rep-[a-zA-Z0-9]+$/,

    url: URL,
    model: ReportsModel,


    downloadProductivityCSV(params) {
        var me = this;
        /*$.ajax({
            method: "GET",
            url: me.url + "/DownloadProductivityReport",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("download-productivity-report", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });*/
        var strHTML = "?dtInit=" + params["DtInit"];
        strHTML += "&dtEnd=" + params["DtEnd"];
        strHTML += "&searchTerm=" + params["SearchTerm"];
        jQuery('<form action="' + me.url + '/DownloadProductivityReport' + strHTML + '" method="post" target="_blank"></form>').appendTo('body').submit().remove();
    },

    adsClicks(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/AdsClicks_Views",
            data: { Id: params.Id, modeView: params.modeView, DtIni: params.DtIni, DtEnd: params.DtEnd, Click_View: "click" },
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("load-clicks-report", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    adsViews(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/AdsClicks_Views",
            data: { Id: params.Id, modeView: params.modeView, DtIni: params.DtIni, DtEnd: params.DtEnd, Click_View: "view" },
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("load-views-report", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    }

});



module.exports = new ReportsStore();