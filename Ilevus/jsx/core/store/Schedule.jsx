/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Schedule";

var ScheduleModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var ScheduleStore = Fluxbone.Store.extend({
    ACTION_POLL_CONTACTS: 'schedule-pollContacts',
    ACTION_POLL_NEW_MESSAGES: 'schedule-pollNewMessages',
    ACTION_RETRIEVE_CONVERSATION: 'schedule-retrieveConversation',
    ACTION_SEND_MESSAGE: 'schedule-sendMessage',
    dispatchAcceptRegex: /^schedule-[a-zA-Z0-9]+$/,

	url: URL,
	model: ScheduleModel,

	pollContacts(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/PollContacts",
	        dataType: 'json',
	        data: {
	            Since: params.Since
	        },
	        success(data, status, opts) {
	            me.trigger("poll-contacts", data.Contacts);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

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

module.exports = new ScheduleStore();
