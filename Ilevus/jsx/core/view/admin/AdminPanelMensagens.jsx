var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var URL = BACKEND_URL+"User";

module.exports = React.createClass({
    url: URL,
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true
        };
    },
    componentDidMount() {
        var me = this;
        SystemStore.on("retrieve-config", (config) => {
            me.setState({
                loading: false,
                config: config
            });
        }, me);
        SystemStore.on("update-config-apis", (config) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            $("button").removeAttr("disabled");
        }, me);
        SystemStore.on("fail", (msg) => {
            $("button").removeAttr("disabled");
        }, me);

        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_CONFIG
        });
    },
    componentWillUnmount() {
        SystemStore.off(null, null, this);
    },

    saveApiConfigs(event) {
        event.preventDefault();

        SystemStore.dispatch({
            action: SystemStore.ACTION_UPDATE_CONFIG_APIS,
            data: {
                MoipBaseUrl: this.refs['MoipBaseUrl'].value,
                MoipToken: this.refs['MoipToken'].value,
                MoipKey: this.refs['MoipKey'].value,
                MoipSubscriptionKey: this.refs['MoipSubscriptionKey'].value,
                MoipSubscriptionCode: this.refs['MoipSubscriptionCode'].value,
                MoipCryptoPublicKey: this.refs['MoipCryptoPublicKey'].value,
            }
        });
    },

    enviarMensagem(sender) {
        UserSession.dispatch({
            action: UserSession.ACTION_SEND_SYSTEM_NOTIFICATIONS,
            data: {
                email: this.refs['notif-email-teste'].value,
                pt: {
                    assunto: this.refs['notif-pt-br-subject'].value,
                    mensagem: this.refs['notif-pt-br'].value
                },
                en: {
                    assunto: this.refs['notif-en-subject'].value,
                    mensagem: this.refs['notif-en'].value
                },
                es: {
                    assunto: this.refs['notif-es-subject'].value,
                    mensagem: this.refs['notif-es'].value
                }
            }
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }



return (<div>

<div className="ilv-card">

<div className="ilv-card-body" id={"notif" + "-container"}>
                    <ul className="ilv-text-sm nav nav-tabs m-b-1">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href={"#" + "notif" + "-pt-br-form" }>{Messages.get("LanguagePortuguese")}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href={"#" + "notif" + "-en-form" }>{Messages.get("LanguageEnglish")}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href={"#" + "notif" + "-es-form" }>{Messages.get("LanguageSpanish")}
                            </a>
                        </li>
                    </ul>

                    <form className="tab-content">
                        <div className="tab-pane fade active in" id={"notif" + "-pt-br-form" }>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={"notif" + "-pt-br-subject"}>{Messages.get("LabelSubject")}
                                </label>
                                <input spellCheck={false}
                                       typeof="text"
                                       className="ilv-form-control"
                                       id={"notif" + "-pt-br-subject"}
                                       ref={"notif" + "-pt-br-subject"} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={"notif" + "-pt-br"}>{Messages.get("LabelMessage")}
                                </label>
                                <textarea rows={5}
                                          spellCheck={false}
                                          className="ilv-form-control"
                                          id={"notif" + "-pt-br"}
                                          ref={"notif" + "-pt-br"} />
                            </div>
                        </div>

                        <div className="tab-pane fade" id={"notif" + "-en-form" }>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={"notif" + "-en-subject"}>{Messages.get("LabelSubject")}
                                </label>
                                <input spellCheck={false}
                                       typeof="text"
                                       className="ilv-form-control"
                                       id={"notif" + "-en-subject"}
                                       ref={"notif" + "-en-subject"} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={"notif" + "-en"}>{Messages.get("LabelMessage")}
                                </label>
                                <textarea rows={5}
                                          spellCheck={false}
                                          className="ilv-form-control"
                                          id={"notif" + "-en"}
                                          ref={"notif" + "-en"} />
                            </div>
                        </div>

                        <div className="tab-pane fade" id={"notif" + "-es-form" }>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={"notif" + "-es-subject"}>{Messages.get("LabelSubject")}
                                </label>
                                <input spellCheck={false}
                                       typeof="text"
                                       className="ilv-form-control"
                                       id={"notif" + "-es-subject"}
                                       ref={"notif" + "-es-subject"} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={"notif" + "-es"}>{Messages.get("LabelMessage")}
                                </label>
                                <textarea rows={5}
                                          spellCheck={false}
                                          className="ilv-form-control"
                                          id={"notif" + "-es"}
                                          ref={"notif" + "-es"} />
                            </div>
                        </div>
                    </form>


    <label className="ilv-form-label" htmlFor={"notif-email-teste"}>{Messages.get("LabelEmailTeste")}
    </label>
                                <input spellCheck={false}
                                       typeof="email"
                                       className="ilv-form-control"
                                       id={"notif-email-teste"}
                                       ref={"notif-email-teste"} />

                    <button className="ilv-btn ilv-btn-primary"
                            ref={"notif" + "-save"}
                            onClick={this.enviarMensagem.bind(this)}>{Messages.get("LabelEnviar")}
                    </button>
                        
</div>
</div>

</div>





        );
    }
});
