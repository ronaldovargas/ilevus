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

            jQuery("#CostPerClick-pt-br, #CostPerView-pt-br").maskMoney({ thousands: ".", decimal: ",", prefix: "R$ ", allowZero: true });
            jQuery("#CostPerClick-pt-br, #CostPerView-pt-br").trigger('mask.maskMoney');

            jQuery("#CostPerClick-en, #CostPerView-en").maskMoney({ thousands: ",", decimal: ".", prefix: "$ ", allowZero: true });
            jQuery("#CostPerClick-en, #CostPerView-en").trigger('mask.maskMoney');

            jQuery("#CostPerClick-es, #CostPerView-es").maskMoney({ thousands: ".", decimal: ",", suffix: " €", allowZero: true });
            jQuery("#CostPerClick-es, #CostPerView-es").trigger('mask.maskMoney');

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
                UrlRetriviedAds: this.refs['UrlRetriviedAds'].value,
                AdsMaxSize: this.refs['AdsMaxSize'].value,
                pt_br: {
                    CostPerClick: this.refs["CostPerClick-pt-br"].value,
                    CostPerView: this.refs["CostPerView-pt-br"].value
                },
                en: {
                    CostPerClick: this.refs["CostPerClick-en"].value,
                    CostPerView: this.refs["CostPerView-en"].value
                },
                es: {
                    CostPerClick: this.refs["CostPerClick-es"].value,
                    CostPerView: this.refs["CostPerView-es"].value
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

                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelAdsUrlRetrivied")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="UrlRetriviedAds" defaultValue={JSON.parse(this.state.config.definitions).UrlRetriviedAds} />
                        </div>

                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelAdsMaxSize")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="AdsMaxSize" defaultValue={JSON.parse(this.state.config.definitions).AdsMaxSize} />
                        </div>

                        
                        <div className="ilv-form-group" id={"cost-container"}>

                            <ul className="ilv-text-sm nav nav-tabs m-b-1">
                                <li className="nav-item">
                                    <a className="nav-link active" data-toggle="tab" href={"#cost-pt-br-form" }>{Messages.get("LanguagePortuguese")}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href={"#cost-en-form" }>{Messages.get("LanguageEnglish")}
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" data-toggle="tab" href={"#cost-es-form" }>{Messages.get("LanguageSpanish")}
                                    </a>
                                </li>
                            </ul>

                            <div className="tab-content">

                                <div className="tab-pane active in" id={"cost-pt-br-form" }>
                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelAdsCostPerClick")}</label>
                                        <input className="ilv-form-control" type="text" spellCheck={false} id="CostPerClick-pt-br" ref="CostPerClick-pt-br" defaultValue={parseFloat(JSON.parse(this.state.config.definitions).CostPerClick_pt_br).toFixed(2)} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelAdsCostPerView")}</label>
                                        <input className="ilv-form-control" type="text" spellCheck={false} id="CostPerView-pt-br" ref="CostPerView-pt-br" defaultValue={parseFloat(JSON.parse(this.state.config.definitions).CostPerView_pt_br).toFixed(2)} />
                                    </div>
                                </div>

                                <div className="tab-pane" id={"cost-en-form" }>
                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelAdsCostPerClick")}</label>
                                        <input className="ilv-form-control" type="text" spellCheck={false} id="CostPerClick-en" ref="CostPerClick-en" defaultValue={parseFloat(JSON.parse(this.state.config.definitions).CostPerClick_en).toFixed(2)} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelAdsCostPerView")}</label>
                                        <input className="ilv-form-control" type="text" spellCheck={false} id="CostPerView-en" ref="CostPerView-en" defaultValue={parseFloat(JSON.parse(this.state.config.definitions).CostPerView_en).toFixed(2)} />
                                    </div>
                                </div>

                                <div className="tab-pane" id={"cost-es-form" }>
                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelAdsCostPerClick")}</label>
                                        <input className="ilv-form-control" type="text" spellCheck={false} id="CostPerClick-es" ref="CostPerClick-es" defaultValue={parseFloat(JSON.parse(this.state.config.definitions).CostPerClick_es).toFixed(2)} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelAdsCostPerView")}</label>
                                        <input className="ilv-form-control" type="text" spellCheck={false} id="CostPerView-es" ref="CostPerView-es" defaultValue={parseFloat(JSON.parse(this.state.config.definitions).CostPerView_es).toFixed(2)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                        <button type="submit" className="ilv-btn ilv-btn-success">{Messages.get("LabelSave")}</button>
                    </form>
                </div>
            </div>
        </div>);
    }
});

