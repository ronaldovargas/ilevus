var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    render () {
        return (
            <div>
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>Usuários</strong>
                    </div>
                    <div className="ilv-card-body">
                        <table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Nível de Acesso</th>
                                    <th>Status</th>
                                    <th>Perfil Profissional</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        Henrique Fiorini
                                        <i title="Email verificado"
                                           className="ilv-icon material-icons md-18 ilv-text-info"
                                           style={{margin: "-4px 0 0 5px"}}>&#xE8E8;</i>
                                    </td>
                                    <td>henriquehfr2@gmail.com</td>
                                    <td>Usuário</td>
                                    <td>Ativo</td>
                                    <td>N/A</td>
                                    <td className="ilv-text-xs-right">
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon p-a-0" title="Editar Usuário">
                                            <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon p-a-0" title="Bloquear Usuário">
                                            <i className="ilv-icon material-icons md-18">&#xE14B;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon p-a-0" title="Excluir Conta">
                                            <i className="ilv-icon material-icons md-18">&#xE872;</i>
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