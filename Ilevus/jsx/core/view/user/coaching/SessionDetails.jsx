var React = require('react');
var S = require("string");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");
var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    render() {
        return (
            <div className="container my-5">
                <div className="row">
                    <div className="col-xs-12 col-sm-8">
                        <div className="row mb-5">
                            <div className="col">
                                <div className="ilv-media">
                                    <div className="ilv-media-left mr-4">
                                        <div className="ilv-avatar-fluid ilv-avatar-fluid-xl"
                                             style={{ backgroundImage: "url(" + (S(UserIcon)) + ")" }
                                        } />
                                    </div>
                                    <div className="ilv-media-body">
                                        <h1 className="ilv-font-weight-bold">{Messages.get('LabelSession')}: 6</h1>
                                        <p className="ilv-text-large">Sessão de Coacinhg dada por <a href="#">Robert Plant</a></p>
                                    </div>
                                    <div className="ilv-media-right">
                                        <button className="ilv-btn ilv-btn-clean">
                                            <i className="ilv-icon material-icons md-24">&#xE8D0;</i>
                                        </button>
                                        <div className="dropdown" style={{display: 'inline-block'}}>
                                            <button className="ilv-btn ilv-btn-clean" data-toggle="dropdown">
                                                <i className="ilv-icon material-icons md-24">&#xE2C4;</i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item" href="#">{Messages.get("LabelDownloadSession")}</a>
                                                <a className="dropdown-item" href="#">{Messages.get("LabelDownloadAllSessions")}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mb-3"/>
                                <div className="ilv-media ilv-media-middle">
                                    <div className="ilv-media-left">
                                        <span className="ilv-font-weight-semibold">{Messages.get('LabelRelatedProcess')}:</span>
                                    </div>
                                    <div className="ilv-media-body">
                                        <a href="javascript:;">{Messages.get("LabelLinkSessionToProcessStep")}</a>
                                    </div>
                                </div>
                                <hr className="mt-3 mb-5" />
                                <div>
                                    <h4 className="ilv-font-weight-semibold my-3">{Messages.get('LabelSessionObjectives')}:</h4>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean blandit auctor sem,
                                        nec suscipit purus ultrices sit amet. Cras sed sagittis mauris. Phasellus sit amet
                                        nisi non risus elementum sollicitudin. Morbi eu libero nec urna auctor imperdiet.
                                        Nam ut congue leo. Etiam consequat eu ligula blandit convallis.
                                    </p>
                                    <a className="font-weight-bold" href="javascript:;">{Messages.get('LabelEdit')}</a>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col">
                                <h4>{Messages.get("SessionTools")}</h4>
                                <div className="ilv-card">
                                    <div className="ilv-card-body">
                                        <table className="ilv-table ilv-table-sm">
                                            <thead>
                                                <tr>
                                                    <th>{Messages.get("LabelTool")}</th>
                                                    <th className="text-right">{Messages.get("LabelActions")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Roda da vida</td>
                                                    <td className="text-right">
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE89E;</i>
                                                        </button>
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>SMART</td>
                                                    <td className="text-right">
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE89E;</i>
                                                        </button>
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <a className="font-weight-bold" href="javascript:;">{Messages.get('LabelApplyTool')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col">
                                <h4>{Messages.get("LabelMyComments")}</h4>
                                <textarea className="ilv-form-control" style={{minHeight: '200px'}}></textarea>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col">
                                <h4>{Messages.get("LabelCoachComments")}</h4>
                                <textarea className="ilv-form-control" style={{minHeight: '200px'}} readOnly>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean blandit auctor sem,
                                    nec suscipit purus ultrices sit amet. Cras sed sagittis mauris. Phasellus sit amet
                                    nisi non risus elementum sollicitudin. Morbi eu libero nec urna auctor imperdiet.
                                    Nam ut congue leo. Etiam consequat eu ligula blandit convallis. Mauris sit amet leo
                                    porta, aliquet lorem quis, ullamcorper nisi. Sed at turpis sem. Aenean et eleifend
                                    enim. Praesent congue vitae turpis non porttitor. Mauris a rutrum justo. Morbi vel
                                    risus eleifend, luctus urna quis, mollis lectus. Aliquam fermentum dapibus sodales.
                                    Morbi blandit metus nisi, quis tincidunt purus venenatis in.
                                </textarea>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="ilv-card">
                            <div className="ilv-card-header text-center">
                                <small>{Messages.get("LabelSessionDuration")}:</small>
                                <h1 className="mb-3">1:31:47</h1>
                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-destructive">{Messages.get("LabelEndSession")}</button>
                            </div>
                            <div className="ilv-card-block">
                                <table className="ilv-table mb-0">
                                    <thead>
                                        <tr style={{backgroundColor: '#f5f7f9'}}>
                                            <th className="text-center" colSpan="2"><small className="font-weight-bold">{Messages.get("TextSessionHistory")}</small></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 5</div>
                                                <small>{Messages.get('LabelDuration')}: 1:02</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 4</div>
                                                <small>{Messages.get('LabelDuration')}: 1:13</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 3</div>
                                                <small>{Messages.get('LabelDuration')}: 0:57</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 2</div>
                                                <small>{Messages.get('LabelDuration')}: 1:03</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 1</div>
                                                <small>{Messages.get('LabelDuration')}: 1:24</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-link">{Messages.get("LabelNewSession")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

