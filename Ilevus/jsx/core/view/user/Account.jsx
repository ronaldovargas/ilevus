
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
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>{Messages.get("LabelChangeLanguage")}</strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            <div className="row">
                                <div className="col-md-6">
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
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-primary" ref="culture-save" onClick={this.updateLanguage}>
                            {Messages.get("ActionChangeLanguage")}
                        </button>
                    </div>
                </div>

                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>
                            {Messages.get("LabelChangePassword")}
                        </strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            <div className="row">
                                <div className="col-md-6">
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
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-primary" ref="setpwd-save" onClick={this.updatePassword}>
                            {Messages.get("ActionChangePassword")}
                        </button>
                    </div>
                </div>

                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>
                            {Messages.get("LabelChangeEmail")}
                        </strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            {user.EmailConfirmed ?
                                <div className="media m-b-1">
                                    <div className="media-header">
                                        <strong>{Messages.get("LabelActualEmail")}</strong>
                                    </div>
                                    <div className="media-body">
                                        <div>
                                            {user.Email} <i className="ilv-text-success material-icons md-18"
                                                            title={Messages.get("TextEmailConfirmed")}>&#xE86C;</i>
                                        </div>
                                        {user.EmailChange ? <div>
                                            {user.EmailChange} <i className="ilv-text-warning material-icons md-18"
                                                                  title={Messages.get("TextEmailWaitingConfirmation")}>&#xE887;</i>
                                        </div>:""}
                                    </div>
                                </div>
                            :""}
                            {user.EmailConfirmed ? "" :<div>
                                {user.Email} <button className="ilv-btn ilv-btn-primary ilv-btn-sm" onClick={this.confirmEmail} ref="email-confirm">
                                    {Messages.get("LabelConfirmEmail")}
                                </button>
                            </div>}
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="ilv-form-group m-b-0">
                                        <label className="ilv-form-label" htmlFor="editProfileFormMail">
                                            {user.EmailConfirmed ? Messages.get("LabelNewEmail"):Messages.get("LabelEmail")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="email"
                                               spellCheck={false}
                                               id="editProfileFormMail"
                                               ref="profile-email"
                                               defaultValue={user.EmailConfirmed ? "":user.Email} />
                                        <span className="ilv-text-small">
                                            {Messages.get("TextEmailWillNotBeShared")}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-primary" ref="email-save" onClick={this.updateEmail}>
                            {Messages.get("ActionChangeEmail")}
                        </button>
                    </div>
                </div>

                <div className="card m-b-2 hidden">
                <div className="card-header">
                Notificação de login
                </div>
                <div className="card-block small">
                <p>
                As notificações de login são um recurso extra de segurança. Quando você ativar esse recurso,
                informaremos sempre que alguém tentar fazer login na sua conta do Airbnb de outro navegador.
                Isso ajuda a manter sua conta segura.
                </p>
                <div className="checkbox">
                <label htmlFor="account-login-notification">
                <input type="checkbox" id="account-login-notification" ref="loginnotification" /> Ativar notificações de login 
                </label>
                </div>
                </div>
                <div className="card-footer">
                <button className="btn btn-brand">Salvar</button>
                </div>

                </div>

                <div className="card m-b-2 hidden">
                <div className="card-header">
                Histórico de acesso
                </div>
                <div className="card-block">
                <table className="table table-sm small m-a-0">
                <thead>
                <tr>
                <th>Navegador/Dispositivo</th>
                <th>Localização</th>
                <th>Quando</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <td>Chrome, Windows 10</td>
                <td>Belo Horizonte, MG, Brasil</td>
                <td>30/05/2016, 21:14</td>
                </tr>
                <tr>
                <td>Firefox, Windows 8.1</td>
                <td>Belo Horizonte, MG, Brasil</td>
                <td>21/05/2016, 13:26</td>
                </tr>
                </tbody>
                </table>
                </div>
                </div>
            </div>
        );
    }
});
