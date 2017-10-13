
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

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <strong>
                        {Messages.get("LabelMoipConfiguration")}
                    </strong>
                </div>
                <div className="ilv-card-body">
                    <form onSubmit={this.saveApiConfigs}>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelMoipBaseUrl")}</label>
                            <input className="ilv-form-control" type="url" spellCheck={false} ref="MoipBaseUrl" defaultValue={this.state.config.MoipBaseUrl} />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelMoipToken")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="MoipToken" defaultValue={this.state.config.MoipToken} />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelMoipKey")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="MoipKey" defaultValue={this.state.config.MoipKey} />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelMoipSubscriptionKey")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="MoipSubscriptionKey" defaultValue={this.state.config.MoipSubscriptionKey} />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelMoipSubscriptionCode")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="MoipSubscriptionCode" defaultValue={this.state.config.MoipSubscriptionCode} />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelMoipCryptoPublicKey")}</label>
                            <textarea className="ilv-form-control" spellCheck={false} ref="MoipCryptoPublicKey" defaultValue={this.state.config.MoipCryptoPublicKey} />
                        </div>
                        <button type="submit" className="ilv-btn ilv-btn-success">{Messages.get("LabelSave")}</button>
                    </form>
                </div>
            </div>
        </div>);
    }
});
