/**
    Este componente extende as funcionalidades de modelo e store do Backbone para que atenda
    ao padr�o de projeto Flux que � utilizado com o  Este padr�o de projeto define um fluxo
    unidirecional de dados dentro da estrutura do frontend, onde os componentes visuais despacham
    requisi��es de dados �s stores. As stores n�o devolvem os dados diretamente � esses componentes,
    elas recuperam os dados e disparam eventos quando estes dados est�o prontos para uso. Os
    componentes visuais que est�o interessados nesses dados registram listeners nas stores apropriadas.

    Essa arquitetura implementada com o Backbone.js foi chamada de Fluxbone.
    Esta arquitetura permite que sejam contru�das interfaces reativas com um fluxo e funcionamento f�ceis
    de entender. Al�m de ser extramamente f�cil de se utilizar com o

    Aqui est�o implementados os principais m�todos da store, a store de cada entidade pode criar
    novos m�todos e especializar o funcionamento da store.
*/

var Dispatcher = require("flux").Dispatcher;
var _ = require('underscore');
var Backbone = require("backbone");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Toastr = require("toastr")
var config = require("config")
var Model = Backbone.Model.extend({
	parse(response, opts) {
		if (response.data) {
			return response.data;
		}
		return response;
	}
});

var Store = Backbone.Collection.extend({
    BACKEND_URL: config.BACKEND_URL,
    userSession: UserSession,
	$dispatcherActionRegex: /[a-zA-Z0-9]+$/,
	$dispatcher: new Dispatcher(),
	dispatchAcceptRegex: /^[a-zA-Z0-9]*-?[a-zA-Z0-9]+$/,
	dispatch(payload) {
		this.$dispatcher.dispatch(payload);
	},
	initialize() {
		this.dispatchToken = this.$dispatcher.register(this.dispatchCallback.bind(this));
		this.on("error", this.handleRequestErrors, this);
		this.on("fail", (msg) => {
		    Toastr.remove();
		    Toastr.error(msg);
		}, this);
	},
	parse(response, opts) {
		this.total = response.total;
		if (response.data)
		    return response.data;
		return response;
	},
	dispatchCallback(payload) {
		if (payload.action && payload.action.match(this.dispatchAcceptRegex)) {
			var method = this.$dispatcherActionRegex.exec(payload.action)[0];
			if (method) {
				var cb = this[method];
				if (typeof cb == 'function') {
					try {
						this[method](payload.data);
					} catch (err) {
						console.error("Store: Dispatching",payload.action, "failed:",err);
					}
				} else {
				    console.warn("Store: Dispatch action is not a function:", (typeof cb), method, payload,this);
				}
			} else {
				console.warn("Store: Invalid dispatch action:",payload.action);
			}
		}
	},
	handleRequestErrors(collection, opts) {
	    console.error("Error ocurred:\n",collection,"\n", opts);
	    if (opts.status == 400) {
			// Validation errors
			var resp;
			try {
				resp = JSON.parse(opts.responseText);
			} catch (err) {
				resp = {
				    message: Messages.get("TextUnexpectedError")
				};
			}
			if (resp.ModelState) {
			    var errors = [];
			    _.each(resp.ModelState, (field) => {
			        for (var e = 0; e < field.length; e++)
			            errors.push(field[e]);
			    });
			    this.trigger("fail", errors);
			} else {
			    this.trigger("fail", resp.Message);
			}
	    } else if ((opts.status == 401) || (opts.status == 403)) {
			// Unauthorized/Forbidden
		    this.userSession.refreshStatus();
		} else {
		    this.trigger("fail", Messages.get("TextUnexpectedError"));
		}
	},
	retrieve(id) {
		var me = this,
			model = me.get(id);
		if (model) {
			_.defer(function() {
				me.trigger("retrieve", model);
			});
		} else {
			model = new me.model();
			model.fetch({
				url: me.url + "/" + id,
				success(model, response, options) {
					me.trigger("retrieve", model);
				},
				error(model, response, options) {
					me.handleRequestErrors([], options.xhr);
				}
			});
		}
	},
	update(model) {
		if (!model) {
			console.error("Store: You must pass a model on the payload to request an update.");
		} else {
			if (!this.get(model.get("id"))) {
				this.add(model);
			}
			model.save();
		}
	},
	destroy(model) {
		if (!model) {
			console.error("Store: You must pass a model on the payload to request a destroy.");
		} else {
			model.destroy({
				url: this.url + "/" + model.get("id")
			});
		}
	},
	find(data) {
		var me = this;
		me.fetch({
			data: data
		});
	},

	updateField(params) {
		if (!params) {
			console.error("Store: You must pass data on the payload to request a field update.");
		} else {
			var me = this;
			$.ajax({
				method: "POST",
				url: me.url+"/update/field",
				dataType: 'json',
				data: params,
				success(data, status, opts) {
					me.trigger("fieldupdated", data);
				},
				error(opts, status, errorMsg) {
					me.handleRequestErrors([], opts);
				}
			});
		}
	},
});

module.exports = {
	BACKEND_URL: config.BACKEND_URL,
	Model: Model,
	Store: Store
};
