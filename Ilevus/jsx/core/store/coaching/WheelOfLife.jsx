/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

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
    ACTION_INITIALIZE_TOOL: 'wheeloflife-initializeTool',
    ACTION_SAVE_EVALUATION: 'wheeloflife-saveEvaluation',
    ACTION_SAVE_LEARNINGS: 'wheeloflife-saveLearnings',
    dispatchAcceptRegex: /^wheeloflife-[a-zA-Z0-9]+$/,

	url: URL,
	model: WheelOfLifeModel,

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

});

module.exports = new WheelOfLifeStore();
