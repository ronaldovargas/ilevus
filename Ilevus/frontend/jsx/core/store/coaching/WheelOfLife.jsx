/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var URL = Fluxbone.BACKEND_URL + "WheelOfLife";

var WheelOfLifeModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var WheelOfLifeStore = Fluxbone.Store.extend({
    ACTION_SAVE_CONFIGURATION: 'wheeloflife-saveConfiguration',
    ACTION_INITIALIZE_TOOL: 'wheeloflife-initializeTool',
    ACTION_SAVE_EVALUATION: 'wheeloflife-saveEvaluation',
    ACTION_SAVE_LEARNINGS: 'wheeloflife-saveLearnings',
    ACTION_REMOVE_TASK: 'wheeloflife-removeTask',
    ACTION_SAVE_TASK: 'wheeloflife-saveTask',
    ACTION_UPDATE_TASK: 'wheeloflife-updateTask',
    dispatchAcceptRegex: /^wheeloflife-[a-zA-Z0-9]+$/,

	url: URL,
	model: WheelOfLifeModel,

	saveConfiguration(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Configure",
	        dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                WheelOfLifeDefaults: params
            }),
            success(data, status, opts) {
                UserSession.get("user").Professional.Professional.CoachingToolsConfigs.WheelOfLifeDefaults = data;
	            me.trigger("save-configuration", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	initializeTool(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Initialize",
	        dataType: 'json',
            data: params,
	        success(data, status, opts) {
	            me.trigger("initialize-tool", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	saveEvaluation(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Evaluate",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("save-evaluation", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	saveLearnings(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/SaveLearnings",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("save-learnings", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	removeTask(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/RemoveTask",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("remove-task", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	saveTask(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/SaveTask",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("save-task", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateTask(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateTask",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("update-task", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

});

module.exports = new WheelOfLifeStore();
