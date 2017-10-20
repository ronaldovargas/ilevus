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
    }

});



module.exports = new ReportsStore();