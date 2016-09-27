
var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");
var Toastr = require("toastr");

var Logo = require('ilevus/img/ilevus-logo-20px.png');
var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');
var UserIcon = require("ilevus/img/user.png");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        admin: React.PropTypes.bool.isRequired,
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
        return (
            <nav className="navbar navbar-full navbar-light bg-faded">
                <div className="container">
                    <Link to="/home" className="navbar-brand">
                        <img src={Logo} alt="ilevus" />
                    </Link>

                    <div className="hidden-sm-up pull-xs-right">
                        <button className="navbar-toggler ilv-btn ilv-btn-clean ilv-btn-icon" type="button" data-toggle="collapse" data-target="#js-navbar-search">
                            <i className="ilv-icon material-icons">&#xE8B6;</i>
                        </button>
                        <button className="navbar-toggler ilv-btn ilv-btn-clean ilv-btn-icon" type="button" data-toggle="collapse" data-target="#js-navbar-menu">
                            <i className="ilv-icon material-icons">&#xE5D2;</i>
                        </button>
                    </div>

                    <form className="ilv-form-inline" onSubmit={this.onSearch}>
                        <div className="collapse navbar-toggleable-xs" id="js-navbar-search">
                            <input ref="search-term" className="ilv-form-control" type="search" />
                            <button className="ilv-btn ilv-btn-icon ilv-btn-neutral" type="submit">
                                <i className="ilv-icon material-icons md-18">&#xE8B6;</i>
                            </button>
                        </div>
                    </form>

                    {this.state.logged ? (
                        <div className="nav navbar-nav pull-sm-right">
                            <div className="collapse navbar-toggleable-xs" id="js-navbar-menu">
                                <Link className="nav-item ilv-btn ilv-btn-destructive" to="/become-a-professional">{Messages.get("LabelProfessionalProfile")}</Link>

                                <div className="dropdown nav-item">
                                    <a href="javascript:;" className="ilv-btn ilv-btn-icon ilv-btn-clean p-x-0" data-toggle="dropdown">
                                        <i className="ilv-icon material-icons md-24">&#xE7F4;</i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" style={{ minWidth: "18rem" }}>
                                        <div className="ilv-blankslate">
                                            <p><i className="ilv-icon material-icons md-36">&#xE7F4;</i></p>
                                            <p><small>{Messages.get("TextNoNotifications")}</small></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="dropdown nav-item">
                                    <a href="javascript:;" className="ilv-avatar-fluid ilv-avatar-fluid-sm" data-toggle="dropdown"
                                        style={{
                                        backgroundImage: "url(" +
                                            (string(this.state.user.Image).isEmpty() ? UserIcon : this.state.user.Image) + ")"
                                        }}>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="user/profile">{Messages.get("LabelEditProfile")}</Link>
                                        <Link className="dropdown-item" to="user/account">{Messages.get("LabelAccountConfig")}</Link>
                                        <Link className="dropdown-item" to="user/account">{Messages.get("LabelChangeLanguage")}</Link>
                                        {!this.context.admin ? "":
                                            <Link className="dropdown-item" to="/admin/emails">{Messages.get("LabelAdminPanel")}</Link>
                                        }
                                        {this.state.user.EmailConfirmed ? "" :
                                            <a className="dropdown-item" href="" onClick={this.confirmEmail}>
                                                {Messages.get("LabelConfirmEmail")}
                                            </a>
                                        }
                                        <a className="dropdown-item" href="" onClick={this.onLogout}>{Messages.get("LabelLogout")}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="nav navbar-nav pull-sm-right">
                            <div className="collapse navbar-toggleable-xs" id="js-navbar-menu">
                                <Link className="nav-item ilv-btn ilv-btn-clean" to="/login">{Messages.get("LabelSignIn")}</Link>
                                <Link className="nav-item ilv-btn ilv-btn-primary" to="/signup">{Messages.get("LabelSignUp")}</Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        );
    }
});
