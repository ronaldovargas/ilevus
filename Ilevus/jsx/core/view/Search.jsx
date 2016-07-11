
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    getInitialState() {
        return {
            models: null,
            term: null,
            total: 0
        };
    },
    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("search", (response) => {
            me.setState({
                models: response.data,
                term: me.props.params.term,
                total: response.total
            });
        }, me);

        UserStore.dispatch({
            action: UserStore.ACTION_SEARCH,
            data: {
                keywords: me.props.params.term
            }
        });
    },
    componentWillUnmount() {
        UserStore.off(null, null, this);
    },
    componentWillReceiveProps(newProps) {
        UserStore.dispatch({
            action: UserStore.ACTION_SEARCH,
            data: {
                keywords: newProps.params.term
            }
        });
    },
    componentDidUpdate() {
        /*$('[data-toggle="tooltip"]').tooltip({
            animation: true
        });*/
    },

    renderModels() {
        if (!(this.state.models.length > 0)) {
            return (
                <div className="ilv-blankslate ilv-blankslate-lg">
                    <h3>{Messages.get("TextUserNotFound")}</h3>
                    <p>{Messages.get("TextSearchVerifyTerms")}</p>
                </div>
            );
        }

        return <div>
            {this.state.models.map((model, index) => {

                var industry = S(model.Industry);
                var headline = S(model.Headline);
                return (
                    <div className="ilv-card" key={"search-result-"+index}>
                        <div className="ilv-card-body" key={"result-"+index}>
                            <div className="ilv-media">
                                <div className="ilv-media-left ilv-text-xs-center">
                                    <span className="ilv-avatar ilv-avatar-xl">
                                        <img src={model.Image} alt={model.Name} />
                                    </span>
                                </div>
                                <div className="ilv-media-body">
                                    <div>
                                        <Link to={"/profile/"+model.Id}><strong>{model.Name} {model.Surname}</strong></Link>
                                        <span className="ilv-tag ilv-tag-warning">Premium</span>
                                    </div>
                                    <div>
                                        {industry.isEmpty() ? "":<p className="ilv-text-small">{industry.s}</p>}
                                        <span className="ilv-tag ilv-tag-success m-l-0">4.9 <sup>/ 5.0</sup></span>
                                        <a className="small" href="">{Messages.format("TextEvaluations", [32])}</a>
                                        <div className="ilv-btn-group m-l-1">
                                            <button className="ilv-btn ilv-btn-sm ilv-btn-clean">{Messages.get("LabelSave")}</button>
                                            <button className="ilv-btn ilv-btn-sm ilv-btn-clean">{Messages.get("LabelShare")}</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="ilv-media-right ilv-text-xs-center">
                                    <div className="ilv-btn-group">
                                        <button className="ilv-btn ilv-btn-sm" data-toggle="tooltip" title={Messages.get("ActionRequestMeeting")}>R</button>
                                        <button className="ilv-btn ilv-btn-sm" data-toggle="tooltip" title={Messages.get("ActionSendMessage")}>M</button>
                                        <button className="ilv-btn ilv-btn-sm" data-toggle="tooltip" title={Messages.get("ActionRequestPhone")}>T</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>;
    },

    render() {
        if (!this.state.models) {
            return <LoadingGauge />;
        }

        return (
            <div>
                <div className="m-t-2" role="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="ilv-card">
                                    <div className="ilv-card-body">
                                        <h1 className="h3 m-a-0">{this.state.term}</h1>
                                        <span className="ilv-text-small">{Messages.format("TextSearchNumberOfResults", [this.state.total, this.state.term])}</span>
                                    </div>
                                    <div className="ilv-card-footer">
                                        <form className="ilv-form-inline">
                                            <fieldset className="ilv-form-group">
                                                <select className="ilv-form-control ilv-form-control-sm">
                                                    <option>{Messages.get("LabelLocalization")}</option>
                                                </select>
                                            </fieldset>
                                            <fieldset className="ilv-form-group">
                                                <select className="ilv-form-control ilv-form-control-sm">
                                                <option>{Messages.get("LabelExpertise")}</option>
                                                </select>
                                            </fieldset>
                                            <fieldset className="ilv-form-group">
                                                <div className="ilv-checkbox">
                                                    <label htmlFor="filter-online">
                                                        <input className="ilv-control-input" type="checkbox" id="filter-online" ref="stayconnected" />
                                                        <span className="ilv-control-indicator"></span>
                                                        <span className="ilv-control-label">{Messages.get("LabelMeetsOnline")}</span>
                                                    </label>
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-md-9">
                            {this.renderModels()}
                            <div className="hidden">
                                <div style={{width: '100%', padding: '50px 0', textAlign: 'center', backgroundColor: '#eee', borderRadius: '2px', marginBottom: '1rem'}}>
                                    <h2 className="font-weight-bold">{Messages.get("LabelAd")}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-3">
                            <div style={{width: '100%', height: '400px', backgroundColor: '#eee', borderRadius: '2px', marginBottom: '1rem'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
