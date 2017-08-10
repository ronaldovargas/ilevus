/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var NotificationStore = require("ilevus/jsx/core/store/notifications/Notification.jsx");
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
    ACTION_RETRIEVE_MEETINGS: 'schedule-retrieveMeetings',
    ACTION_RETRIEVE_MY_MEETINGS: 'schedule-retrieveMyMeetings',
    ACTION_BOOK_MEETING: 'schedule-bookMeeting',
    ACTION_SAVE_CONFIG: 'schedule-saveConfig',
    dispatchAcceptRegex: /^schedule-[a-zA-Z0-9]+$/,

	url: URL,
	model: ScheduleModel,

	retrieveMeetings(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Meetings",
	        dataType: 'json',
	        data: {
	            UserId: params.UserId,
	            From: params.From,
	            To: params.To
	        },
	        success(data, status, opts) {
	            me.trigger("retrieve-meetings", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	retrieveMyMeetings(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/MyMeetings",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-my-meetings", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	bookMeeting(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/BookMeeting",
	        dataType: 'json',
	        data: {
	            UserId: params.UserId,
	            CoacheeEmail: params.CoacheeEmail,
	            CoacheeFullName: params.CoacheeFullName,
	            CoacheePhone: params.CoacheePhone,
	            Subject: params.Subject,
	            Begin: params.Begin
	        },
	        success(data, status, opts) {
	            NotificationStore.dispatch({
	                action: NotificationStore.ACTION_SEND_NOTIFICATION,
	                data: {

            
	                    User_id: params.UserId,
	            From: "",
	            InfoNotification: "nova notificação de booking",
	            DateNotification: new Date(),
	            Status: false
	        

	                }
	            });


	            me.trigger("book-meeting", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	saveConfig(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Config",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("save-config", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	}

});

module.exports = new ScheduleStore();
