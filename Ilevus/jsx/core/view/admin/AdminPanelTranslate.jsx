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
                        <div className="ilv-media">
                            <div className="ilv-media-body">
                                <strong>Traduções</strong>
                            </div>
                            <div className="ilv-media-left">
                                <button className="ilv-btn ilv-btn-link">Adicionar idioma</button>
                            </div>
                        </div>
                    </div>
                    <div className="ilv-card-body">
                        <table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>PT_BR</th>
                                    <th>EN_US</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>LabelName</td>
                                    <td>Nome</td>
                                    <td>Name</td>
                                    <td className="ilv-text-xs-right">
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon p-a-0" title="Editar Entrada">
                                            <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean ilv-btn-icon p-a-0" title="Excluir Tradução">
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