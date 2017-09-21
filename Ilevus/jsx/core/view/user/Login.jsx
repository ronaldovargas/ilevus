
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
	    
		UserSession.dispatch({
			action: UserSession.ACTION_LOGIN,
			data: data
		});
	},
	componentDidMount() {
		var me = this;

		if (!!UserSession.get("logged")) {
		    me.context.router.push("/home");
		} else {
		    UserSession.on("login", model => {
		        me.context.router.push("/home");
		    }, me);

		    if (me.props.params && me.props.params.accessToken) {
		        if (me.state.loaded) {
		            UserSession.dispatch({
		                action: UserSession.ACTION_AUTH_CALLBACK,
		                data: me.props.params.accessToken
		            });
		        } else {
		            UserSession.on("loaded", () => {
		                UserSession.dispatch({
		                    action: UserSession.ACTION_AUTH_CALLBACK,
		                    data: me.props.params.accessToken
		                });
		            }, me);
		        }
		    } else {
		        UserSession.on("loaded", () => {
		            me.setState({ loaded: true });
		        }, me);
		    }
		}
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},

	loginWithFacebook() {
	    if (typeof FB != 'undefined') {
	        var me = this;
	        FB.login((response) => {
	            if (response.status === 'connected') {
	                UserSession.dispatch({
	                    action: UserSession.ACTION_LOGIN_FACEBOOK,
	                    data: response.authResponse.accessToken
	                });
	            } else {
	                console.warn("Facebook not authorized:\n",response);
	            }
	        },{
	            scope: 'public_profile,email'
	        });
	    }
	},

	loginWithLinkedin() {
	    console.log(IN);
	    IN.User.authorize((arg) => {
	        console.log(IN);
	        console.log(IN.API.Profile());
	        /*UserSession.dispatch({
	            action: UserSession.ACTION_LOGIN_LINKEDIN,
	            data: IN.ENV.auth.anonymous_token
	        });*/
	    });
	},

	render() {
		if (!this.state.loaded) {
			return <LoadingGauge />;
		}
	    return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 offset-sm-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
                        <div className="ilv-card mt-3">
                            <div className="ilv-card-header">
                                <h3>{Messages.get("TextSignIn")}</h3>
                            </div>
                            <div className="ilv-card-body">
                                <fieldset className="ilv-form-group">
                                    <a className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-linkedin" href="/api/User/LoginWithLinkedin">
                                        {Messages.get("LabelLoginWithLinkedin")}
                                    </a>
                                </fieldset>
                                <fieldset className="ilv-form-group">
                                    <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-facebook" onClick={this.loginWithFacebook}>
                                        {Messages.get("LabelLoginWithFacebook")}
                                    </button>
                                </fieldset>
                                <hr/>
                                <form onSubmit={this.onSubmit}>
                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="email" name="email" type="email" ref="email" />
                                    </fieldset>
                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="password">{Messages.get("LabelPassword")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="password" name="password" type="password" ref="password" />
                                    </fieldset>

                                    <ErrorAlert store={UserSession} />

                                    <fieldset className="ilv-form-group">
                                        <div className="ilv-checkbox">
                                            <label htmlFor="stay-connected">
                                                <input className="ilv-control-input" type="checkbox" id="stay-connected" ref="stayconnected" />
                                                <span className="ilv-control-indicator"></span>
                                                <span className="ilv-control-label">{Messages.get("LabelStayConnected")}</span>
                                            </label>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <input type="submit" value={Messages.get("LabelSignIn")} className="ilv-btn ilv-btn-lg ilv-btn-primary ilv-btn-block" />
                                    </fieldset>
                                </form>
                            </div>
                        </div>


                        <div className="ilv-text-xs-center my-3">
                            <ul className="ilv-nav ilv-nav-inline ilv-font-weight-semibold mb-1">
                                <li className="ilv-nav-item">
                                    <Link className="ilv-nav-link" to="/signup">{Messages.get("TextSignUp")}</Link>
                                </li>
                                <li className="ilv-nav-item"> · </li>
                                <li className="ilv-nav-item">
                                    <Link className="ilv-nav-link" to="/recover-password">{Messages.get("TextRecoverPassword")}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
	}
});
