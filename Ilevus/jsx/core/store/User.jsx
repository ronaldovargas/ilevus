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
	ACTION_SIGNUP: 'user-register',
	ACTION_FIND: 'user-find',
	ACTION_DESTROY: 'user-destroy',
	dispatchAcceptRegex: /^user-[a-zA-Z0-9]+$/,

	url: URL,
	model: UserModel,

	register(data) {
	    this.create(data, {
            url: this.url+"/Register"
	    });
	}

});

module.exports = new UserStore();
