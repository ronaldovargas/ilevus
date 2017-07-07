/**
    Esta é a store da entidade de Notificacoes do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Notifications";

var NotificationsModel = Fluxbone.Model.extend({
    url: URL,
    validate(attrs, options) {
        var errors = [];

        if (errors.length > 0)
            return errors;
    }
});

var NotificationsStore = Fluxbone.Store.extend({
    ACTION_USER_NOTIFICATIONS: 'notifications-notificationsUser',
    ACTION_ALL_NOTIFICATIONS: 'notifications-notificationsAll',
    dispatchAcceptRegex: /^notifications-[a-zA-Z0-9]+$/,
    
    url: URL,
    model: NotificationsModel,

    notificationsAll(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/AllNotifications",
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("notificationsall", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },
    notificationsUser(params) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/UserNotifications/"+param.Id,
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("notificationsuser", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    }

});

module.exports = new NotificationsStore();
