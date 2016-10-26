/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL+"Chat";

var ChatModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var ChatStore = Fluxbone.Store.extend({
    ACTION_POLL_NEW_MESSAGES: 'chat-pollNewMessages',
    ACTION_RETRIEVE_CONVERSATION: 'chat-retrieveConversation',
    ACTION_SEND_MESSAGE: 'chat-sendMessage',
    dispatchAcceptRegex: /^chat-[a-zA-Z0-9]+$/,

	url: URL,
	model: ChatModel,

	pollNewMessages(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Poll",
	        dataType: 'json',
	        data: {
	            Destination: params.Destination,
	            Since: params.Since
	        },
	        success(data, status, opts) {
	            me.trigger("poll-new-messages", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	retrieveConversation(destination) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Ensure",
	        dataType: 'json',
	        data: {
                Destination: destination
	        },
	        success(data, status, opts) {
	            me.trigger("retrieve-conversation", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	sendMessage(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Send",
	        dataType: 'json',
	        data: {
	            Destination: params.Destination,
                Content: params.Content
	        },
	        success(data, status, opts) {
	            me.trigger("send-message", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	}

});

module.exports = new ChatStore();
