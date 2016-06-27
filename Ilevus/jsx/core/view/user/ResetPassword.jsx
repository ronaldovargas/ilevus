
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
                                {Messages.get("TextPasswordSetSuccess")}
                            </div>
                            <Link to="/login" className="btn btn-brand">
                                {Messages.get("ActionBackToLogin")}
                            </Link>
                        </div>
                    </div>
                </div>
			</div>
		    ;
		}
	    return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-sm-offset-1 col-lg-8 col-lg-offset-2 col-xl-6 col-xl-offset-3">
                        <form className="m-t-3" onSubmit={this.onSubmit}>
                            <h3>{Messages.get("LabelChangePassword")}</h3>

                            <fieldset className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="password">{Messages.get("LabelPasswordNew")}</label>
                                <input className="ilv-form-control ilv-form-control-lg" id="password" name="password" type="password" ref="password" />
                            </fieldset>
                            <fieldset className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="passwordconfirm">{Messages.get("LabelPasswordConfirm")}</label>
                                <input className="ilv-form-control ilv-form-control-lg" id="passwordconfirm" name="passwordconfirm" type="password" ref="passwordconfirm" />
                            </fieldset>

                            {this.state.error ?
                                <div className="ilv-alert ilv-alert-danger">
                                    {this.state.error}
                                </div>
                            :""}

                            <div className="row">
                                <fieldset className="ilv-form-group col-md-6">
                                    <input className="ilv-btn ilv-btn-primary ilv-btn-block" type="submit" value={Messages.get("ActionChangePassword")} />
                                </fieldset>
                                <fieldset className="ilv-form-group col-md-6">
                                    <Link to="/login" className="btn btn-link btn-block">{Messages.get("ActionBackToLogin")}</Link>
                                </fieldset>
                            </div>
                        </form>

                        <div className="ilv-text-xs-center m-y-3">
                            <small className="text-muted">
                                ©2016 Ilevus. {Messages.get("TextAllRightsReserved")}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        );
	}
});
