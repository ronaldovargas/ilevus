
var React = require("react");
var Link = require("react-router").Link;
var Form = require("ilevus/jsx/core/widget/form/Form.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/ilevus-logo-60px.png");

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
			},{
			    name: "stayconnected",
			    type: "checkbox",
			    placeholder: "Permanecer conectado"
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
			//location.assign("#/home");
		}, me);
		UserSession.on("loaded", () => {
			me.setState({loaded: true});
		}, me);
		if (!!UserSession.get("logged")) {
		    //location.assign("#/home");
		}
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		if (!this.state.loaded) {
			return <LoadingGauge />;
		}
	    return (<div className="container">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-xl-6 col-xl-offset-3">
                    <div className="p-y-3 text-xs-center">
                      <img src={AppLogo} />
                    </div>
                    <VerticalForm className="p-t-3"
                                  onSubmit={this.onSubmit}
                                  fields={this.state.fields}
                                  store={UserSession}
                                  submitLabel="Entrar"
                                  blockButtons={true} />
                    <div className="text-xs-center">
                      <ul className="list-unstyled list-inline">
                        <li>
                            <Link to="/signup">Criar uma conta</Link>
                        </li>
                        <li> · </li>
                        <li>
                            <Link to="/recover-password">Recuperar senha</Link>
                        </li>
                      </ul>
                      <p className="text-muted small p-t-2">
                          ©2016 Ilevus. Todos os direitos reservados.
                      </p>
                    </div>
                  </div>
            </div>
        </div>);
	}
});
