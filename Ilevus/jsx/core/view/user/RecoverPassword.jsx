
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
		return (<div className="container">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-xl-6 col-xl-offset-3">

                    <form className="p-t-3" onSubmit={this.onSubmit}>
                      <h3>{Messages.get("TextRecoverPassword")}</h3>
                      <p>
                          {Messages.get("TextRecoverPasswordDescription")}
                      </p>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                        <input className="form-element form-element-lg" id="email" name="email" type="email" ref="email" />
                      </div>

                      <ErrorAlert store={UserSession} />
                      
                      <div className="form-group row">
                        <div className="col-xs-12 col-sm-6">
                          <input type="submit" value={Messages.get("TextRecoverPassword")} className="btn btn-lg btn-brand btn-block" />
                        </div>
                        <div className="col-xs-12 col-sm-6">
                          <Link to="/login" className="btn btn-lg btn-link btn-block">{Messages.get("TextSignIn")}</Link>
                        </div>
                      </div>
                    </form>

                    <div className="text-xs-center">
                      <p className="text-muted small p-t-2">
                          ©2016 Ilevus. {Messages.get("TextAllRightsReserved")}
                      </p>
                    </div>
                  </div>
                </div>
		</div>);
	}
});
