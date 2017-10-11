var $, jQuery = $ = require("jquery");
(function () { var t, e, r, n, o, i, s, u, c, a; a = function (t) { return t < 10 ? "0" + t : t }, Date.prototype._toJSON = function (t) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + a(this.getUTCMonth() + 1) + "-" + a(this.getUTCDate()) + "T" + a(this.getUTCHours()) + ":" + a(this.getUTCMinutes()) + ":" + a(this.getUTCSeconds()) + "." + a(this.getUTCMilliseconds()) + "Z" : null }, Date.prototype.toJSON || (Date.prototype.toJSON = Date.prototype._toJSON), String.prototype._toJSON = Number.prototype._toJSON = Boolean.prototype._toJSON = function (t) { return this.valueOf() }, String.prototype.toJSON || (String.prototype.toJSON = String.prototype._toJSON), Number.prototype.toJSON || (Number.prototype.toJSON = Number.prototype._toJSON), Boolean.prototype.toJSON || (Boolean.prototype.toJSON = Boolean.prototype._toJSON), c = function () { function t() { } return t.prototype.parse = function (t) { var e, r, n, o, i, s, u, c, a, h, p, _, f; if (t) return r = null, n = " ", i = { '"': '"', "\\": "\\", "/": "/", b: "\b", f: "\f", n: "\n", r: "\r", t: "\t" }, o = function (e) { throw new SyntaxError(e + " at character #" + r + "(" + n + "); for text: " + t) }, s = function (e) { return e && e !== n && o("Expected '" + e + "' instead of '" + n), n = t.charAt(r++) }, u = function () { var t, e; for (e = "", "-" === n && (e = "-", s("-")) ; n >= "0" && n <= "9";) e += n, s(); if ("." === n) for (e += "."; s() && n >= "0" && n <= "9";) e += n; if ("e" === n || "E" === n) for (e += n, s(), "-" !== n && "+" !== n || (e += n, s()) ; n >= "0" && n <= "9";) e += n, s(); return t = +e, isFinite(t) ? t : void o("Bad number") }, h = function () { var t, e, r, u, c; if (t = "", '"' === n) for (; s() ;) { if ('"' === n) return s(), t; if ("\\" === n) if (s(), "u" === n) { for (c = 0, r = u = 0; u < 4 && (e = parseInt(s(), 16), isFinite(e)) ; r = ++u) c *= 16 + e; t += String.fromCharCode(c) } else { if ("string" != typeof i[n]) break; t += i[n] } else t += n } o("Bad string") }, _ = function () { for (; n && n <= " ";) s() }, f = function () { switch (n) { case "t": s("t"), s("r"), s("u"), s("e"); break; case "f": s("f"), s("a"), s("l"), s("s"), s("e"); break; case "n": s("n"), s("u"), s("l"), s("l") } o("Unexpected #{ch}") }, e = function () { var t; if (t = [], "[" === n) { if (s("["), _(), "]" === n) return s("]"), t; for (; n;) { if (t.push(p()), _(), "]" === n) return s("]"), t; s(","), _() } } o("Bad array") }, c = function () { var t, e; if (t = {}, "{" === n) { if (s("{"), _(), "}" === n) return s("}"), t; for (; n;) { if (e = h(), _(), s(":"), Object.hasOwnProperty.call(t, e) && o("Duplicate key '" + e), t[e] = p(), _(), "}" === n) return s("}"), t; s(","), _() } } o("Bad object") }, p = function () { switch (_(), n) { case "{": return c(); case "[": return e(); case '"': return h(); case "-": return u; default: return n >= "0" && n <= "9" ? u() : f() } }, a = p(), _(), n && o("Syntax error"), a }, t.prototype.stringify = function (t, e, r) { var n, o, i, s, u, c, a, h, p, _, f, l, d, y; if (null == e && (e = null), null == r && (r = 0), o = "", s = "", n = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, h = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, a = function (t, e) { return t > e ? t : e }, p = function (t, e) { return t < e ? t : e }, "number" == typeof r) for (i = u = 0, f = p(a(r, 0), 10) ; 0 <= f ? u < f : u > f; i = 0 <= f ? ++u : --u) s += " "; else if ("string" == typeof r) for (d = c = 0, l = p(r.length, 10) ; 0 <= l ? c < l : c > l; d = 0 <= l ? ++c : --c) s += r[d]; if (e && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify"); return _ = function (t) { return n.lastIndex = 0, n.test(t) ? '"' + t.replace(n, function (t) { var e; return e = h[t], "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4) }) : '"' + t + '"' }, (y = function (t, r) { var n, u, c, a, h; switch (c = o, n = r[t], n && "object" == typeof n && "function" == typeof n._toJSON && (n = n._toJSON(t)), "function" == typeof e && (n = e.call(r, t, n)), typeof n) { case "string": return _(n); case "number": return isFinite(n) ? String(n) : "null"; case "boolean": case "null": return String(n); case "object": if (!n) return "null"; if (o += s, a = [], "[object Array]" === Object.prototype.toString.apply(n)) { for (i in n) a.push(y(+i, n) || "null"); return h = 0 === a.length ? "[]" : o ? "[\n" + o + a.join(",\n" + o) + "\n" + c + "]" : "[" + a.join(",") + "]", o = c, h } if (e && "object" == typeof e) for (u in e) "string" == typeof e[u] && (h = y(u, n), h && a.push(_(u) + (o ? ": " : ":") + h)); else for (u in n) Object.prototype.hasOwnProperty.call(n, u) && (h = y(u, n), h && a.push(_(u) + (o ? ": " : ":") + h)); return h = 0 === a.length ? "{}" : o ? "{\n" + o + a.join(",\n" + o) + "\n" + c + "}" : "{" + a.join(",") + "}", o = c, h } })("", { "": t }) }, t }(), this._JSON = new c, this.JSON || (this.JSON = this._JSON), o = function () { function e(e) { null == e && (e = {}), this.fullname = e.fullname || "", this.email = e.email || "", this.code = e.code || "", this.cpf = e.cpf || "", this.birthdate_day = e.birthdate_day || "", this.birthdate_month = e.birthdate_month || "", this.birthdate_year = e.birthdate_year || "", this.phone_area_code = e.phone_area_code || "", this.phone_number = e.phone_number || "", this.billing_info = new r(e.billing_info) || new r, this.address = new t(e.address) || new t } return e.prototype.to_json = function () { return { code: this.code, email: this.email, fullname: this.fullname, cpf: this.cpf, phone_area_code: this.phone_area_code, phone_number: this.phone_number, birthdate_day: this.birthdate_day, birthdate_month: this.birthdate_month, birthdate_year: this.birthdate_year, billing_info: this.billing_info.to_json(), address: this.address.to_json() } }, e.prototype.to_string = function () { return { code: this.code, email: this.email, fullname: this.fullname, cpf: this.cpf, phone_area_code: this.phone_area_code, phone_number: this.phone_number, birthdate_day: this.birthdate_day, birthdate_month: this.birthdate_month, birthdate_year: this.birthdate_year, billing_info: this.billing_info.to_string(), address: this.address.to_string() } }, e }(), u = function () { function t(t) { null == t && (t = {}), this.customer = t.code || null, this.plan_code = t.plan_code || "" } return t.is_new_customer = !1, t.prototype.with_customer = function (t) { return this.customer = t, this }, t.prototype.with_new_customer = function (t) { return this.customer = new o(t) || new o, this.is_new_customer = !0, this }, t.prototype.with_plan_code = function (t) { return this.plan_code = t, this }, t.prototype.with_code = function (t) { return this.code = t, this }, t.prototype.with_coupon = function (t) { return this.coupon = new n(t), this }, t.prototype.to_json = function () { return this.coupon && this.coupon.code ? { code: this.code, plan: { code: this.plan_code }, customer: this.customer.to_json(), coupon: this.coupon.to_json() } : { code: this.code, plan: { code: this.plan_code }, customer: this.customer.to_json() } }, t.prototype.to_string = function () { return this.coupon && this.coupon.code ? { code: this.code, plan: { code: this.plan_code }, customer: this.customer.to_string(), coupon: this.coupon.to_string() } : { code: this.code, plan: { code: this.plan_code }, customer: this.customer.to_string() } }, t }(), r = function () { function t(t) { null == t && (t = {}), this.fullname = t.fullname || "", this.credit_card_number = t.credit_card_number || "", this.expiration_month = t.expiration_month || "", this.expiration_year = t.expiration_year || "" } return t.prototype.to_json = function () { return { credit_card: this.credit_card_to_json() } }, t.prototype.to_string = function () { return { credit_card: this.credit_card_to_string() } }, t.prototype.credit_card_to_json = function () { return { holder_name: this.fullname, expiration_month: this.expiration_month, expiration_year: this.expiration_year, first_six_digits: this._six_first(), last_four_digits: this._last_four(), number: this.credit_card_number } }, t.prototype.credit_card_to_string = function () { return { holder_name: this.fullname, expiration_month: this.expiration_month, expiration_year: this.expiration_year, first_six_digits: this._six_first(), last_four_digits: this._last_four() } }, t.prototype._six_first = function () { return this.credit_card_number.substring(0, 5) }, t.prototype._last_four = function () { return this.credit_card_number.substring(this.credit_card_number.length - 4, this.credit_card_number.length) }, t }(), t = function () { function t(t) { null == t && (t = {}), this.street = t.street || "", this.number = t.number || "", this.complement = t.complement || "", this.district = t.district || "", this.city = t.city || "", this.state = t.state || "", this.country = t.country || "", this.zipcode = t.zipcode || "" } return t.prototype.to_json = function () { return { street: this.street, number: this.number, complement: this.complement, district: this.district, city: this.city, state: this.state, country: this.country, zipcode: this.zipcode } }, t.prototype.to_string = function () { return { street: this.street, number: this.number, complement: this.complement, district: this.district, city: this.city, state: this.state, country: this.country, zipcode: this.zipcode } }, t }(), s = function () { function t(t) { null == t && (t = {}), this.errors = t.errors || [], this.alerts = t.alerts || [], this.code = t.code || "", this.message = t.message || "", this.amount = t.amount || "", this.plan = t.plan || {}, this.status = t.status || "", this.invoice = t.invoice || {}, this.next_invoice_date = t.next_invoice_date || {}, this.customer = t.customer || {} } return t.prototype.has_errors = function () { return void 0 !== this.error || this.errors.length > 0 }, t.prototype.has_alerts = function () { return void 0 !== this.alerts || this.alerts.length > 0 }, t.prototype.add_errors = function (t) { var e, r, n, o; for (o = [], r = 0, n = t.length; r < n; r++) e = t[r], o.push(this.errors.push(e)); return o }, t.prototype.add_alerts = function (t) { var e, r, n, o; for (o = [], r = 0, n = t.length; r < n; r++) e = t[r], o.push(this.alerts.push(e)); return o }, t }(), n = function () { function t(t) { null == t && (t = {}), t && (this.code = t) } return t.prototype.to_json = function () { if (this.code) return { code: this.code } }, t }(), i = function () { function t(t, e) { var r; null == e && (e = {}), this.hash = t, this.settings_hash = e, (r = this.settings_hash).timeout || (r.timeout = 1e4), this._logDebug("DebugMode=On MoipAssinaturas"), this.response } return t.DEBUG_MODE = !1, t.prototype.debugMode = function () { return this.DEBUG_MODE = !0 }, t.prototype.subscribe = function (t) { return this.subscription = t, this._request_subscribe(), this }, t.prototype.callback = function (t) { return this.fn = t, this }, t.prototype.request_error = function (t) { return this.fn_error = t, this }, t.prototype._exec_callback = function () { return this.fn.call(this, this.response) }, t.prototype._exec_error_callback = function (t, e) { if (this.fn_error) return this.fn_error.call(this, t, e) }, t.prototype._request_subscribe = function () { var t, r; return this._logDebug("create_subscription preparing JSON to send Moip Assinaturas"), r = { hash: this.hash, json: JSON.stringify(this.subscription.to_json()) }, this._logDebug("create_subscription JSON -> " + JSON.stringify(this.subscription.to_string())), t = this.subscription.is_new_customer ? t = "?new_customer=true" : "?new_customer=false", jQuery.ajax({ url: e + "/v1/subscriptions/jsonp" + t, type: "GET", dataType: "jsonp", data: r, scriptCharset: "utf8", success: function (t) { return function (e, r) { return t.handle_data(e) } }(this), timeout: this.settings_hash.timeout, error: function (t) { return function (e, r, n) { return t.handle_error(r, n) } }(this) }) }, t.prototype.handle_data = function (t) { return this.response = new s(t), this._exec_callback(), this }, t.prototype.handle_error = function (t, e) { return this._exec_error_callback(t, e), this }, t.prototype.create_customer = function (t) { return this._logDebug("create_customer.call -> " + t.code), this._request_customer(t), this }, t.prototype._request_customer = function (t) { var r; return this._logDebug("create_customer preparing JSON to send Moip Assinaturas"), r = { hash: this.hash, json: JSON.stringify(t.to_json()) }, this._logDebug("create_customer JSON -> " + JSON.stringify(t.to_string())), jQuery.ajax({ url: e + "/v1/customers/jsonp?new_vault=true", type: "GET", dataType: "jsonp", data: r, scriptCharset: "utf8", success: function (t) { return function (e, r) { return t.handle_data(e) } }(this), timeout: this.settings_hash.timeout, error: function (t) { return function (e, r, n) { return t.handle_error(r, n) } }(this) }) }, t.prototype.update_credit_card = function (t) { return this._request_update(t), this }, t.prototype._logDebug = function (e) { if (t.DEBUG_MODE) return console.log(e) }, t.prototype._request_update = function (t) { var r; return this._logDebug("credit_card_update preparing JSON to send Moip Assinaturas"), r = { hash: this.hash, json: JSON.stringify(t.billing_info.to_json()) }, this._logDebug("credit_card_update JSON -> " + JSON.stringify(t.billing_info.to_string())), jQuery.ajax({ url: e + "/v1/customers/" + t.code + "/billing_infos/jsonp", type: "GET", dataType: "jsonp", data: r, scriptCharset: "utf8", success: function (t) { return function (e, r) { return t.handle_data(e) } }(this), timeout: this.settings_hash.timeout, error: function (t) { return function (e, r, n) { return t.handle_error(r, n) } }(this) }) }, t }(), window.MoipAssinaturas = "undefined" != typeof exports && null !== exports ? exports : i, window.Customer = "undefined" != typeof exports && null !== exports ? exports : o, window.Subscription = "undefined" != typeof exports && null !== exports ? exports : u, window.BillingInfo = "undefined" != typeof exports && null !== exports ? exports : r, window.Address = "undefined" != typeof exports && null !== exports ? exports : t, window.Response = "undefined" != typeof exports && null !== exports ? exports : s, window.Coupon = "undefined" != typeof exports && null !== exports ? exports : n, e = "https://sandbox.moip.com.br/assinaturas" }).call(this);

module.exports = {
    MoipAssinaturas: MoipAssinaturas,
    Customer: Customer,
    Address: Address,
    BillingInfo: BillingInfo,
    Subscription: Subscription
};