
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
                    <div className="col-md-10 offset-sm-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
                        <div className="ilv-card mt-3">
                            <div className="ilv-card-body">
                                <form onSubmit={this.onSubmit}>
                                    <h3>{Messages.get("TextRecoverPassword")}</h3>
                                    <p className="ilv-text-small">{Messages.get("TextRecoverPasswordDescription")}</p>

                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="email" name="email" type="email" ref="email" />
                                    </fieldset>

                                    <ErrorAlert store={UserSession} />

                                    <fieldset>
                                        <input className="ilv-btn ilv-btn-lg ilv-btn-primary ilv-btn-block" type="submit" value={Messages.get("TextRecoverPassword")} />
                                    </fieldset>
                                </form>
                            </div>
                        </div>

                        <div className="ilv-text-xs-center my-3">
                            <p><Link to="/login" className="ilv-font-weight-semibold">{Messages.get("TextRecoverPasswordRemember")}</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        );
	}
});
