/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Payment";

var PaymentModel = Fluxbone.Model.extend({
    url: URL,
    validate(attrs, options) {
        var errors = [];
        if (errors.length > 0)
            return errors;
    }
});

var PaymentStore = Fluxbone.Store.extend({
    ACTION_GET_ALL: 'payment-getAll',
    url: URL,
    model: PaymentModel,

    getAll() {
        var me = this;
        $.ajax({
            method: "GET",
            url: Fluxbone.BACKEND_URL + "/Payment",
            dataType: 'json',
            data: null,
            success(data, status, opts) {
                me.trigger("all", data);
                data = null;
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    }
});

module.exports = new PaymentStore();
