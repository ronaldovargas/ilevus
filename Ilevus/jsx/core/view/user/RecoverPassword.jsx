
var React = require("react");
var Link = require("react-router").Link;
var ErrorAlert = require("ilevus/jsx/core/widget/ErrorAlert.jsx");
var Toastr = require("toastr");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
		return {
		};
	},
    onSubmit(evt) {
        evt.preventDefault();
        var data = {
            Email: this.refs['email'].value
        };
		UserSession.dispatch({
			action: UserSession.ACTION_RECOVER_PASSWORD,
			data: data
		});
	},
    componentDidMount() {
        var me = this;
	    UserSession.on("recoverpassword", data => {
	        console.log(encodeURIComponent(data));
	        Toastr.success(Messages.get("TextRecoverPasswordEmailSent"));
			me.context.router.push("/login");
		}, me);
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
	    return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 col-sm-offset-1 col-lg-8 col-lg-offset-2 col-xl-6 col-xl-offset-3">
                        <form className="p-t-3" onSubmit={this.onSubmit}>
                            <h3>{Messages.get("TextRecoverPassword")}</h3>
                            <p>{Messages.get("TextRecoverPasswordDescription")}</p>

                            <fieldset className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                                <input className="ilv-form-control ilv-form-control-lg" id="email" name="email" type="email" ref="email" />
                            </fieldset>

                            <ErrorAlert store={UserSession} />
                      
                            <div className="row">
                                <div className="ilv-form-group col-md-6">
                                    <input className="ilv-btn ilv-btn-lg ilv-btn-primary ilv-btn-block" type="submit" value={Messages.get("TextRecoverPassword")} />
                                </div>
                                <div className="ilv-form-group col-md-6">
                                    <Link to="/login" className="ilv-btn ilv-btn-lg ilv-btn-clean ilv-btn-block">{Messages.get("TextSignIn")}</Link>
                                </div>
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
