/**
    Este componente gerencia as mensagens internacionalizadas de sistema.
*/

var $ = require("jquery");

module.exports = {
    _loaded: false,
    _messages: null,
    _culture: null,
    get: function (key) {
        return this._messages ?
            (this._messages[key] ?
                this._messages[key]:"???"+key+"???"
            ):"!!!MESSAGES_NOT_LOADED!!!";
    },
    load: function (callback) {
        var me = this;
        if (me._loaded) {
            console.warn("Messages already loaded.");
            return null;
        }
        $.ajax({
            url: BACKEND_URL + "Messages",
            method: "GET",
            dataType: 'json',
            success: function (data, status, opts) {
                me._messages = data;
                me._loaded = true;
                callback(true);
            },
            error: function (opts, status, errorMsg) {
                console.error("Error loading system messages:\n", opts, status, errorMsg);
                callback(false);
            }
        });
    }
};