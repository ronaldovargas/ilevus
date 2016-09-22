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
                                <button className="ilv-btn ilv-btn-primary">
                                    {Messages.get("LabelSave")}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="ilv-card-body">
                        <table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
                            <thead>
                                <tr>
                                    <th>{Messages.get("LabelCode")}</th>
                                    <th>{Messages.get("LanguagePortuguese")}</th>
                                    <th>{Messages.get("LanguageEnglish")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>LabelName</td>
                                    <td>Nome</td>
                                    <td>Name</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});