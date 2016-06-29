
var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");
var Toastr = require("toastr");

var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');
var UserIcon = require("ilevus/img/user.png");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            user: UserSession.get("user"),
            logged: !!UserSession.get("logged")
        };
    },
    componentWillMount() {
        var me = this;
        UserSession.on("update", session => {
            me.setState({
                user: session.get("user"),
                logged: true
            });
        }, me);
        UserSession.on("login", session => {
            me.setState({
                user: session.get("user"),
                logged: true
            });
        }, me);
        UserSession.on("logout", session => {
            me.setState({
                user: null,
                logged: false
            });
        }, me);

        UserSession.on("confirmationemail", code => {
            console.log(encodeURIComponent(code));
            Toastr.success(Messages.get("TextEmailConfirmationSent"));
        }, me);
        UserSession.on("confirmationemailfail", msg => {
            Toastr.info(msg);
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },
    onLogout(evt) {
        evt.preventDefault();
        UserSession.dispatch({
            action: UserSession.ACTION_LOGOUT
        });
    },
    onSearch(evt) {
        evt.preventDefault();
        var term = this.refs['search-term'].value;
        this.refs['search-term'].value = "";
        if (!string(term).isEmpty())
            this.context.router.push("/search/" + encodeURI(term));
    },
    confirmEmail(evt) {
        evt.preventDefault();
        UserSession.dispatch({
            action: UserSession.ACTION_CONFIRMATION_EMAIL
        });
    },

    render() {
        return (<nav className="navbar navbar-full navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="#/">
              <img src={LogoWhite} alt="ilevus" />
            </a>
            <button className="navbar-toggler hidden-sm-up pull-xs-right" type="button" data-toggle="collapse" data-target="#js-navbar-collapse">&#9776;</button>
            <div className="collapse navbar-toggleable-xs" id="js-navbar-collapse">
                <form className="form-inline pull-sm-left" onSubmit={this.onSearch}>
                  <input ref="search-term" className="form-element" style={{borderColor: '#393973'}} type="search"/>
                  <button className="btn btn-brand" type="submit">{Messages.get("LabelSearch")}</button>
                </form>
                {this.state.logged ? (
                <ul className="nav navbar-nav small pull-sm-right">
                    <li className="nav-item">
                        <a className="btn btn-warning-o" href="#">{Messages.get("LabelProfessionalProfile")}</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">{Messages.get("LabelMessages")}</a>
                    </li>
                    <li className="nav-item">
                        <div className="dropdown">
                            <a id="js-profile-dropdown" href="javascript:void(0)" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div className="avatar-fluid avatar-fluid-navbar"
                                    style={{
                                        backgroundImage: "url(" +
                                            (string(this.state.user.Image).isEmpty() ? UserIcon : this.state.user.Image) + ")"
                                    }}
                                />
                                <span className="hidden-sm-up m-l-1" style={{color: '#fff', fontWeight: '600'}}>{this.state.user.Name}</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="js-profile-dropdown">
                                <Link className="dropdown-item" to="user/profile">{Messages.get("LabelEditProfile")}</Link>
                                <Link className="dropdown-item" to="user/account">{Messages.get("LabelAccountConfig")}</Link>
                                <a className="dropdown-item" onClick={this.confirmEmail}>{Messages.get("LabelConfirmEmail")}</a>
                                <a className="dropdown-item" onClick={this.onLogout}>{Messages.get("LabelLogout")}</a>
                            </div>
                        </div>
                    </li>
                </ul>
                ) : (
                <ul className="nav navbar-nav small pull-sm-right">
			        <li className="nav-item">
                        <Link className="nav-link" to="/signup">{Messages.get("LabelSignUp")}</Link>
                    </li>
			        <li className="nav-item">
				        <Link className="nav-link" to="/login">{Messages.get("LabelSignIn")}</Link>
			        </li>
                </ul>
                )}
            </div>
          </div>
        </nav>);
    }
});
