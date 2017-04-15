/**
    Este é um modelo global diferente dos outros. Ele é responsável por todo o controle de sessão
    e autenticação/autorização do usuário do sistema.
*/

var _ = require("underscore");
var Backbone = require("backbone");
var S = require("string");
var Dispatcher = require("flux").Dispatcher;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = Backbone.Model.extend({
    ACTION_REFRESH: 'refreshStatus',
    ACTION_RETRIEVE_PROFESSIONAL_PROFILE: 'retrieveProfessionalProfile',
    ACTION_AUTH_CALLBACK: 'authCallback',
	ACTION_LOGIN: 'login',
	ACTION_LOGIN_FACEBOOK: 'loginWithFacebook',
	ACTION_LOGIN_LINKEDIN: 'loginWithLinkedin',
	ACTION_LOGOUT: 'logout',
	ACTION_CONFIRM_EMAIL: 'confirmEmail',
	ACTION_CONFIRM_EMAIL_CHANGE: 'confirmEmailChange',
	ACTION_CONFIRMATION_EMAIL: 'confirmationEmail',
	ACTION_RECOVER_PASSWORD: 'recoverPassword',
	ACTION_CHECK_RECOVER_TOKEN: 'checkRecoverToken',
	ACTION_RESET_PASSWORD: 'resetPassword',

	ACTION_FAVORITE_USER: 'favoriteUser',
	ACTION_UNFAVORITE_USER: 'unfavoriteUser',

	ACTION_UPDATE_CULTURE: 'updateCulture',
	ACTION_UPDATE_PASSWORD: 'updatePassword',
	ACTION_UPDATE_CONFIRMED_EMAIL: 'updateConfirmedEmail',
	ACTION_UPDATE_EMAIL: 'updateEmail',
	ACTION_UPDATE_PROFILE: 'updateProfile',
	ACTION_UPDATE_ADDRESS: 'updateAddress',
	ACTION_UPDATE_PROFESSIONAL_BASIC: 'updateProfessionalBasic',
	ACTION_UPDATE_PROFESSIONAL_EDUCATION: 'updateProfessionalEducation',
	ACTION_UPDATE_PROFESSIONAL_CAREER: 'updateProfessionalCareer',
	ACTION_UPDATE_PROFESSIONAL_SERVICES: 'updateProfessionalServices',
	ACTION_UPDATE_PROCESS_STEPS: 'updateProcessSteps',

	ACTION_REMOVE_PICTURE: 'removePicture',

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
		localStorage.removeItem("stayconnected");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("stayconnected");
	},
	putStorage(token, userId, stayconnected) {
	    if (stayconnected) {
	        localStorage.token = token;
	        localStorage.stayconnected = stayconnected;
	    }
	    sessionStorage.token = token;
	    sessionStorage.stayconnected = stayconnected;
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
			    var permClaims = !data.Claims ? [] : data.Claims.filter((claim) => {
			        if (claim.type == "IlevusUserPermission") {
			            return true;;
			        }
			        return false;
			    });
			    me.set({
			        "logged": true,
			        "permissions": permClaims.map((claim) => { return claim.value; }),
					"user": data
			    });
				me.trigger("login", me);
				if (me.get("loading")) {
					me.set({loading: false});
					me.trigger("loaded", true);
				} else
				    me.trigger("update", me);
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
	    console.error("Error ocurred:\n", collection, "\n", opts);
	    if (opts.status == 400) {
	        // Validation errors
	        var resp;
	        try {
	            resp = JSON.parse(opts.responseText);
	        } catch (err) {
	            resp = {
	                Message: Messages.get("TextUnexpectedError")
	            };
	        }
	        if (resp.ModelState) {
	            var errors = [];
	            _.each(resp.ModelState, (field) => {
	                for (var e = 0; e < field.length; e++) {
	                    errors.push(field[e]);
	                    errors.push("&nbsp;");
	                }
	            });
	            this.trigger("fail", errors);
	        } else if (resp.error_description) {
	            this.trigger("fail", resp.error_description);
	        } else {
	            this.trigger("fail", resp.Message);
	        }
		} else {
		    this.trigger("fail", Messages.get("TextUnexpectedError"));
		}
	},

	authCallback(token) {
	    var me = this;
	    me.putStorage(token, null, true);
	    me.setAuthorization(token);
	    me.refreshStatus();
	},

	login(data) {
	    var me = this,
            stayconnected = data.stayconnected,
			errors = [];
		if (!(data.email) || (data.email == '')) {
		    errors.push(Messages.get("TextTypeYourEmail"));
		}
		if (!(data.password) || (data.password == '')) {
		    errors.push(Messages.get("TextTypeYourPassword"));
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
				    location.reload();
				},
				error(opts, status, errorMsg) {
					me.handleRequestErrors([], opts);
				}
			});
		}
	},
	loginWithFacebook(token) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/LoginWithFacebook",
	        dataType: 'json',
	        data: {
	            "AccessToken": token
	        },
	        success(data, status, opts) {
	            me.putStorage(data.access_token, data.userName, true);
	            location.reload();
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
	loginWithLinkedin(token) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/LoginWithLinkedin",
	        dataType: 'json',
	        data: {
	            "AccessToken": token
	        },
	        success(data, status, opts) {
	            me.putStorage(data.access_token, data.userName, true);
	            location.reload(); 
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	logout() {
		var me = this;
		var promise = $.ajax({
			method: "POST",
			url: me.url + "/Logout",
			dataType: 'json'
		}).fail(onLogout).then(onLogout);
		function onLogout() {
		    me.set({ logged: false, permissions: [], user: null });
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

	retrieveProfessionalProfile() {
	    var me = this;
	    $.ajax({
	        method: "GET",
	        url: me.url + "/ProfessionalProfile",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.trigger("professionalprofile", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
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

	confirmEmailChange(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/ConfirmEmailChange",
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
	            me.trigger("confirmationemailfail", opts.responseJSON.Message);
	        }
	    });
	},

	recoverPassword(params) {
	    var me = this;
	    if (S(params.Email).isEmpty()) {
	        me.trigger("fail", Messages.formatWithKeys("ValidationRequired", ['LabelEmail']));
	        return;
	    }
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
		    me.trigger("fail", Messages.get("ValidationPasswordsDontMatch"));
			return;
		}
		if (S(params.Password).length < 6) {
		    me.trigger("fail", Messages.format("ValidationPasswordLength", [6]));
		    return;
		}
		if (S(params.Password).isAlphaNumeric()) {
		    me.trigger("fail", Messages.get("ValidationPasswordFormat"));
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

	favoriteUser(id) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Favorite/"+id,
	        dataType: 'json',
	        success(data, status, opts) {
	            var favorites = me.get("user").Favorites;
	            if (favorites.indexOf(id) < 0) {
	                favorites.push(id);
	            }
	            me.trigger("user-favorite", id);
	            me.trigger("update", me);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},
	unfavoriteUser(id) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/Unfavorite/" + id,
	        dataType: 'json',
	        success(data, status, opts) {
	            var favorites = me.get("user").Favorites;
	            var idx = favorites.indexOf(id);
	            if (idx >= 0) {
	                favorites.splice(idx, 1);
	            }
	            me.trigger("user-unfavorite", id);
	            me.trigger("update", me);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateCulture(params) {
	    var me = this;

	    if (S(params.Culture).isEmpty()) {
	        me.trigger("fail", Messages.formatWithKeys("ValidationRequired", ['LabelLanguage']));
	        return;
	    }
	    $.ajax({
	        method: "POST",
	        url: me.url + "/ChangeCulture",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.putStorage(data.access_token, data.userName, sessionStorage.stayconnected || localStorage.stayconnected);
	            location.reload();
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updatePassword(params) {
	    var me = this; 

	    if (S(params.OldPassword).isEmpty()) {
	        me.trigger("fail", Messages.formatWithKeys("ValidationRequired", ['LabelPasswordCurrent']));
	        return;
	    }
	    if (S(params.NewPassword).isEmpty()) {
	        me.trigger("fail", Messages.formatWithKeys("ValidationRequired", ['LabelPasswordNew']));
	        return;
	    }
	    if (S(params.ConfirmPassword).isEmpty()) {
	        me.trigger("fail", Messages.formatWithKeys("ValidationRequired", ['LabelPasswordConfirm']));
	        return;
	    }
	    if (params.NewPassword !== params.ConfirmPassword) {
	        me.trigger("fail", Messages.get("ValidationPasswordsDontMatchOnChange"));
	        return;
	    }
	    if (S(params.NewPassword).length < 6) {
	        me.trigger("fail", Messages.format("ValidationPasswordLength", [6]));
	        return;
	    }
	    if (S(params.NewPassword).isAlphaNumeric()) {
	        me.trigger("fail", Messages.get("ValidationPasswordFormat"));
	        return;
	    }
	    $.ajax({
	        method: "POST",
	        url: me.url + "/ChangePassword",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("updatepassword", true);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateConfirmedEmail(email) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateEmail",
	        dataType: 'json',
	        data: {
	            Email: email
	        },
	        success(data, status, opts) {
	            me.get("user").EmailChange = email;
	            me.trigger("update-confirmed-email");
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateEmail(email) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateEmail",
	        dataType: 'json',
	        data: {
	            Email: email
	        },
	        success(data, status, opts) {
	            me.putStorage(data.access_token, data.userName, sessionStorage.stayconnected || localStorage.stayconnected);
	            location.reload();
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateProfile(params) {
	    var me = this;
	    if (S(params.Birthdate).isEmpty()) {
	        me.trigger("fail", Messages.formatWithKeys("ValidationRequired", ['LabelBirthdate']));
	        return;
	    }
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateProfile",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.set({user: data});
	            me.trigger("updateprofile", me);
	            me.trigger("update", me);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateAddress(params) {
	    var me = this;
	    /*if (params.NewPassword !== params.ConfirmPassword) {
	        me.trigger("fail", "As senhas digitadas não são iguais.");
	        return;
	    }*/
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateAddress",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.set({ user: data });
	            me.trigger("updateaddress", me);
	            me.trigger("professionalprofile", data.Professional);
	            me.trigger("update", me);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateProfessionalBasic(params) {
	    var me = this;
	    /*if (params.NewPassword !== params.ConfirmPassword) {
	        me.trigger("fail", "As senhas digitadas não são iguais.");
	        return;
	    }*/
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateProfessionalBasic",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("professionalprofile", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateProfessionalEducation(params) {
	    var me = this;
	    /*if (params.NewPassword !== params.ConfirmPassword) {
	        me.trigger("fail", "As senhas digitadas não são iguais.");
	        return;
	    }*/
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateProfessionalEducation",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("professionalprofile", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateProfessionalCareer(params) {
	    var me = this;
	    /*if (params.NewPassword !== params.ConfirmPassword) {
	        me.trigger("fail", "As senhas digitadas não são iguais.");
	        return;
	    }*/
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateProfessionalCareer",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("professionalprofile", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateProfessionalServices(params) {
	    var me = this;
	    /*if (params.NewPassword !== params.ConfirmPassword) {
	        me.trigger("fail", "As senhas digitadas não são iguais.");
	        return;
	    }*/
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateProfessionalServices",
	        dataType: 'json',
	        data: params,
	        success(data, status, opts) {
	            me.trigger("professionalprofile", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	updateProcessSteps(params) {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/UpdateProcessSteps",
	        dataType: 'json',
            contentType: "application/json",
	        data: JSON.stringify(params),
	        success(data, status, opts) {
	            me.get("user").Professional.Professional.ProcessSteps = data;
	            me.trigger("update-process-steps", data);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

	removePicture() {
	    var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/RemovePicture",
	        dataType: 'json',
	        success(data, status, opts) {
	            me.get("user").Image = null;
	            me.trigger("update", me);
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
	},

});

module.exports = new UserSession();
