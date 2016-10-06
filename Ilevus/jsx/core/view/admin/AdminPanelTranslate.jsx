﻿
var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

function filterNew(value) {
    return value[1] && value[1].New;
}

function filterNotReviewed(value) {
    return value[1] && !value[1].New && !value[1].Reviewed;
}

function filterAll(value) {
    return value[1] && (!value[1].New) && value[1].Reviewed;
}

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            lang: "ptBR",
            editKey: null
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
                editKey: null,
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
            $("button").removeAttr("disabled");
        }, me);

        SystemStore.on("update-translation", () => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            me.refreshMessages();
        }, me);

        SystemStore.on("add-translation-key", () => {
            me.refreshMessages();
        }, me);

        SystemStore.on("fail", (msg) => {
            $("button").removeAttr("disabled");
            $(me.refs["save-btn"]).removeAttr("disabled");
        }, me);

        me.refreshMessages();
    },
    componentWillUnmount() {
        SystemStore.off(null, null, this);
    },

    refreshMessages() {
        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_MESSAGES
        });
    },

    changeLanguage(lang, event) {
        event && event.preventDefault();
        this.setState({
            lang: lang
        });
    },

    addTranslationKey(event) {
        event && event.preventDefault();
        $(this.refs['add-btn']).attr("disabled", "disabled");
        SystemStore.dispatch({
            action: SystemStore.ACTION_ADD_TRANSLATION_KEY,
            data: "--New--"
        });
    },

    tweakEditing(key, event) {
        event && event.preventDefault();
        this.setState({
            editKey: key
        });
    },

    saveMessage(event) {
        event && event.preventDefault();
        $(this.refs["save-btn"]).attr("disabled", "disabled");
        SystemStore.dispatch({
            action: SystemStore.ACTION_UPDATE_TRANSLATION,
            data: {
                OldKey: this.state.editKey,
                Key: this.refs['key-input-' + this.state.editKey].value,
                Content: this.refs['content-input-' + this.state.editKey].value,
                Lang: this.state.lang
            }
        });
    },

    onKeyUp(event) {
        if (event.key == "Enter") {
            this.saveMessage(event);
        } else if (event.key == "Escape") {
            this.setState({
                editKey: null
            });
        }
    },



    renderEditInput(ref, defaultValue) {
        return <input onKeyUp={this.onKeyUp}
                      type="text"
                      className="ilv-form-control"
                      defaultValue={defaultValue}
                      ref={ref} />;
    },

    renderTable(messages) {
        return <table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
            <thead>
                <tr>
                    <th>{Messages.get("LabelKey")}</th>
                    <th>{Messages.get("LabelContent")}</th>
                    <th className="ilv-text-xs-right">{Messages.get("LabelStatus")}</th>
                </tr>
            </thead>
            <tbody>
                {messages.map((msg, index) => {
                    return (msg[0] == this.state.editKey ? <tr key={'label-'+index}>
                        <td>{this.renderEditInput('key-input-' + msg[0], msg[0])}</td>
                        <td>{this.renderEditInput('content-input-' + msg[0], msg[1].Content)}</td>
                        <td className="ilv-text-xs-right">
                            <a onClick={this.saveMessage} ref="save-btn">
                                <i className="material-icons ilv-text-success" title={Messages.get("LabelSave")}>&#xE876;</i>
                            </a> <a onClick={this.tweakEditing.bind(this, null)}>
                                <i className="material-icons ilv-text-danger" title={Messages.get("ActionCancel")}>&#xE5CD;</i>
                            </a>
                        </td>
                    </tr>
                    :
                    <tr key={'label-' + index}>
                        <td>
                            <a title={Messages.get("LabelActions")} className="hidden">
                                <i class="material-icons">&#xE313;</i>
                            </a> <span onClick={this.tweakEditing.bind(this, msg[0])}>
                                {msg[0]}
                            </span>
                        </td>
                        <td>
                            <span onClick={this.tweakEditing.bind(this, msg[0])}>{msg[1].Content}</span>
                        </td>
                        <td className="ilv-text-xs-right">{msg[1].New ? "":(
                            msg[1].Reviewed ?
                                <i className="material-icons ilv-text-info">&#xE877;</i>
                                :
                                <i className="material-icons">&#xE876;</i>
                        )}</td>
                    </tr>);
                })}
            </tbody>
        </table>;
    },

    renderMessages(messages) {
        return <div className="ilv-media-list">
        {messages.New.length > 0 ?
            <div className="ilv-media">
                <div className="ilv-media-body">
                    <h4>{Messages.get("LabelNew")}</h4>
                    <hr />
                    {this.renderTable(messages.New)}
                </div>
            </div>
        :""}
        {messages.NotReviewed.length > 0 ?
            <div className="ilv-media">
                <div className="ilv-media-body">
                    <h4>{Messages.get("LabelNotReviewed")}</h4>
                    <hr />
                    {this.renderTable(messages.NotReviewed)}
                </div>
            </div>
        :""}
            <div className="ilv-media">
                <div className="ilv-media-body">
                    <h4>{Messages.get("LabelReviewed")}</h4>
                    <hr />
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
                        <div className="ilv-media ilv-media-middle">
                            <div className="ilv-media-body">
                                <strong>{Messages.get("LabelTranslations")}</strong>
                            </div>
                            <div className="ilv-media-right">
                                <button className="ilv-btn ilv-btn-primary" onClick={this.addTranslationKey} ref='add-btn'>
                                    {Messages.get("LabelAddNewMessage")}
                                </button>
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