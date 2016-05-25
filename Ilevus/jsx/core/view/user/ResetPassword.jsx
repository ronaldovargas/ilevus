
var React = require("react");
var Link = require("react-router").Link;
var ErrorAlert = require("ilevus/jsx/core/widget/ErrorAlert.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

module.exports = React.createClass({
	getInitialState() {
		return {
		    reseted: false,
            error: null
		};
	},
	onSubmit(evt) {
	    evt.preventDefault();
		UserSession.dispatch({
			action: UserSession.ACTION_RESET_PASSWORD,
			data: {
			    Email: this.props.params.email,
			    Code: this.props.params.token,
			    Password: this.refs['password'].value,
			    ConfirmPassword: this.refs['passwordconfirm'].value
			}
		});
	},
	componentDidMount() {
		var me = this;
		UserSession.on("resetpassword", model => {
		    me.setState({
		        reseted: true
		    });
		}, me);
		UserSession.on("fail", msg => {
		    me.setState({
		        error: msg
		    });
		}, me);
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		if (this.state.reseted) {
		    return <div className="m-y-3" role="banner">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-offset-2 col-sm-8 col-xs-12 text-xs-center">
                            <div className="alert alert-success">
                                A sua senha foi redefinida com sucesso.
                            </div>
                            <Link to="/login" className="btn btn-brand">Voltar ao login</Link>
                        </div>
                    </div>
                </div>
			</div>
		    ;
		}
		return <div className="container">
            <div className="row">
                  <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-xl-6 col-xl-offset-3">
                    <form className="p-t-3" onSubmit={this.onSubmit}>
                      <p className="font-weight-bold">Redefina sua senha</p>
                      <p>
                          Insira sua nova senha:
                      </p>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="password">{Messages.get("LabelPasswordNew")}</label>
                        <input className="form-element" id="password" name="password" type="password" ref="password" />
                      </div>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="passwordconfirm">{Messages.get("LabelPasswordConfirm")}</label>
                        <input className="form-element" id="passwordconfirm" name="passwordconfirm" type="password" ref="passwordconfirm" />
                      </div>

                        {this.state.error ?
                            <div className="alert alert-danger">
                                {this.state.error}
                            </div>
                        :""}

                      <div className="form-group row">
                        <div className="col-xs-12 col-sm-6">
                          <input type="submit" value="Redefinir senha" className="btn btn-brand btn-block" />
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
		</div>;
	}
});
