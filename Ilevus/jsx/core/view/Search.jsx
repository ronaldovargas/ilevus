
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
                var industry = S(model.Professional.Professional.Industry);
                var headline = S(model.Professional.Professional.Headline);
                return (
                    <div className="p-y-1" style={{ borderBottom: "1px solid #eee" }} key={"search-result-"+index}>
                        <div className="ilv-media" key={"result-"+index}>
                            <div className="ilv-media-left ilv-text-xs-center m-r-1">
                                <div className="ilv-avatar-fluid ilv-avatar-fluid-xl"
                                    style={{ backgroundImage: "url(" + (S(model.Image).isEmpty() ? UserIcon : model.Image) + ")" }} />
                            </div>
                            <div className="ilv-media-body" style={{borderRight: "1px solid #eee"}}>
                                <div style={{marginBottom: ".25rem"}}>
                                    <Link to={"/profile/"+model.Id}><strong>{model.Name} {model.Surname}</strong></Link>
                                </div>
                                <div>
                                    <p className="ilv-text-small">
                                        <span className="ilv-tag ilv-tag-warning m-l-0">Premium</span>
                                        { industry.isEmpty() ? "" : industry.s }
                                    </p>
                                    <span className="ilv-tag ilv-tag-success m-l-0">4.9 <sup>/ 5.0</sup></span>
                                    <a className="small" href="">{Messages.format("TextEvaluations", [32])}</a>
                                </div>
                            </div>
                            <div className="ilv-media-right ilv-text-small" style={{minWidth: "12rem"}}>
                                <p style={{marginBottom: ".25rem"}}><a href=""><i className="ilv-icon m-r-1 material-icons md-18">&#xE878;</i>{Messages.get("ActionRequestMeeting")}</a></p>
                                <p style={{marginBottom: ".25rem"}}><a href=""><i className="ilv-icon m-r-1 material-icons md-18">&#xE0BE;</i>{Messages.get("ActionSendMessage")}</a></p>
                                <p style={{marginBottom: ".25rem"}}><a href=""><i className="ilv-icon m-r-1 material-icons md-18">&#xE0B0;</i>{Messages.get("ActionRequestPhone")}</a></p>
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
                                        <div className="ilv-media ilv-media-middle p-b-1 m-b-1">
                                            <div className="ilv-media-body">
                                                <h1 className="h3 m-a-0">{this.state.term}</h1>
                                                <span className="ilv-text-small">{Messages.format("TextSearchNumberOfResults", [this.state.total, this.state.term])}</span>
                                            </div>
                                            <div className="ilv-media-right">
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

                                        {this.renderModels()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
