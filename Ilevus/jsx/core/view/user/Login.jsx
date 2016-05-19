
var React = require("react");
var Link = require("react-router").Link;
var Form = require("ilevus/jsx/core/widget/form/Form.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

var VerticalForm = Form.VerticalForm;

module.exports = React.createClass({
	getInitialState() {
		return {
			loaded: !UserSession.get("loading"),
			fields: [{
				name: "email",
				type: "email",
				placeholder: "",
				label: Messages.get("LabelEmail")
			},{
				name: "password",
				type: "password",
				placeholder: "",
				label: Messages.get("LabelPassword")
			}]
		};
	},
	onSubmit(data) {
		UserSession.dispatch({
			action: UserSession.ACTION_LOGIN,
			data: data
		});
	},
	componentDidMount() {
		var me = this;
		UserSession.on("login", model => {
			location.assign("#/home");
		}, me);
		UserSession.on("loaded", () => {
			me.setState({loaded: true});
		}, me);
		if (!!UserSession.get("logged")) {
		    location.assign("#/home");
		}
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		if (!this.state.loaded) {
			return <LoadingGauge />;
		}
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-xs-12 text-center">
						<div className="ilevus-login-header">
							<img className="ilevus-login-brand" src={AppLogo} alt="ilevus Logo" />
							<h1>Faça seu login</h1>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-4 col-md-offset-4">
						<div className="ilevus-card">
							<div className="ilevus-login-body">
								<VerticalForm
									onSubmit={this.onSubmit}
									fields={this.state.fields}
									store={UserSession}
									submitLabel="Fazer Login"
									blockButtons={true}
								/>
							</div>

							<div className="ilevus-login-footer">
								<div className="row">
									<div className="col-md-12 text-center">
										<p><Link to="/recover-password">Esqueceu sua senha?</Link></p>
										<p><Link to="/signup">Não é cadastrado? Cadastre-se grátis.</Link></p>
									</div>
									<br/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
