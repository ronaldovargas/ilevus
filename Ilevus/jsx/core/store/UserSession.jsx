
var _ = require("underscore");
var Backbone = require("backbone");
var Dispatcher = require("flux").Dispatcher;

var UserSession = Backbone.Model.extend({
	ACTION_REFRESH: 'refreshStatus',
	ACTION_LOGIN: 'login',
	ACTION_LOGOUT: 'logout',
	ACTION_RECOVER_PASSWORD: 'recoverPassword',
	ACTION_CHECK_RECOVER_TOKEN: 'checkRecoverToken',
	ACTION_RESET_PASSWORD: 'resetPassword',
	ACTION_UPDATE_PROFILE: 'updateProfile',

	BACKEND_URL: BACKEND_URL,
	url: BACKEND_URL + "user",
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
		if (localStorage.token && (localStorage.token != "")) {
			$.ajaxSetup({
				headers: {
					"Authorization": localStorage.token
				}
			});
			this.set({loading: true});
			this.refreshStatus(true);
		} else {
			this.set({loading: false});
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
	},
	putStorage(token, userId) {
		localStorage.token = token;
		localStorage.userId = userId;
	},

	refreshStatus(initial) {
		var me = this;
		$.ajax({
			method: "GET",
			url: BACKEND_URL + "user/session",
			dataType: 'json',
			success(data, status, opts) {
				if (data.success) {
					me.set({
						"logged": true,
						"user": data.data.user,
						"accessLevel": data.data.accessLevel,
						"permissions": data.data.permissions
					});
					me.trigger("login", me);
				} else {
					me.trigger("fail", data.message);
				}
				if (me.get("loading")) {
					me.set({loading: false});
					me.trigger("loaded", true);
				}
			},
			error(opts, status, errorMsg) {
				if (me.get("loading")) {
					me.set({loading: false});
				}
				me.clearStorage();
				location.assign("#/");
			}
		});
	},

	handleRequestErrors(collection, opts) {
		if (opts.status == 400) {
			this.trigger("fail", opts.responseJSON.message);
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
				url: BACKEND_URL + "user/login",
				dataType: 'json',
				data: data,
				success(data, status, opts) {
					console.log(data);
					if (data.success) {
						$.ajaxSetup({
							headers: {
								"Authorization": data.data.token
							}
						});
						me.putStorage(data.data.token, data.data.user.id);
						me.set({
							"logged": true,
							"user": data.data.user,
							"accessLevel": data.data.accessLevel,
							"permissions": data.data.permissions
						});
						me.trigger("login", me);
					} else {
						me.trigger("fail", data.message);
					}
				},
				error(opts, status, errorMsg) {
					me.handleRequestErrors([], opts);
				}
			});
		}
	},
	logout() {
		var me = this;
		$.ajax({
			method: "POST",
			url: BACKEND_URL + "user/logout",
			dataType: 'json',
			success(data, status, opts) {
				me.set({logged: false, user: null});
				$.ajaxSetup({
					headers: {
						"Authorization": null
					}
				});
				me.clearStorage();
				me.trigger("logout");
				location.assign("#/");
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
			url: BACKEND_URL + "user/recover",
			dataType: 'json',
			data: params,
			success(data, status, opts) {
				console.log("Done:", data);
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
		if (params.password !== params.passwordconfirm) {
			me.trigger("fail", "As senhas digitadas não são iguais.");
			return;
		}
		$.ajax({
			method: "POST",
			url: BACKEND_URL + "user/reset/"+params.token,
			dataType: 'json',
			data: {
				password: params.password
			},
			success(data, status, opts) {
				me.trigger("resetpassword", data);
			},
			error(opts, status, errorMsg) {
				me.handleRequestErrors([], opts);
			}
		});
	},

});

module.exports = new UserSession();
