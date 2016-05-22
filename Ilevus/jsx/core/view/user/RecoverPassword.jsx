
var React = require("react");
var Link = require("react-router").Link;
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

module.exports = React.createClass({
	getInitialState() {
		return {
		};
	},
	onSubmit(data) {
		UserSession.dispatch({
			action: UserSession.ACTION_RECOVER_PASSWORD,
			data: data
		});
	},
	componentWillMount() {
		UserSession.on("recoverpassword", model => {
			Modal.alert("Sucesso", "E-mail de recuperação de senha enviado com sucesso.");
			location.assign("#/");
		}, this);
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		return (<div className="container">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-xl-6 col-xl-offset-3">
                    <div className="p-y-3 text-xs-center">
                      <img src={AppLogo} />
                    </div>

                    <form className="p-t-3">
                      <p className="font-weight-bold">Recuperar senha</p>
                      <p>
                          Nós iremos enviar instruções de como recuperar sua senha para o
                          email em que você se cadastrou. Confira sua caixa de entrada após
                          confirmar a solicitação.
                      </p>
                      <div className="form-group">
                        <label className="form-element-label" for="email">{Messages.get("LabelEmail")}</label>
                        <input className="form-element" id="email" name="email" type="email" />
                      </div>
                      <div className="form-group row">
                        <div className="col-xs-12 col-sm-6">
                          <input type="submit" value="Recuperar senha" className="btn btn-brand btn-block" />
                        </div>
                        <div className="col-xs-12 col-sm-6">
                          <Link to="/login" className="btn btn-link btn-block">Voltar para o login</Link>
                        </div>
                      </div>
                    </form>

                    <div className="text-xs-center">
                      <p className="text-muted small p-t-2">
                          ©2016 Ilevus. Todos os direitos reservados.
                      </p>
                    </div>
                  </div>
                </div>
		</div>);
	}
});
