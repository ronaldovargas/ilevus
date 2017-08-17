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
    ACTION_SEND_NOTIFICATION: 'notifications-sendNotification',
    ACTION_GET_NOTIFICATION: 'notifications-getNotification',
    dispatchAcceptRegex: /^notifications-[a-zA-Z0-9]+$/,

    url: URL,
    model: NotificationsModel,

    getNotification(id) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/GetNotification/" + id,
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("notificationget", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

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
            url: me.url + "/UserNotifications/"+params.Id,
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("notificationsuser", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },
    sendNotification(params) {
        var me = this;
        $.ajax({
            method: "POST",
            url: me.url + "/Send",
            dataType: "json",
            data: params,
            success(data, status, opts) {
                me.trigger("send-notification", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        })
    }

});

module.exports = new NotificationsStore();
