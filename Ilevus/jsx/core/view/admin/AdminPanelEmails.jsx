
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
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
            console.log(config);
        }, me);
        SystemStore.on("update-config-email", (config) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            $("button").removeAttr("disabled");
            console.log(config);
        }, me);

        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_CONFIG
        });
    },
    componentWillUnmount() {
        SystemStore.off(null, null, this);
    },

    updateTranslatedEmail(which, event) {
        event.preventDefault();
        $(this.refs[which + "-save"]).attr("disabled", "disabled");
        var data = {
            which: which,
            pt_br: {
                Subject: this.refs[which + "-pt-br-subject"].value,
                Template: this.refs[which + "-pt-br"].value
            },
            en: {
                Subject: this.refs[which + "-en-subject"].value,
                Template: this.refs[which + "-en"].value
            },
            es: {
                Subject: this.refs[which + "-es-subject"].value,
                Template: this.refs[which + "-es"].value
            }
        };

        SystemStore.dispatch({
            action: SystemStore.ACTION_UPDATE_CONFIG_EMAIL,
            data: data
        });
    },

    renderEmailForm(email, which) {
        return (<div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>
                            {Messages.get("LabelEmail"+which)}
                        </strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            <div className="row">
                                <div className="col-xs-12">

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor={which + "-pt-br-subject"}>
                                            {Messages.get("LanguagePortuguese")}
                                        </label>
                                        <input spellCheck={false}
                                               typeof="text"
                                               className="ilv-form-control m-b-1"
                                               id={which + "-pt-br-subject"}
                                               ref={which + "-pt-br-subject"}
                                               defaultValue={email.pt_br.Subject} />
                                        <textarea rows={5}
                                                  spellCheck={false}
                                                  className="ilv-form-control"
                                                  id={which + "-pt-br"}
                                                  ref={which + "-pt-br"}
                                                  defaultValue={email.pt_br.Template} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor={which + "-en-subject"}>
                                            {Messages.get("LanguageEnglish")}
                                        </label>
                                        <input spellCheck={false}
                                               typeof="text"
                                               className="ilv-form-control m-b-1"
                                               id={which + "-en-subject"}
                                               ref={which + "-en-subject"}
                                               defaultValue={email.en.Subject} />
                                        <textarea rows={5}
                                                  spellCheck={false}
                                                  className="ilv-form-control"
                                                  id={which + "-en"}
                                                  ref={which + "-en"}
                                                  defaultValue={email.en.Template} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor={which + "-es-subject"}>
                                            {Messages.get("LanguageSpanish")}
                                        </label>
                                        <input spellCheck={false}
                                               typeof="text"
                                               className="ilv-form-control m-b-1"
                                               id={which + "-es-subject"}
                                               ref={which + "-es-subject"}
                                               defaultValue={email.es.Subject} />
                                        <textarea rows={5}
                                                  spellCheck={false}
                                                  className="ilv-form-control"
                                                  id={which + "-es"}
                                                  ref={which + "-es"}
                                                  defaultValue={email.es.Template} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-primary"
                                ref={which + "-save"}
                                onClick={this.updateTranslatedEmail.bind(this, which)}>
                            {Messages.get("LabelSave")}
                        </button>
                    </div>
        </div>);
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
            {this.renderEmailForm(this.state.config.WelcomeMessages, "Welcome")}
            {this.renderEmailForm(this.state.config.EmailValidationMessages, "EmailValidation")}
            {this.renderEmailForm(this.state.config.RecoverPasswordMessages, "RecoverPassword")}
            {this.renderEmailForm(this.state.config.AccountBlockingMessages, "AccountBlocking")}
        </div>);
    }
});
