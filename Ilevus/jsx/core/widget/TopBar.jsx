
var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");
var Toastr = require("toastr");

var Logo = require('ilevus/img/ilevus-logo-20px.png');
var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');

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
        return (
            <nav className="ilv-navbar ilv-navbar-light">
                <div className="container">
                    <div className="ilv-navbar-nav">
                        <div className="ilv-navbar-nav-item ilv-navbar-nav-item-shrink">
                            <Link to="/home">
                                <img src={Logo} alt="ilevus" />
                            </Link>
                        </div>
                        <div className="ilv-navbar-nav-item">
                            <form onSubmit={this.onSearch}>
                                <div className="ilv-input-group">
                                    <input ref="search-term" className="ilv-form-control" type="search" />
                                    <div className="ilv-input-group-btn">
                                        <button className="ilv-btn ilv-btn-neutral" type="submit">{Messages.get("LabelSearch")}</button>
                                    </div>
                                </div>
                            </form>
                        </div>                    
                        <div className="ilv-navbar-nav-item ilv-text-xs-right">
                            {this.state.logged ? (
                                <ul className="ilv-nav ilv-nav-inline">
                                    <li className="ilv-nav-item">
                                        <Link className="ilv-btn ilv-btn-destructive" to="/user/professional-profile">{Messages.get("LabelProfessionalProfile")}</Link>
                                    </li>
                                    <li className="ilv-nav-item">
                                        <a className="ilv-btn ilv-btn-clean" href="#">{Messages.get("LabelMessages")}</a>
                                    </li>
                                    <li className="ilv-nav-item">
                                        <div className="dropdown">
                                            <a id="js-profile-dropdown" className="ilv-avatar ilv-avatar-sm" href="javascript:void(0)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src={this.state.user.Image} alt={this.state.user.Name} />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="js-profile-dropdown">
                                                <Link className="dropdown-item" to="user/profile">{Messages.get("LabelEditProfile")}</Link>
                                                <Link className="dropdown-item" to="user/account">{Messages.get("LabelAccountConfig")}</Link>
                                                <a className="dropdown-item" href="" onClick={this.confirmEmail}>{Messages.get("LabelConfirmEmail")}</a>
                                                <a className="dropdown-item" href="" onClick={this.onLogout}>{Messages.get("LabelLogout")}</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="ilv-nav ilv-nav-inline ilv-text-small">
                                    <li className="ilv-nav-item">
				                        <Link className="ilv-btn ilv-btn-clean" to="/login">{Messages.get("LabelSignIn")}</Link>
                                    </li>
			                        <li className="ilv-nav-item">
                                        <Link className="ilv-btn ilv-btn-success" to="/signup">{Messages.get("LabelSignUp")}</Link>
			                        </li>
			                        
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
});
