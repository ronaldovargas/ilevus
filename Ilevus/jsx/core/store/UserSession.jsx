/**
    Este é um modelo global diferente dos outros. Ele é responsável por todo o controle de sessão
    e autenticação/autorização do usuário do sistema.
*/

var _ = require("underscore");
var Backbone = require("backbone");
var Dispatcher = require("flux").Dispatcher;

var UserSession = Backbone.Model.extend({
	ACTION_REFRESH: 'refreshStatus',
	ACTION_LOGIN: 'login',
	ACTION_LOGOUT: 'logout',
	ACTION_CONFIRM_EMAIL: 'confirmEmail',
	ACTION_CONFIRMATION_EMAIL: 'confirmationEmail',
	ACTION_RECOVER_PASSWORD: 'recoverPassword',
	ACTION_CHECK_RECOVER_TOKEN: 'checkRecoverToken',
	ACTION_RESET_PASSWORD: 'resetPassword',
	ACTION_UPDATE_PROFILE: 'updateProfile',

	BACKEND_URL: BACKEND_URL,
	url: BACKEND_URL + "User",
	$dispatcher: new Dispatcher(),
	dispatch(payload) {
		this.$dispatcher.dispatch(payload);
	},
	dispatchCallback(payload) {
		if (payload.action) {
			var method = this[payload.action];
			if (typeof method === 'function') {
				method.call(this, payload.data);
			} else {
				console.warn("UserSession: The action (method)",payload.action,"is not defined.");
			}
		} else {
			console.warn("UserSession: The dispatching action must be defined.\n",payload);
		}
	},
	initialize() {
		this.dispatchToken = this.$dispatcher.register(this.dispatchCallback.bind(this));
		if (sessionStorage.token && (sessionStorage.token != "")) {
		    this.setAuthorization(sessionStorage.token);
		    this.set({ loading: true });
		    this.refreshStatus(true);
		} else if (localStorage.token && (localStorage.token != "")) {
		    this.setAuthorization(localStorage.token);
		    this.set({loading: true});
			this.refreshStatus(true);
		} else {
		    this.set({ loading: false });
		}
	},

	parse(response, opts) {
		return response.data ? {
			logged: true,
			user: response.data.user,
			accessLevel: response.data.accessLevel,
			permissions: response.data.permissions
		}:{
			logged: false
		};
	},

	clearStorage() {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userId");
	},
	putStorage(token, userId, stayconnected) {
	    if (stayconnected) {
	        localStorage.token = token;
	        localStorage.userId = userId;
	    }
	    sessionStorage.token = token;
	    sessionStorage.userId = userId;
	},
	setAuthorization(token) {
	    $.ajaxSetup({
	        headers: {
	            "Authorization": "Bearer "+token
	        }
	    });
	},

	refreshStatus(initial) {
		var me = this;
		$.ajax({
			method: "GET",
			url: me.url + "/UserInfo",
			dataType: 'json',
			success(data, status, opts) {
			    console.log(data);
				me.set({
					"logged": true,
					"user": data
				});
				me.trigger("login", me);
				if (me.get("loading")) {
					me.set({loading: false});
					me.trigger("loaded", true);
				}
			},
			error(opts, status, errorMsg) {
				if (me.get("loading")) {
				    me.set({ loading: false });
				}
				me.clearStorage();
				location.assign("#/");
			}
		});
	},

	handleRequestErrors(collection, opts) {
		if (opts.status == 400) {
		    if (opts.responseJSON.error_description) {
		        this.trigger("fail", opts.responseJSON.error_description);
		    } else if (opts.responseJSON.Message) {
		        this.trigger("fail", opts.responseJSON.Message);
		    } else {
		        this.trigger("fail", opts.responseJSON.error);
		    }
		} else if (opts.status == 409) {
			// Validation errors
			try {
				var resp = JSON.parse(opts.responseText);
			} catch (err) {
				resp = {
					message: "Unexpected server error "+opts.status+" "+opts.statusText+": "+opts.responseText
				};
			}
			this.trigger("fail", resp.message);
		} else {
			this.trigger("fail", "Unexpected server error "+opts.status+" "+opts.statusText+": "+opts.responseJSON.message);
		}
	},

	login(data) {
	    var me = this,
            stayconnected = data.stayconnected,
			errors = [];
		if (!(data.email) || (data.email == '')) {
			errors.push("Digite seu e-mail.");
		}
		if (!(data.password) || (data.password == '')) {
			errors.push("Digite sua senha.");
		}

		if (errors.length > 0) {
			me.trigger("fail", errors);
		} else {
			$.ajax({
				method: "POST",
				url: BACKEND_URL + "Token",
				dataType: 'json',
				data: {
				    "grant_type": "password",
				    "username": data.email,
                    "Password": data.password
				},
				success(data, status, opts) {
				    me.putStorage(data.access_token, data.userName, stayconnected);
				    me.setAuthorization(data.access_token);
				    me.refreshStatus();
				},
				error(opts, status, errorMsg) {
					me.handleRequestErrors([], opts);
				}
			});
		}
	},
	logout() {
		var me = this;
		var promise = $.ajax({
			method: "POST",
			url: me.url + "/Logout",
			dataType: 'json'
		}).fail(onLogout).then(onLogout);
		function onLogout() {
		    me.set({ logged: false, user: null });
		    $.ajaxSetup({
		        headers: {
		            "Authorization": null
		        }
		    });
		    me.clearStorage();
		    me.trigger("logout");
		    location.assign("#/");
		}
	},

	confirmEmail(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/ConfirmEmail",
	        dataType: 'json',
            data: params,
	        success(data, status, opts) {
	            me.trigger("emailconfirmed", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
	confirmationEmail(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/EmailConfirmation",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("confirmationemail", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	recoverPassword(params) {
		var me = this;
		$.ajax({
			method: "POST",
			url: me.url + "/RecoverPassword",
			dataType: 'json',
			data: params,
			success(data, status, opts) {
				me.trigger("recoverpassword", data);
			},
			error(opts, status, errorMsg) {
				me.handleRequestErrors([], opts);
			}
		});
	},
	checkRecoverToken(token) {
		var me = this;
		if (typeof token !== 'string') {
			console.warn("UserSession: You must provide a string token to be checked.\n",token);
			return;
		}
		$.ajax({
			method: "GET",
			url: BACKEND_URL + "user/reset/"+token,
			dataType: 'json',
			success(data, status, opts) {
				me.trigger("recovertoken", true);
			},
			error(opts, status, errorMsg) {
				me.trigger("recovertoken", false);
			}
		});
	},
	resetPassword(params) {
		var me = this;
		if (params.Password !== params.ConfirmPassword) {
			me.trigger("fail", "As senhas digitadas não são iguais.");
			return;
		}
		$.ajax({
			method: "POST",
			url: me.url + "/ResetPassword",
			dataType: 'json',
			data: params,
			success(data, status, opts) {
				me.trigger("resetpassword", data);
			},
			error(opts, status, errorMsg) {
				me.handleRequestErrors([], opts);
			}
		});
	},

	updateProfile(params) {
	    var me = this;
	    if (params.Password !== params.ConfirmPassword) {
	        me.trigger("fail", "As senhas digitadas não são iguais.");
	        return;
	    }
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateProfile",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("updateprofile", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

});

module.exports = new UserSession();
