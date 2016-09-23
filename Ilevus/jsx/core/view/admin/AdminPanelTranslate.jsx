
var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

function filterNew(value) {
    return value[1].New;
}

function filterNotReviewed(value) {
    return !value[1].Reviewed;
}

function filterAll(value) {
    return (!value[1].New) && value[1].Reviewed;
}

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            lang: "ptBR"
        };
    },
    componentDidMount() {
        var me = this;
        SystemStore.on("retrieve-messages", (messages) => {
            var ptBR = _.sortBy(_.pairs(messages['pt-br'].Messages), (msg) => { return msg[0] });
            var en = _.sortBy(_.pairs(messages['en'].Messages), (msg) => { return msg[0] });
            var es = _.sortBy(_.pairs(messages['es'].Messages), (msg) => { return msg[0] });
            me.setState({
                loading: false,
                raw: messages,
                ptBR: {
                    New: _.filter(ptBR, filterNew),
                    NotReviewed: _.filter(ptBR, filterNotReviewed),
                    All: _.filter(ptBR, filterAll)
                },
                en: {
                    New: _.filter(en, filterNew),
                    NotReviewed: _.filter(en, filterNotReviewed),
                    All: _.filter(en, filterAll)
                },
                es: {
                    New: _.filter(es, filterNew),
                    NotReviewed: _.filter(es, filterNotReviewed),
                    All: _.filter(es, filterAll)
                }
            });
        }, me);
        SystemStore.on("update-messages", (config) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            $("button").removeAttr("disabled");
        }, me);
        SystemStore.on("fail", (msg) => {
            $("button").removeAttr("disabled");
        }, me);

        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_MESSAGES
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

    changeLanguage(lang, event) {
        event && event.preventDefault();
        this.setState({
            lang: lang
        });
    },

    renderTable(messages) {
        return <table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
            <thead>
                <tr>
                    <th>{Messages.get("LabelKey")}</th>
                    <th>{Messages.get("LabelContent")}</th>
                    <th>{Messages.get("LabelStatus")}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>LabelName</td>
                    <td>Nome</td>
                    <td><i className="material-icons">&#xE876;</i></td>
                </tr>
                {messages.map((msg, index) => {
                    return <tr key={'label-'+index}>
                        <td>{msg[0]}</td>
                        <td>{msg[1].Content}</td>
                        <td>{msg[1].New ? "":(
                            msg[1].Revised ?
                                <i className="material-icons">&#xE877;</i>
                                :
                                <i className="material-icons">&#xE876;</i>
                        )}</td>
                    </tr>;
                })}
            </tbody>
        </table>;
    },

    renderMessages(messages) {
        return <div className="ilv-media-list">
        {messages.New.length > 0 ?
            <div className="ilv-media">
                <div className="ilv-media-body">
                    <h3>{Messages.get("LabelNew")}</h3>
                    {this.renderTable(messages.New)}
                </div>
            </div>
        :""}
        {messages.NotReviewed.length > 0 ?
            <div className="ilv-media">
                <div className="ilv-media-body">
                    <h3>{Messages.get("LabelNotReviewed")}</h3>
                    {this.renderTable(messages.NotReviewed)}
                </div>
            </div>
        :""}
            <div className="ilv-media">
                <div className="ilv-media-body">
                    <h3>{Messages.get("LabelReviewed")}</h3>
                    {this.renderTable(messages.All)}
                </div>
            </div>
        </div>;
    },

    render () {
        if (this.state.loading)
            return <LoadingGauge />;
        return (
            <div>
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <div className="ilv-media">
                            <div className="ilv-media-body">
                                <h1>{Messages.get("LabelTranslations")}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="ilv-card-body">
                        <ul className="ilv-text-sm nav nav-tabs m-b-1">
                            <li className="nav-item">
                                <a className={"nav-link" + (this.state.lang == 'ptBR' ? " active" : "")}
                                   onClick={this.changeLanguage.bind(this, "ptBR")}>
                                    {Messages.get("LanguagePortuguese")}
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={"nav-link"+(this.state.lang == 'en' ? " active":"")}
                                   onClick={this.changeLanguage.bind(this, "en")}>
                                    {Messages.get("LanguageEnglish")}
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className={"nav-link"+(this.state.lang == 'es' ? " active":"")}
                                   onClick={this.changeLanguage.bind(this, "es")}>
                                    {Messages.get("LanguageSpanish")}
                                </a>
                            </li>
                        </ul>

                        <div className="tab-content">
                            <div className="tab-pane fade active in">
                                {this.renderMessages(this.state[this.state.lang])}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        );
    }
});