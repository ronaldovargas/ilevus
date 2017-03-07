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
                <div className="row mb-5">
                    <div className="col">
                        <div className="ilv-media">
                            <div className="ilv-media-left ilv-text-xs-center mr-3">
                                <div className="ilv-avatar-fluid ilv-avatar-fluid-public"
                                        style={{ backgroundImage: "url(" + (S(UserIcon)) + ")" }
                                } />
                            </div>
                            <div className="ilv-media-body">
                                <strong>Sessão de Coacinhg dada por <a href="#">Robert Plant</a></strong>
                                <p className="ilv-text-large ilv-font-weight-semibold">
                                    {Messages.get('LabelSession')}: 6
                                </p>
                                
                                <label className="ilv-font-weight-semibold">{Messages.get('LabelObjective')}:</label>
                                <div className="ilv-card" style={{backgroundColor: '#cfd7e6'}}>
                                    <div className="ilv-card-body">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus volutpat fermentum. Nulla et scelerisque magna, id faucibus mi.
                                    </div>
                                </div>
                                <div className="ilv-media ilv-media-middle">
                                    <div className="ilv-media-body">
                                        <button className="ilv-btn">{Messages.get("LabelRateThisSession")}</button>
                                    </div>
                                    <div className="ilv-media-right">
                                        <div className="dropdown">
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
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col">
                        <h4>{Messages.get("SessionTools")}</h4>
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col">
                        <h4>{Messages.get("LabelMyComments")}</h4>
                        <textarea
                            className="ilv-form-control"
                            style={{minHeight: '240px'}}
                            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean blandit auctor sem,
                            nec suscipit purus ultrices sit amet. Cras sed sagittis mauris. Phasellus sit amet
                            nisi non risus elementum sollicitudin. Morbi eu libero nec urna auctor imperdiet.
                            Nam ut congue leo. Etiam consequat eu ligula blandit convallis. Mauris sit amet leo
                            porta, aliquet lorem quis, ullamcorper nisi. Sed at turpis sem. Aenean et eleifend
                            enim. Praesent congue vitae turpis non porttitor. Mauris a rutrum justo. Morbi vel
                            risus eleifend, luctus urna quis, mollis lectus. Aliquam fermentum dapibus sodales.
                            Morbi blandit metus nisi, quis tincidunt purus venenatis in.">
                        </textarea>
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col">
                        <h4>{Messages.get("LabelCoachComments")}</h4>
                        <textarea
                            className="ilv-form-control"
                            style={{minHeight: '240px'}}
                            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean blandit auctor sem,
                                  nec suscipit purus ultrices sit amet. Cras sed sagittis mauris. Phasellus sit amet
                                  nisi non risus elementum sollicitudin. Morbi eu libero nec urna auctor imperdiet.
                                  Nam ut congue leo. Etiam consequat eu ligula blandit convallis. Mauris sit amet leo
                                  porta, aliquet lorem quis, ullamcorper nisi. Sed at turpis sem. Aenean et eleifend
                                  enim. Praesent congue vitae turpis non porttitor. Mauris a rutrum justo. Morbi vel
                                  risus eleifend, luctus urna quis, mollis lectus. Aliquam fermentum dapibus sodales.
                                  Morbi blandit metus nisi, quis tincidunt purus venenatis in."
                            readonly="true">
                        </textarea>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <h4>{Messages.get("TextHistory")}</h4>
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                        <div className="ilv-media-body">
                                            <strong>{Messages.get('LabelSession')}: 1</strong>
                                            <div>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus volutpat fermentum. Nulla et scelerisque magna, id faucibus mi.
                                            </div>
                                        </div>
                                        <div className="ilv-media-right">
                                            <button className="ilv-btn ilv-btn-link">{Messages.get("LabelView")}</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                        <div className="ilv-media-body">
                                            <strong>{Messages.get('LabelSession')}: 2</strong>
                                            <div>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus volutpat fermentum. Nulla et scelerisque magna, id faucibus mi.
                                            </div>
                                        </div>
                                        <div className="ilv-media-right">
                                            <button className="ilv-btn ilv-btn-link">{Messages.get("LabelView")}</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                        <div className="ilv-media-body">
                                            <strong>{Messages.get('LabelSession')}: 3</strong>
                                            <div>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus volutpat fermentum. Nulla et scelerisque magna, id faucibus mi.
                                            </div>
                                        </div>
                                        <div className="ilv-media-right">
                                            <button className="ilv-btn ilv-btn-link">{Messages.get("LabelView")}</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                        <div className="ilv-media-body">
                                            <strong>{Messages.get('LabelSession')}: 4</strong>
                                            <div>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus volutpat fermentum. Nulla et scelerisque magna, id faucibus mi.
                                            </div>
                                        </div>
                                        <div className="ilv-media-right">
                                            <button className="ilv-btn ilv-btn-link">{Messages.get("LabelView")}</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                        <div className="ilv-media-body">
                                            <strong>{Messages.get('LabelSession')}: 5</strong>
                                            <div>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempus volutpat fermentum. Nulla et scelerisque magna, id faucibus mi.
                                            </div>
                                        </div>
                                        <div className="ilv-media-right">
                                            <button className="ilv-btn ilv-btn-link">{Messages.get("LabelView")}</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

