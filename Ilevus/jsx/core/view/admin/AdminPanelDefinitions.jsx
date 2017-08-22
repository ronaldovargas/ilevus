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
        SystemStore.on("retrieve-definition-config", (config) => {
            me.setState({
                loading: false,
                config: config
            });
        }, me);
        SystemStore.on("update-system-definition", (config) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            $("button").removeAttr("disabled");
        }, me);
        SystemStore.on("fail", (msg) => {
            $("button").removeAttr("disabled");
        }, me);

        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_DEFINITIONS
        });
    },
    componentWillUnmount() {
        SystemStore.off(null, null, this);
    },

    saveApiConfigs(event) {
        event.preventDefault();

        SystemStore.dispatch({
            action: SystemStore.ACTION_UPDATE_DEFINITIONS,
            data: {
                PathAds: this.refs['PathAds'].value,
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
                        {Messages.get("LabelDefinitions")}
                    </strong>
                </div>
                <div className="ilv-card-body">
                    <form onSubmit={this.saveApiConfigs}>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelAdsBasePathUrl")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="PathAds" defaultValue={JSON.parse(this.state.config.definitions).PathAds} />
                        </div>
                        
                        <button type="submit" className="ilv-btn ilv-btn-success">{Messages.get("LabelSave")}</button>
                    </form>
                </div>
            </div>
        </div>);
    }
});

