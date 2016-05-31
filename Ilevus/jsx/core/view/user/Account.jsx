
var React = require("react");
var Link = require("react-router").Link;

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    onSearch(evt) {
        evt.preventDefault();
        var term = this.refs['search-term'].value;
        if (!string(term).isEmpty())
            this.context.router.push("/search/" + encodeURI(term));
    },
    render() {
        return (
            <div className="bg-faded">
                <div className="navbar navbar-full navbar-dark bg-inverse">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <ul className="nav navbar-nav small">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Dashboard</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Caixa de Entrada</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Perfil Profissional</a>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="user/profile">Perfil</Link>
                                    </li>
                                    <li className="nav-item active">
                                        <Link className="nav-link" to="user/account">Conta</Link>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Empresa</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container p-y-3">
                    <div className="row">
                        <div className="col-sm-9 col-sm-offset-3">
                            <div className="card m-b-2">
                                <div className="card-header">
                                    Alterar sua senha
                                </div>
                                <div className="card-block">
                                    <form className="small ">
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editAccountFormPassword">Senha Antiga</label>
                                            <div className="col-sm-4">
                                                <input className="form-element form-element-sm" type="text" id="editAccountFormPassword" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editAccountFormNewPassword">Nova Senha</label>
                                            <div className="col-sm-4">
                                                <input className="form-element form-element-sm" type="text" id="editAccountFormNewPassword" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editAccountFormConfirmPassword">Confirmar Senha</label>
                                            <div className="col-sm-4">
                                                <input className="form-element form-element-sm" type="text" id="editAccountFormConfirmPassword" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer text-xs-right">
                                    <button className="btn btn-sm btn-brand">Atualizar Senha</button>
                                </div>
                            </div>

                            <div className="card m-b-2">
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
                                <div className="card-footer text-xs-right">
                                    <button className="btn btn-sm btn-brand">Salvar</button>
                                </div>

                            </div>

                            <div className="card m-b-2">
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
                            </div>
                        </div>
            </div>
        );
    }
});
