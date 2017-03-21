/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Coaching";

var CoachingModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var CoachingStore = Fluxbone.Store.extend({
    ACTION_RETRIEVE_COACH_PROCESSES: 'coaching-retrieveCoachProcesses',
    ACTION_RETRIEVE_COACHEE_PROCESSES: 'coaching-retrieveCoacheeProcesses',
    ACTION_HIRE_PROFESSIONAL: 'coaching-hireProfessional',
    dispatchAcceptRegex: /^coaching-[a-zA-Z0-9]+$/,

	url: URL,
	model: CoachingModel,

	retrieveCoachProcesses(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Retrieve/Coach",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-coach-processes", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
	retrieveCoacheeProcesses(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Retrieve/Coachee",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-coachee-processes", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	hireProfessional(id) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Hire/" + id,
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("professional-hired", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

});

module.exports = new CoachingStore();
