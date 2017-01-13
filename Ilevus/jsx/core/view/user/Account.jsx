
var S = require("string");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: UserSession.get("loading")
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("fail", (msg) => {
            $("button").removeAttr("disabled");
            Toastr.remove();
            Toastr.error(msg);
        }, me);
        UserSession.on("loaded", () => {
            me.setState({
                loading: false
            });
        }, me);
        UserSession.on("updatepassword", () => {
            $(me.refs["setpwd-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.remove();
            Toastr.success(Messages.get("TextPasswordSetSuccess"));
        }, me);

        UserSession.on("update-confirmed-email", () => {
            $("button").removeAttr("disabled");
            Toastr.remove();
            Toastr.success(Messages.get("TextChangeEmailConfirmationSent"));
            this.refs['profile-email'].value = "";
            me.forceUpdate();
        }, me);

        UserSession.on("confirmationemail", () => {
            $("button").removeAttr("disabled");
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    updateLanguage(event) {
        $(this.refs["culture-save"]).addClass("loading").attr("disabled", "disabled");
        var data = {
            Culture: this.refs['account-culture'].value
        };

        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_CULTURE,
            data: data
        });
    },

    updatePassword(event) {
        $(this.refs["setpwd-save"]).addClass("loading").attr("disabled", "disabled");
        var data = {
            OldPassword: this.refs['setpwd-oldpassword'].value,
            NewPassword: this.refs['setpwd-password'].value,
            ConfirmPassword: this.refs['setpwd-passwordconfirm'].value
        };

        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PASSWORD,
            data: data
        });
    },

    updateEmail(event) {
        event.preventDefault();
        var email = S(this.refs['profile-email'].value);
        if (email.isEmpty()) {
            Toastr.remove();
            Toastr.error(Messages.get("TextTypeYourEmail"));
            return;
        }
        $(this.refs["email-save"]).attr("disabled", "disabled");
        var user = UserSession.get("user");
        if (user.EmailConfirmed) {
            UserSession.dispatch({
                action: UserSession.ACTION_UPDATE_CONFIRMED_EMAIL,
                data: email.s
            });
        } else {
            UserSession.dispatch({
                action: UserSession.ACTION_UPDATE_EMAIL,
                data: email.s
            });
        }
    },

    confirmEmail(event) {
        event.preventDefault();
        $(this.refs["email-confirm"]).attr("disabled", "disabled");
        UserSession.dispatch({
            action: UserSession.ACTION_CONFIRMATION_EMAIL
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        return (
            <div>
                <div className="row">
                    <div className="col mb-5">
                        <h4>{Messages.get("LabelChangePassword")}
                        </h4>
                        <form>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editAccountFormPassword">{Messages.get("LabelPasswordCurrent")}</label>
                                <input className="ilv-form-control" type="password" id="editAccountFormPassword" ref="setpwd-oldpassword" />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editAccountFormNewPassword">{Messages.get("LabelPasswordNew")}</label>
                                <input className="ilv-form-control" type="password" id="editAccountFormNewPassword" ref="setpwd-password" />
                            </div>

                            <div className="ilv-form-group m-b-0">
                                <label className="ilv-form-label" htmlFor="editAccountFormConfirmPassword">{Messages.get("LabelPasswordConfirm")}</label>
                                <input className="ilv-form-control" type="password" id="editAccountFormConfirmPassword" ref="setpwd-passwordconfirm" />
                            </div>
                        </form>
                        <button className="ilv-btn ilv-btn-primary" ref="setpwd-save" onClick={this.updatePassword}>{Messages.get("ActionChangePassword")}
                        </button>
                    </div>

                    <div className="col mb-5">
                        <form className="mb-5">
                            <h4>{Messages.get("LabelChangeEmail")}</h4>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormMail">{user.EmailConfirmed ? Messages.get("LabelNewEmail") : Messages.get("LabelEmail")}
                                </label>
                                <input className="ilv-form-control"
                                        type="email"
                                        spellCheck={false}
                                        id="editProfileFormMail"
                                        ref="profile-email"
                                        defaultValue={user.EmailConfirmed ? "":user.Email} />
                                <span className="ilv-text-small">{Messages.get("TextEmailWillNotBeShared")}
                                </span>
                            </div>

                            {user.EmailConfirmed ?
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("LabelActualEmail")}</label>
                                    <div>{user.Email} <i className="ilv-text-success material-icons md-18"
                                                            title={Messages.get("TextEmailConfirmed")}>&#xE86C;</i>
                                    </div>
                                    {user.EmailChange ?
                                        <div>{user.EmailChange} <i className="ilv-text-warning material-icons md-18"
                                                                    title={Messages.get("TextEmailWaitingConfirmation")}>&#xE887;</i>
                                        </div>
                                    : "" }
                                </div>
                            : "" }

                            {user.EmailConfirmed ? "" :
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("LabelActualEmail")}</label>
                                    <input className="ilv-form-control" value={user.Email} disabled />
                                    <a className="ilv-text-small" href="javascrip:;" onClick={this.confirmEmail} ref="email-confirm">{Messages.get("LabelConfirmEmail")}
                                    </a>
                                </div>
                            }
                            <button className="ilv-btn ilv-btn-primary" ref="email-save" onClick={this.updateEmail}>
                                {Messages.get("ActionChangeEmail")}
                            </button>
                        </form>
                        
                        <form className="mb-5">
                            <h4>{Messages.get("LabelChangeLanguage")}</h4>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editAccountCulture">
                                    {Messages.get("LabelLanguage")}
                                </label>
                                <select className="ilv-form-control" id="editAccountCulture" ref="account-culture" defaultValue={user.Culture}>
                                    <option value="">-- {Messages.get("LabelLanguage")} --</option>
                                    <option value="pt-br">{Messages.get("LanguagePortuguese")}</option>
                                    <option value="en">{Messages.get("LanguageEnglish")}</option>
                                    <option value="es">{Messages.get("LanguageSpanish")}</option>
                                </select>
                            </div>
                            <button className="ilv-btn ilv-btn-primary" ref="culture-save" onClick={this.updateLanguage}>
                                {Messages.get("ActionChangeLanguage")}
                            </button>
                        </form>
                        
                    </div>
                </div>
            </div>
        );
    }
});
