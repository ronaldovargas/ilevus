/**
    Este componente gerencia as mensagens internacionalizadas de sistema.
*/

var $ = require("jquery");
var S = require("string");
var config = require("config")
var axios = require('axios');

module.exports = {
    _loaded: false,
    _messages: null,
    _culture: null,
    _get: function (key) {
        if (!this._messages) {
            //throw "messages not loaded error.";
            return S(null);
        }
        return S(this._messages[key]);
    },
    _reportUnexistentKey(key) {
        if (S(key).isEmpty() || S(key).startsWith("_"))
            return;
        $.ajax({
            method: "POST",
            url: config.BACKEND_URL + "Messages/Report?key=" + key,
            success() {
                console.warn("Reported unexistent key:", key);
            },
            error() {
                console.error("Failed to report unexistent key:", key);
            }
        });
    },

    getFile: function (key, dest) {
        $.get(key, function (data) {
            $('#' + dest).html(data);
        });
    },

    get: function (key) {
        var str = this._get(key);
        if (str.isEmpty()) {
            this._reportUnexistentKey(key);
            return "???" + key + "???";
        }
        return str.s;
    },
    format: function (key, values) {
        var str = this._get(key);
        if (str.isEmpty()) {
            this._reportUnexistentKey(key);
            return "???" + key + "???";
        }
        var tplValues = {};
        for (var i = 0; i < values.length; i++) {
            tplValues["" + i] = values[i];
        }
        return str.template(tplValues).s;
    },
    formatWithKeys: function (key, valueKeys) {
        var str = this._get(key);
        if (str.isEmpty()) {
            this._reportUnexistentKey(key);
            return "???" + key + "???";
        }
        var tplValues = {};
        for (var i = 0; i < valueKeys.length; i++) {
            tplValues["" + i] = this.get(valueKeys[i]);
        }
        return str.template(tplValues).s;
    },
    load: function () {
        var me = this;
        if (this._loaded) {
            console.warn("Messages already loaded.");
            return null;
        }
        return new Promise((resolve, reject) => {
            axios.get(config.BACKEND_URL + "Messages/Current")
                .then(response => {
                    console.log(response);
                    me._messages = response.data;
                    me._loaded = true;
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                    console.error("Error loading system messages:\n", opts, status, errorMsg);
                });
        });
    }
};