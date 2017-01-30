
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
            <nav className="navbar fixed-top ilv-navbar flex-row">
                <div className="container d-flex flex-row">
                    <Link to="/home" className="navbar-brand">
                        <img src={Logo} alt="ilevus" />
                    </Link>

                    <form className="form-inline mr-auto ilv-navbar-search" onSubmit={this.onSearch} id="js-navbar-search">
                        <input ref="search-term" className="form-control ilv-form-control ilv-navbar-search-input" type="search" />
                        <button className="ilv-btn ilv-btn-icon ilv-btn-primary ilv-navbar-search-btn" type="submit">
                            <i className="ilv-icon material-icons md-18">&#xE8B6;</i>
                            {Messages.get("LabelSearch")}
                        </button>
                    </form>
                            
                    {this.state.logged ? (
                        <form className="form-inline">

                            <div className="nav-item">
                                <Link className="nav-link" to="/become-a-professional">{Messages.get("LabelProfessional")}</Link>
                            </div>

                            <div className="nav-item">
                                <Link className="nav-link ilv-btn ilv-btn-icon" title={Messages.get("LabelMessages")} to="/notifications/messages">
                                    <i className="ilv-icon material-icons">&#xE0C9;</i>
                                </Link>
                            </div>

                            <div className="nav-item">
                                <Link className="nav-link ilv-btn ilv-btn-icon" title={Messages.get("LabelMyAgenda")} to="/view-schedule">
                                    <i className="ilv-icon material-icons">&#xE8E9;</i>
                                </Link>
                            </div>
                                        
                            <div className="dropdown nav-item hidden">
                                <a href="javascript:;" className="ilv-btn ilv-btn-icon ilv-btn-clean px-0" data-toggle="dropdown">
                                    <i className="ilv-icon material-icons md-24">&#xE7F4;</i> <span className="hidden-sm-up ml-1">{Messages.get("LabelNotifications")}</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" style={{ minWidth: "18rem" }}>
                                    <div className="ilv-blankslate">
                                        <p><i className="ilv-icon material-icons md-36">&#xE7F4;</i></p>
                                        <p><small>{Messages.get("TextNoNotifications")}</small></p>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown nav-item">
                                <a data-toggle="dropdown">
                                    <span className="ilv-avatar-fluid ilv-avatar-fluid-sm"
                                            style={{
                                        backgroundImage: "url(" +
                                            (string(this.state.user.Image).isEmpty() ? UserIcon : this.state.user.Image) + ")"
                                        }}>
                                    </span>
                                    <span className="hidden-sm-up ml-1">{this.state.user.Name} {this.state.user.Surname}</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to={"/profile/"+UserSession.get("user").Id}>{Messages.get("LabelViewProfile")}</Link>
                                    <Link className="dropdown-item" to="/user/profile">{Messages.get("LabelEditProfile")}</Link>
                                    <Link className="dropdown-item" to="/user/account">{Messages.get("LabelAccountConfig")}</Link>
                                    <Link className="dropdown-item" to="/user/account">{Messages.get("LabelChangeLanguage")}</Link>
                                    {!this.context.admin ? "" :
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
                        </form>
                    ) : (
                        <form className="form-inline">
                            <Link className="ilv-btn ilv-btn-clean" to="/login">{Messages.get("LabelSignIn")}</Link>
                            <Link className="ilv-btn ilv-btn-neutral" to="/signup">{Messages.get("LabelSignUp")}</Link>
                        </form>
                    )}

                    <div className="hidden-sm-up">
                        <button className="navbar-toggler ilv-btn ilv-btn-clean ilv-btn-icon" type="button" data-toggle="collapse" data-target="#js-navbar-search">
                            <i className="ilv-icon material-icons">&#xE8B6;</i>
                        </button>
                        <button className="navbar-toggler ilv-btn ilv-btn-clean ilv-btn-icon" type="button" data-toggle="collapse" data-target="#js-navbar-menu">
                            <i className="ilv-icon material-icons">&#xE5D2;</i>
                        </button>
                    </div>
                </div>
            </nav>
        );
    }
});
