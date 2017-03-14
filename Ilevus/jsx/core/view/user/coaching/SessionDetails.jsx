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
                            <div className="ilv-media-left mr-4">
                                <div className="ilv-avatar-fluid ilv-avatar-fluid-xl"
                                     style={{ backgroundImage: "url(" + (S(UserIcon)) + ")" }
                                } />
                            </div>
                            <div className="ilv-media-body">
                                <h1 className="ilv-font-weight-bold">{Messages.get('LabelSession')}: 6</h1>
                                <p className="ilv-text-large">Sessão de Coacinhg dada por <a href="#">Robert Plant</a></p>
                                <div className="dropdown hidden">
                                    <button className="ilv-btn ilv-btn-neutral" data-toggle="dropdown">
                                        <i className="ilv-icon material-icons md-24">&#xE2C4;</i> {Messages.get("LabelDownloadSession")}
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <a className="dropdown-item" href="#">{Messages.get("LabelDownloadSession")}</a>
                                        <a className="dropdown-item" href="#">{Messages.get("LabelDownloadAllSessions")}</a>
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-media-right">
                                <small>{Messages.get("LabelSessionDuration")}:</small>
                                <h2 className="ma-0" style={{fontWeight: 'bold'}}>1:31:47</h2>
                            </div>
                        </div>
                        <hr className="mb-5"/>
                        <div>
                            <h3 className="ilv-font-weight-semibold my-3">{Messages.get('LabelSessionObjectives')}:</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean blandit auctor sem,
                                nec suscipit purus ultrices sit amet. Cras sed sagittis mauris. Phasellus sit amet
                                nisi non risus elementum sollicitudin. Morbi eu libero nec urna auctor imperdiet.
                                Nam ut congue leo. Etiam consequat eu ligula blandit convallis.
                            </p>
                            <div>
                                <button className="ilv-btn ilv-btn-destructive">{Messages.get("LabelEndSession")}</button>
                                <button className="ilv-btn ilv-btn-primary">{Messages.get("LabelNewSession")}</button>
                                <button className="ilv-btn ilv-btn-primary">{Messages.get("LabelRateThisSession")}</button>
                            </div>
                        </div>
                        <hr className="mt-5" />
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
                            readOnly>
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

