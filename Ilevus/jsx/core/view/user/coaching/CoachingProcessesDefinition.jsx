var React = require('react');
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    render() {
        return (
            <div>
                <div className="ilv-form-group">
                    <div className="ilv-media ilv-media-middle">
                        <div className="ilv-media-left mr-3">
                             <input className="ilv-form-control d-inline-block"
                                    type="text"
                                    style={{minWidth: '280px' }}
                                    placeholder={Messages.get("LabelAddProcessStep")} />
                        </div>
                        <div className="ilv-media-body">
                            <button className="ilv-btn ilv-btn-success">{Messages.get("LabelAdd")}</button>
                        </div>
                    </div>
                </div>
                <table className="ilv-table">
                    <thead>
                        <tr>
                            <th width="80"></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelRaiseOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE316;</i>
                                    </button>
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelDropOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE313;</i>
                                    </button>
                                </div>
                            </td>
                            <td>Identificar situação atual</td>
                            <td className="text-right">
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean ilv-btn-block" title={Messages.get("LabelDelete")}>
                                        <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelRaiseOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE316;</i>
                                    </button>
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelDropOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE313;</i>
                                    </button>
                                </div>
                            </td>
                            <td>Criar perspectivas</td>
                            <td className="text-right">
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean ilv-btn-block" title={Messages.get("LabelDelete")}>
                                        <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                           <td>
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelRaiseOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE316;</i>
                                    </button>
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelDropOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE313;</i>
                                    </button>
                                </div>
                           </td>
                            <td>Definir metas</td>
                            <td className="text-right">
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean ilv-btn-block" title={Messages.get("LabelDelete")}>
                                        <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                    </button>
                                </div>
                            </td>
                        </tr> 
                        <tr>
                           <td>
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelRaiseOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE316;</i>
                                    </button>
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelDropOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE313;</i>
                                    </button>
                                </div>
                           </td>
                            <td>Criar plano de ação</td>
                            <td className="text-right">
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean ilv-btn-block" title={Messages.get("LabelDelete")}>
                                        <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                           <td>
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelRaiseOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE316;</i>
                                    </button>
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelDropOneLevel")}>
                                        <i className="ilv-icon material-icons md-24">&#xE313;</i>
                                    </button>
                                </div>
                           </td>
                            <td>Desenvolver continuamente</td>
                            <td className="text-right">
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean ilv-btn-block" title={Messages.get("LabelDelete")}>
                                        <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});