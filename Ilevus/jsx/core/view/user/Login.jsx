
var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var ErrorAlert = require("ilevus/jsx/core/widget/ErrorAlert.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
		return {
			loaded: !UserSession.get("loading")
		};
	},
	onSubmit(evt) {
	    evt.preventDefault();
	    var data = {
	        email: this.refs['email'].value,
	        password: this.refs['password'].value,
	        stayconnected: this.refs['stayconnected'].checked
	    };
	    console.log(data);
		UserSession.dispatch({
			action: UserSession.ACTION_LOGIN,
			data: data
		});
	},
	componentDidMount() {
		var me = this;
		UserSession.on("login", model => {
			me.context.router.push("/home");
		}, me);
		UserSession.on("loaded", () => {
			me.setState({loaded: true});
		}, me);
		if (!!UserSession.get("logged")) {
		    me.context.router.push("/home");
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
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-sm-offset-1 col-lg-8 col-lg-offset-2 col-xl-6 col-xl-offset-3">
                        <div className="ilv-card m-t-3">
                            <div className="ilv-card-body">
                                <form onSubmit={this.onSubmit}>
                                    <h3>{Messages.get("TextSignIn")}</h3>
                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="email" name="email" type="email" ref="email" />
                                    </fieldset>
                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="password">{Messages.get("LabelPassword")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="password" name="password" type="password" ref="password" />
                                    </fieldset>

                                    <ErrorAlert store={UserSession} />

                                    <div className="row">
                                        <fieldset className="ilv-form-group col-md-6">
                                            <input type="submit" value={Messages.get("LabelSignIn")} className="ilv-btn ilv-btn-lg ilv-btn-primary ilv-btn-block" />
                                        </fieldset>
                                        <fieldset className="ilv-form-group col-md-6">
                                            <div className="ilv-checkbox ilv-btn-lg ilv-btn-block">
                                                <label htmlFor="stay-connected">
                                                    <input className="ilv-control-input" type="checkbox" id="stay-connected" ref="stayconnected" />
                                                    <span className="ilv-control-indicator"></span>
                                                    <span className="ilv-control-label">{Messages.get("LabelStayConnected")}</span>
                                                </label>
                                            </div>
                                        </fieldset>
                                    </div>
                                </form>
                            </div>
                        </div>
                        

                        <div className="ilv-text-xs-center m-y-3">
                            <ul className="ilv-nav ilv-nav-inline ilv-font-weight-semibold m-b-1">
                                <li className="ilv-nav-item">
                                    <Link className="ilv-nav-link" to="/signup">{Messages.get("TextSignUp")}</Link>
                                </li>
                                <li className="ilv-nav-item"> · </li>
                                <li className="ilv-nav-item">
                                    <Link className="ilv-nav-link" to="/recover-password">{Messages.get("TextRecoverPassword")}</Link>
                                </li>
                            </ul>
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
