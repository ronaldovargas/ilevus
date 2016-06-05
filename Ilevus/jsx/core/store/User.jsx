/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");

var URL = Fluxbone.BACKEND_URL+"User";

var UserModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

	    if (string(attrs.Email).isEmpty()) {
			errors.push("O e-mail é obrigatório.");
	    }
	    if (string(attrs.Name).isEmpty()) {
	        errors.push("O nome é obrigatório.");
	    }
	    if (string(attrs.Surname).isEmpty()) {
	        errors.push("O sobrenome é obrigatório.");
	    }
	    if (string(attrs.Password).isEmpty()) {
	        errors.push("A senha é obrigatória.");
	    }
		if (attrs.Password != attrs.ConfirmPassword) {
			errors.push("As senhas digitadas não são iguais.");
		}

		if (errors.length > 0)
			return errors;
	}
});

var UserStore = Fluxbone.Store.extend({
    ACTION_RETRIEVE: 'user-retrieve',
    ACTION_SEARCH: 'user-search',
	ACTION_FIND: 'user-find',
	ACTION_DESTROY: 'user-destroy',
	dispatchAcceptRegex: /^user-[a-zA-Z0-9]+$/,

	url: URL,
	model: UserModel,

	search(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: Fluxbone.BACKEND_URL + "Search",
	        dataType: 'json',
	        //data: params,
	        success(data, status, opts) {
	            me.trigger("search", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	}

});

module.exports = new UserStore();
