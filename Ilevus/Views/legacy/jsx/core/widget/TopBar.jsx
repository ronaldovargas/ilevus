﻿var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");
var Toastr = require("toastr");

var Logo = require('ilevus/img/ilevus-logo-20px.png');
var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');
var UserIcon = require("ilevus/img/user.png");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        admin: PropTypes.bool.isRequired,
        router: PropTypes.object,
        
    },    
   
    getInitialState() {            
      
        return {
            user: UserSession.get("user"),
            logged: !!UserSession.get("logged"),
            ariaExpanded: false              
        };
    },
    componentWillMount() {
        var me = this;      
        UserSession.on("update", session => {            
            if (me.state && me.state.logged) {
                window.onbeforeunload = function (event) {
                    if (!this.state || !this.state.logged) {
                        return null;
                    }
                    var message = 'Important: Please click on \'Save\' button to leave this page.';
                    if (typeof event == 'undefined') {
                        event = window.event;
                    }
                    if (event) {
                        event.returnValue = message;
                    }
                    return message;
                };
            } else {
                window.onbeforeunload = null;
            }

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
            window.onbeforeunload = null;
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
        //if (confirm('Logout?')) {
            UserSession.dispatch({
                action: UserSession.ACTION_LOGOUT
            });
        //};
    },
    onSearch(evt) {
        evt.preventDefault();
        var term = this.refs['search-term'].value;
        this.refs['search-term'].value = "";
        if (!string(term).isEmpty())
            this.context.router.push("/search/" + encodeURI(term));
            this.closeNavBar();          
    },
    confirmEmail(evt) {
        evt.preventDefault();
        UserSession.dispatch({
            action: UserSession.ACTION_CONFIRMATION_EMAIL
        });
    },
    getNomeURL() {
        var idUser = UserSession.get("user").Id;
        try {            
            idUser = UserSession.get("user").Professional.Professional.NomeURL;
        } catch (ex) {
            console.log('utilizando id como profilepath')
        }

        return idUser || UserSession.get("user").Id;
    },

    closeNavBar(){      
       this.setState({
        ariaExpanded: false,      
        });   
      },

    setHidden(){
        this.setState({
            ariaExpanded: true           
        });      
    },

    render() { 

        var divStyle = {
            display: 'none'
        };

        const hidden = this.state.ariaExpanded ? {} : divStyle;  
             
        return (
            <nav className="navbar navbar-toggleable-md navbar-light bg-faded fixed-top ilv-navbar">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar_menu" aria-controls="navbar_menu" onClick={this.setHidden} aria-expanded="false" aria-label="Toggle navigation">
                    <i className="ilv-icon material-icons">&#xE5D2;</i>
                </button>

                <Link to="/home" className="navbar-brand">
                    {<img src={Logo} alt="ilevus" />}
                </Link>

                <div className='navbar-collapse collapse' style={hidden} id="navbar_menu">

                    <form className="form-inline mr-auto mt-2 mt-lg-0 ilv-navbar-search" onSubmit={this.onSearch} id="js-navbar-search">
                        <input ref="search-term" className="form-control ilv-form-control ilv-navbar-search-input" type="search" />
                        <button className="ilv-btn ilv-btn-icon ilv-btn-primary ilv-navbar-search-btn" type="submit">
                            <i className="ilv-icon material-icons md-18">&#xE8B6;</i>{Messages.get("LabelSearch")}
                        </button>
                    </form>
                    {this.state.logged ? (
                    <ul className="my-2 my-lg-0 navbar-nav">

                        <li className="nav-item ilv-navbar-title-item">
                            <Link className="nav-link ilv-btn ilv-btn-clean"title={Messages.get("LabelNotifications")} to="notifications/timeline">
                                <span className="hidden-sm-up ilv-navbar-title-item-txt-1">{Messages.get("LabelNotifications")}</span>
                                <i className="ilv-icon material-icons">&#xE7F4;</i>
                            </Link>
                        </li>
                        <li className="nav-item ilv-navbar-title-item">
                            <Link className="nav-link ilv-btn ilv-btn-clean" title={Messages.get("LabelMessages")} to="/notifications/messages">
                                <span className="hidden-sm-up ilv-navbar-title-item-txt-2">{Messages.get("LabelMessages")}</span>
                                <i className="ilv-icon material-icons">&#xE0CA;</i>
                            </Link>
                        </li>
                        <li className="nav-item ilv-navbar-title-item">
                            <Link className="nav-link ilv-btn ilv-btn-clean" title={Messages.get("LabelDashboard")} to="/user/dashboard">
                                <span className="hidden-sm-up ilv-navbar-title-item-txt-3">{Messages.get("LabelDashboard")}</span>
                                <i className="ilv-icon material-icons">&#xE871;</i>
                            </Link>
                        </li>
                        <li className="nav-item ilv-navbar-title-item">
                            <div className="dropdown">
                                <a className="nav-link ilv-btn ilv-btn-clean ilv-navbar-title-item ml-2 dropdown-toggle" id="personal_submenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="ilv-avatar-fluid ilv-avatar-fluid-sm"
                                          style={{
                                            backgroundImage: "url(" +
                                                (string(this.state.user.Image).isEmpty() ? UserIcon : this.state.user.Image) + ")"
                                          }}>
                                    </span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="personal_submenu">
                                    <Link className="dropdown-item" to="/become-a-professional">{Messages.get("LabelProfessionalProfile")}</Link>
                                    <div className="dropdown-divider"></div>
                                    <Link className="dropdown-item" to={"/profile/" + this.getNomeURL()}>{Messages.get("LabelViewProfile")}</Link>
                                    <Link className="dropdown-item" to="/user/profile">{Messages.get("LabelEditProfile")}</Link>
                                    <Link className="dropdown-item" to="/user/account">{Messages.get("LabelAccountConfig")}</Link>
                                    <Link className="dropdown-item" to="/user/account">{Messages.get("LabelChangeLanguage")}</Link>
                                    {!this.context.admin ? "" :
                                    <Link className="dropdown-item" to="/admin/home">{Messages.get("LabelAdminPanel")}</Link>
                                    }
                                    {this.state.user.EmailConfirmed ? "" :
                                        <a className="dropdown-item" href="" onClick={this.confirmEmail}>{Messages.get("LabelConfirmEmail")}</a>
                                    }
                                    <a className="dropdown-item" href="" onClick={this.onLogout}>{Messages.get("LabelLogout")}</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                    ) : (
                    <ul className="my-2 my-lg-0 navbar-nav">
                        <li className="nav-item">
                            <Link className="ilv-btn ilv-btn-clean" to="/login">{Messages.get("LabelSignIn")}</Link>
                            <Link className="ilv-btn ilv-btn-neutral" to="/signup">{Messages.get("LabelSignUp")}</Link>
                        </li>
                    </ul>
                    )}
                </div>
            </nav>
        );
    }
});


