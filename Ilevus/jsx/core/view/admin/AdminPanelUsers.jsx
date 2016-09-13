var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    render () {
        return (
            <div>
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>Usuários</strong>
                    </div>
                    <div className="ilv-card-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Nível de Acesso</th>
                                    <th>Confirmação de Email</th>
                                    <th>Tem perfil profissional</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Henrique Fiorini</td>
                                    <td>henriquehfr2@gmail.com</td>
                                    <td>Usuário</td>
                                    <td>
                                        <span className="ilv-text-info">
                                            <i className="ilv-icon material-icons">&#xE8E8;</i> Verificado
                                        </span>
                                    </td>
                                    <td></td>
                                    <td>
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon" title="Resetar Senha">
                                            <i className="ilv-icon material-icons">&#xE897;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon" title="Bloquear Usuário">
                                            <i className="ilv-icon material-icons">&#xE14B;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon" title="Excluir Conta">
                                            <i className="ilv-icon material-icons">&#xE872;</i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});