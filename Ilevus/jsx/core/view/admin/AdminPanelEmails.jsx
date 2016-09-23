
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
        }, me);
        SystemStore.on("update-config-email", (config) => {
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
        return (
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <div className="ilv-media ilv-media-middle">
                        <div className="ilv-media-body">
                            <strong>{Messages.get("LabelEmail" + which)}</strong>
                        </div>
                        <div className="ilv-media-right">
                            <button className="ilv-btn ilv-btn-link" data-toggle="collapse" href={"#" + which + "-container" }>
                                {Messages.get("ActionEdit")}    
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ilv-card-body collapse" id={which + "-container"}>
                    <ul className="ilv-text-sm nav nav-tabs m-b-1">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href={"#" + which + "-pt-br-form" }>
                                {Messages.get("LanguagePortuguese")}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href={"#" + which + "-en-form" }>
                                {Messages.get("LanguageEnglish")}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href={"#" + which + "-es-form" }>
                                {Messages.get("LanguageSpanish")}
                            </a>
                        </li>
                    </ul>

                    <form className="tab-content">         
                        <div className="tab-pane fade active in" id={which + "-pt-br-form" }>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={which + "-pt-br-subject"}>
                                    {Messages.get("LabelSubject")}
                                </label>
                                <input spellCheck={false}
                                       typeof="text"
                                       className="ilv-form-control"
                                       id={which + "-pt-br-subject"}
                                       ref={which + "-pt-br-subject"}
                                       defaultValue={email.pt_br.Subject} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={which + "-pt-br"}>
                                    {Messages.get("LabelMessage")}
                                </label>
                                <textarea rows={5}
                                          spellCheck={false}
                                          className="ilv-form-control"
                                          id={which + "-pt-br"}
                                          ref={which + "-pt-br"}
                                          defaultValue={email.pt_br.Template} />
                            </div>
                        </div>

                        <div className="tab-pane fade" id={which + "-en-form" }>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={which + "-en-subject"}>
                                    {Messages.get("LabelSubject")}
                                </label>
                                <input spellCheck={false}
                                       typeof="text"
                                       className="ilv-form-control"
                                       id={which + "-en-subject"}
                                       ref={which + "-en-subject"}
                                       defaultValue={email.en.Subject} />
                            </div>
                            
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={which + "-en"}>
                                    {Messages.get("LabelMessage")}
                                </label>
                                <textarea rows={5}
                                        spellCheck={false}
                                        className="ilv-form-control"
                                        id={which + "-en"}
                                        ref={which + "-en"}
                                        defaultValue={email.en.Template} />
                            </div>
                        </div>

                        <div className="tab-pane fade" id={which + "-es-form" }>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={which + "-es-subject"}>
                                    {Messages.get("LabelSubject")}
                                </label>
                                <input spellCheck={false}
                                       typeof="text"
                                       className="ilv-form-control"
                                       id={which + "-es-subject"}
                                       ref={which + "-es-subject"}
                                       defaultValue={email.es.Subject} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor={which + "-es"}>
                                    {Messages.get("LabelMessage")}
                                </label>
                                <textarea rows={5}
                                          spellCheck={false}
                                          className="ilv-form-control"
                                          id={which + "-es"}
                                          ref={which + "-es"}
                                          defaultValue={email.es.Template} />
                            </div>
                        </div>
                    </form>
                
                    <button className="ilv-btn ilv-btn-primary"
                            ref={which + "-save"}
                            onClick={this.updateTranslatedEmail.bind(this, which)}>
                        {Messages.get("LabelSave")}
                    </button>
                    <button className="ilv-btn ilv-btn-clean" data-toggle="collapse" href={"#" + which + "-container" }>
                        {Messages.get("ActionCancel")}
                    </button>
                </div>
            </div>
        );
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <strong>
                        {Messages.get("LabelInstructions")}
                    </strong>
                </div>
                <div className="ilv-card-body">
                    <p>{Messages.get("TextAdminConfigEmailHelp")}</p>
                    <ul>
                        <li>
                            <code>{"{0}"}</code> - {Messages.get("TextAdminConfigEmailHelpNameItem")}
                        </li>
                        <li>
                            <code>{"{1}"}</code> - {Messages.get("TextAdminConfigEmailHelpLinkItem")}
                        </li>
                    </ul>
                </div>
            </div>
            {this.renderEmailForm(this.state.config.WelcomeMessages, "Welcome")}
            {this.renderEmailForm(this.state.config.EmailValidationMessages, "EmailValidation")}
            {this.renderEmailForm(this.state.config.RecoverPasswordMessages, "RecoverPassword")}
            {this.renderEmailForm(this.state.config.AccountBlockingMessages, "AccountBlocking")}
        </div>);
    }
});
