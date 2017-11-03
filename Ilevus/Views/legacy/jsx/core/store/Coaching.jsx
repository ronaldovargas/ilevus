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
    ACTION_RETRIEVE_COACHING_PROCESS: 'coaching-retrieveCoachingProcess',
    ACTION_POLL_PROCESS_MODIFICATIONS: 'coaching-pollProcessModifications',
    ACTION_HIRE_PROFESSIONAL: 'coaching-hireProfessional',
    ACTION_UPDATE_SESSION_FIELD: 'coaching-updateSessionField',
    ACTION_NEW_SESSION: 'coaching-newSession',
    ACTION_START_SESSION: 'coaching-startSession',
    ACTION_FINISH_SESSION: 'coaching-finishSession',
    ACTION_CHANGE_SESSION_PROCESS_STEP: 'coaching-changeSessionProcessStep',
    ACTION_EVALUATE_SESSION: 'coaching-evaluateSession',
    ACTION_ADD_TAG: 'coaching-addTag',
    ACTION_REMOVE_TAG: 'coaching-removeTag',
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

	retrieveCoachingProcess(id) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Retrieve/Process/" + id,
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("retrieve-coaching-process", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	pollProcessModifications(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/Retrieve/Process/" + params.id,
	        dataType: 'json',
	        data: {
                lastModified: params.lastModified
	        },
	        success(data, status, opts) {
	            if (data)
	                me.trigger("process-modified", data);
	            else
	                me.trigger("process-not-modified");
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

	updateSessionField(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Update/SessionField",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("updated-session-field", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	newSession(id) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/" + id + "/NewSession",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("new-session", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
	startSession(id) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/" + id + "/StartSession",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("start-session", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
	finishSession(id) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/" + id + "/FinishSession",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("finish-session", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	changeSessionProcessStep(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/ChangeSessionProcessStep",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("change-session-process-step", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	evaluateSession(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/EvaluateSession",
	        dataType: 'json',
            data: params,
	        success(data, status, opts) {
	            me.trigger("evaluate-session", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	addTag(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/AddTag",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("add-tag");
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
	removeTag(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/RemoveTag",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("add-tag");
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

});

module.exports = new CoachingStore();
