
var React = require("react");
var Form = require("ilevus/jsx/core/widget/form/Form.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var AppLogo = require("ilevus/img/logo.png");

var VerticalForm = Form.VerticalForm;

module.exports = React.createClass({
	getInitialState() {
		return {
			fields: [{
				name: "password",
				type: "password",
				placeholder: "",
				label: "Senha"
			},{
				name: "passwordconfirm",
				type: "password",
				placeholder: "",
				label: "Confirme a senha"
			},{
				name: "token",
				type: "hidden",
				placeholder: "",
				value: this.props.params.token
			}],
			loading: true,
			valid: false
		};
	},
	onSubmit(data) {
		UserSession.dispatch({
			action: UserSession.ACTION_RESET_PASSWORD,
			data: data
		});
	},
	componentDidMount() {
		var me = this;
		UserSession.on("resetpassword", model => {
			Modal.alert("Sucesso", "A sua senha de acesso foi redefinida com sucesso.");
			location.assign("#/");
		}, me);
		UserSession.on("recovertoken", valid => {
			me.setState({
				valid: valid,
				loading: false
			});
		}, me);

		UserSession.dispatch({
			action: UserSession.ACTION_CHECK_RECOVER_TOKEN,
			data: this.props.params.token
		});
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		if (this.state.loading) {
			return <LoadingGauge />;
		}
		return (
			<div className="container-fluid">
				<div className="row">
					{this.state.valid ?
						<div className="col-md-4 col-md-offset-4">
							<div className="ilevus-login-header">
								<img className="ilevus-login-brand" src={AppLogo} alt="ilevus Logo" />
								<h1>Redefinir sua senha</h1>
								<p>Informe sua nova senha de acesso.</p>
							</div>
							<div className="ilevus-card">
								<div className="ilevus-login">
									<div className="ilevus-login-body">
										<VerticalForm
											onSubmit={this.onSubmit}
											fields={this.state.fields}
											store={UserSession}
											submitLabel="Redefinir senha"
											blockButtons={true}
										/>
									</div>
								</div>
							</div>
						</div>
						:
						<div className="col-md-4 col-md-offset-4">
							<div className="ilevus-login-header">
								<img className="ilevus-login-brand" src={AppLogo} alt="ilevus Logo" />
								<h1>Esta página não está mais disponível.</h1>
								<p><a className="btn btn-sm btn-primary" href="#/">Retornar à página inicial</a></p>
							</div>
						</div>
					}
				</div>
			</div>
		);
	}
});
