/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");


var URL = Fluxbone.BACKEND_URL+"Account";

var UserModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
		var errors = [];
		if (attrs.FirstName == undefined || attrs.FirstName == "") {
			errors.push("O primeiro nome é obrigatório.");
		}
		if (attrs.LastName == undefined || attrs.LastName == "") {
			errors.push("O sobrenome é obrigatório.");
		}
		if (attrs.Email == undefined || attrs.Email == "") {
			errors.push("O e-mail é obrigatório.");
		}
		if (attrs.Password == undefined || attrs.Password == "") {
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
	ACTION_SIGNUP: 'user-create',
	ACTION_FIND: 'user-find',
	ACTION_DESTROY: 'user-destroy',
	dispatchAcceptRegex: /^user-[a-zA-Z0-9]+$/,

	url: URL,
	model: UserModel

});

module.exports = new UserStore();
