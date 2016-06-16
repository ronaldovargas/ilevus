/**
    Esta é a store da entidade de Usuário do sistema.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var string = require("string");

var URL = Fluxbone.BACKEND_URL+"User";

var UserModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
	    var errors = [];

	    if (string(attrs.Email).isEmpty()) {
	        errors.push(Messages.get("ValidationEmailRequired"));
	    }
	    if (string(attrs.Name).isEmpty()) {
	        errors.push(Messages.get("ValidationNameRequired"));
	    }
	    if (string(attrs.Surname).isEmpty()) {
	        errors.push(Messages.get("ValidationSurnameRequired"));
	    }
	    if (string(attrs.Password).isEmpty()) {
	        errors.push(Messages.get("ValidationPasswordRequired"));
	    }
		if (attrs.Password != attrs.ConfirmPassword) {
		    errors.push(Messages.get("ValidationPasswordsDontMatch"));
		}

		if (errors.length > 0)
			return errors;
	}
});

var UserStore = Fluxbone.Store.extend({
    ACTION_RETRIEVE: 'user-retrieve',
    ACTION_SIGNUP: 'user-signup',
    ACTION_SEARCH: 'user-search',
	ACTION_FIND: 'user-find',
	ACTION_DESTROY: 'user-destroy',
	dispatchAcceptRegex: /^user-[a-zA-Z0-9]+$/,

	url: URL,
	model: UserModel,

	signup(data) {
	    return this.create(data, {
            url: this.url+"/Register"
	    });
	},
	search(params) {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: Fluxbone.BACKEND_URL + "Search",
	        dataType: 'json',
	        data: params,
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
