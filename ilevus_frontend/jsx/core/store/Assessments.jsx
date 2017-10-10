/**
    Esta é a store da entidade de Avaliações de usuários.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var URL = Fluxbone.BACKEND_URL + "Assessments";

var AssessmentsModel = Fluxbone.Model.extend({
    url: URL,
    validate(attrs, options) {
        var errors = [];

        if (errors.length > 0)
            return errors;
    }
});

var AssessmentsStore = Fluxbone.Store.extend({
    ACTION_USER_ASSESSMENTS: 'assessments-getReceivedAssessments',
    ACTION_SEND_ASSESSMENTS: 'assessments-getSendAssessments',
    ACTION_GET_ASSESSMENT: 'assessments-getAssessment',
    ACTION_AVERAGE_ASSESSMENTS: 'assessments-getAverageAssessments',
    dispatchAcceptRegex: /^assessments-[a-zA-Z0-9]+$/,

    url: URL,
    model: AssessmentsModel,

    getAssessment(id) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/GetAssessment/" + id,
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("assessmentget", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    getSendAssessments(idAvaliador) {
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/GetSendedAssessment/" + idAvaliador,
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("sendeddassessmentget", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    },

    getReceivedAssessments(idAvaliado) {        
        var me = this;
        $.ajax({
            method: "GET",
            url: me.url + "/GetReceivedAssessment/" + idAvaliado,
            dataType: 'json',
            success(data, status, opts) {
                me.trigger("receivedassessmentget", data);
            },
            error(opts, status, errorMsg) {
                me.handleRequestErrors([], opts);
            }
        });
    }

});

module.exports = new AssessmentsStore();
