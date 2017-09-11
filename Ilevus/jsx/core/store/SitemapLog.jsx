/**
    Esta é a store da entidade de logs de geração de sitemap.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Sitemap";

var SiteMapLogModel = Fluxbone.Model.extend({
    url: URL,
    validate(attrs, options) {
        var errors = [];

        if (errors.length > 0)
            return errors;
    }
});

var SitemapLogStore = Fluxbone.Store.extend({
    ACTION_SITEMAP_GET: 'sitemap-getAll',
    ACTION_SITEMAP_DEL: 'sitemap-delAll',
    ACTION_SITEMAP_GENERATE: 'sitemap-generate',
    dispatchAcceptRegex: /^sitemap-[a-zA-Z0-9]+$/,

    url: URL,
    model: SiteMapLogModel,

    getAll() {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/GetLog",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("sitemaplogget", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    delAll() {
        var me = this;
        $.ajax({
            method: "DELETE",
            url: me.url + "/RemoveAll",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("sitemapdelete", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    generate() {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/GenerateNow",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("sitemapgenerateget", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    }

});

module.exports = new SitemapLogStore();
