
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
            $(me.refs["setpwd-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.error(msg);
        }, me);
        UserSession.on("loaded", () => {
            me.setState({
                loading: false
            });
        }, me);
        UserSession.on("updatepassword", () => {
            $(me.refs["setpwd-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.success(Messages.get("TextPasswordSetSuccess"));
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
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

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        return (<div>
            <div className="card m-b-2">
                <div className="card-header">
                    {Messages.get("LabelChangePassword")}
                </div>
                <div className="card-block">
                    <form className="small ">
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editAccountFormPassword">
                                {Messages.get("LabelPasswordCurrent")}
                            </label>
                            <div className="col-sm-4">
                                <input className="form-element"
                                       type="password"
                                       id="editAccountFormPassword"
                                       ref="setpwd-oldpassword" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editAccountFormNewPassword">
                                {Messages.get("LabelPasswordNew")}
                            </label>
                            <div className="col-sm-4">
                                <input className="form-element"
                                       type="password"
                                       id="editAccountFormNewPassword"
                                       ref="setpwd-password" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editAccountFormConfirmPassword">
                                {Messages.get("LabelPasswordConfirm")}
                            </label>
                            <div className="col-sm-4">
                                <input className="form-element"
                                       type="password"
                                       id="editAccountFormConfirmPassword"
                                       ref="setpwd-passwordconfirm" />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <button className="btn btn-brand" ref="setpwd-save" onClick={this.updatePassword}>
                        {Messages.get("ActionChangePassword")}
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
        </div>);
    }
});
