
var React = require("react");
var Link = require("react-router").Link;
var Form = require("ilevus/jsx/core/widget/form/Form.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

var VerticalForm = Form.VerticalForm;

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
		return {
			fields: [{
			    name: "FirstName",
			    type: "text",
			    placeholder: "",
			    label: Messages.get("LabelFirstName")
			},{
			    name: "LastName",
			    type: "text",
			    placeholder: "",
			    label: Messages.get("LabelLastName")
			},{
			    name: "Email",
			    type: "email",
			    placeholder: "",
			    label: Messages.get("LabelEmail")
			},{
				name: "Password",
				type: "password",
				placeholder: "",
				label: Messages.get("LabelPassword")
			}, {
			    name: "ConfirmPassword",
			    type: "password",
			    placeholder: "",
			    label: Messages.get("LabelPasswordConfirm")
			}]
		};
	},
	onSubmit(data) {
	    UserStore.dispatch({
	        action: UserStore.ACTION_SIGNUP,
			data: data
		});
	},
	componentDidMount() {
		var me = this;
		UserStore.on("sync", model => {
		    router.push("/login");
		}, me);

	},
	componentWillUnmount() {
	    UserStore.off(null, null, this);
	},
	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-xs-12 text-center">
						<div className="ilevus-login-header">
							<img className="ilevus-login-brand" src={AppLogo} alt="ilevus Logo" />
							<h1>Faça seu cadastro</h1>
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
									store={UserStore}
									submitLabel="Realizar Cadastro"
									blockButtons={true}
								/>
							</div>

							<div className="ilevus-login-footer">
								<div className="row">
									<div className="col-md-12 text-center">
										<Link to="/login">Já é cadastrado? Faça seu login.</Link>
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
