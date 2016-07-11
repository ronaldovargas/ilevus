
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var Marked = require("marked");
var React = require("react");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            model: null
        };
    },
    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("retrieve", (model) => {
            me.setState({
                model: model
            });
        }, me);

        UserStore.dispatch({
            action: UserStore.ACTION_RETRIEVE,
            data: this.props.params.id
        });
    },
    componentWillUnmount() {
        UserStore.off(null, null, this);
    },
    componentDidUpdate() {
        /*$('[data-toggle="tooltip"]').tooltip({
            animation: true
        });*/
    },

    render() {
        if (!this.state.model) {
            return <LoadingGauge />;
        }

        var user = this.state.model;
        var userLocation = user.get("Country");
        if (user.get("County")) {
            userLocation = user.get("County") + ", " + userLocation;
        }
        if (user.get("City")) {
            userLocation = user.get("City") + ", " + userLocation;
        }
        userLocation = S(userLocation);
        var industry = S(user.get("Industry"));
        var headline = S(user.get("Headline"));
        var summary = S(user.get("Summary"));
        var specialties = S(user.get("Specialties"));

        return (<div className="m-y-3" role="banner">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                    <div className="ilv-media-left ilv-text-xs-center">
                                        <div className="avatar-fluid avatar-fluid-xl"
                                            style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")" }}
                                        />
                                    </div>
                                    <div className="ilv-media-body">
                                        <span className="h2">
                                            {user.get("Name")} {user.get("Surname")}
                                        </span>
                                        <span className="ilv-tag ilv-tag-warning">Premium</span>
                                        <div>
                                            {headline.isEmpty() ? "":<div>
                                                {headline.s}
                                            </div>}
                                            <div>
                                                {industry.isEmpty() ? "":industry.s}
                                                {userLocation.isEmpty() ? "":" | "+userLocation.s}
                                           </div>
                                        </div>
                                    </div>
                                    <div className="ilv-media-right">
                                        <div className="ilv-text-xs-center">
                                            <span className="ilv-btn ilv-btn-success">
                                                4.9 <sup>/ 5.0</sup>
                                            </span>
                                            <p>
                                                <a className="ilv-text-small" href="">{Messages.format("TextEvaluations", [32])}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-card-footer">
                                <div className="ilv-btn-group">
                                    <button className="ilv-btn ilv-btn-primary">{Messages.get("ActionSendMessage")}</button>
                                    <button className="ilv-btn ilv-btn-neutral">{Messages.get("ActionRequestMeeting")}</button>
                                    <button className="ilv-btn ilv-btn-neutral">{Messages.get("ActionRequestPhone")}</button>
                                </div>
                                <div className="ilv-btn-group pull-sm-right">
                                    <button className="ilv-btn ilv-btn-clean">{Messages.get("LabelShare")}</button>
                                    <button className="ilv-btn ilv-btn-clean">{Messages.get("LabelSave")}</button>
                                </div>
                            </div>
                        </div>

                        {summary.isEmpty() ? "":<div className="ilv-card">
                            <div className="ilv-card-header">
                                <strong>{Messages.get("LabelSummary")}</strong>
                            </div>
                            <div className="ilv-card-body" dangerouslySetInnerHTML={{__html: Marked(summary.s)}} />
                        </div>}
                    </div>
                </div>
            </div>
        </div>);
    }
});
