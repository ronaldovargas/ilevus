
var React = require("react");
var Form = require("ilevus/jsx/core/widget/form/Form.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var AppLogo = require("ilevus/img/logo.png");

var VerticalForm = Form.VerticalForm;

module.exports = React.createClass({
	getInitialState() {
		return {
			fields: [{
				name: "email",
				type: "email",
				placeholder: "",
				label: "E-mail"
			}]
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
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-4 col-md-offset-4 text-center">
						<div className="ilevus-login-header">
							<img className="ilevus-login-brand" src={AppLogo} alt="ilevus Logo" />
							<h1>Recupere sua senha</h1>
							<p>Informe o endereço de e-mail cadastrado que enviaremos um link para você recuperar sua senha de acesso.</p>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<div className="ilevus-card">
							<div className="ilevus-login">
								<div className="ilevus-login-body">
									<VerticalForm
										onSubmit={this.onSubmit}
										fields={this.state.fields}
										store={UserSession}
										submitLabel="Enviar email de recuperação"
										blockButtons={true}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
