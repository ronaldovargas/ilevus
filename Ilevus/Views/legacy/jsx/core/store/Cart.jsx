/**
    Esta é a store da entidade de controle de compras de serviço.
*/

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

var hiredServices = [];

var URL = Fluxbone.BACKEND_URL + "Cart";

var CartModel = Fluxbone.Model.extend({
	url: URL,
	validate(attrs, options) {
		var errors = [];

		if (errors.length > 0)
			return errors;
	}
});

var CartStore = Fluxbone.Store.extend({

	ACTION_TO_HIRE_SERVICE: 'cart-addService',
	ACTION_REMOVE_HIRED_SERVICE: 'cart-removeService',
	dispatchAcceptRegex: /^cart-[a-zA-Z0-9]+$/,

	url: URL,
	model: CartModel,
	services: [],


	addService(data) {
		if (data) {
			this.services.push(data);
		}
	},

	removeService(service) {
		event.preventDefault();
		this.removeByAttr(this.services, 'Id', service.Id);
	},
	// selectors
	isInCart(service) {
        return this.objctInArray(this.services, 'Id', service.Id);
	},
	getCacheServicesHired() {
		return this.services;
	},

	removeByAttr(arr, attr, value) {
		var i = arr.length;
		while (i--) {
			if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
				arr.splice(i, 1);
			}
		}
		return arr;
    },
    
	objctInArray(arr, attr, value) {
		var i = arr.length;
		while (i--) {
			if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
                return true;
			}
		}
		return false;
	}
});

module.exports = new CartStore();
