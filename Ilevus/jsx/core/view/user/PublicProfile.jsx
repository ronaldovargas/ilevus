
var _ = require("underscore");
var $ = require("jquery");
var React = require("react");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

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
        $('[data-toggle="tooltip"]').tooltip({
            animation: true
        });
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

        return (<div className="m-y-3" role="banner">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                    <div className="ilv-media-left ilv-text-xs-center">
                                        <span className="ilv-avatar ilv-avatar-xl">
                                            <img src={user.get("Image")} alt={user.get("Name")} />
                                        </span>
                                    </div>
                                    <div className="ilv-media-body">
                                        <span className="h4">
                                            {user.get("Name")} {user.get("Surname")}
                                        </span>
                                        <span className="ilv-tag">Premium</span>
                                        <p>
                                            Desenvolvimento Profissional, {userLocation}
                                        </p>
                                        <span className="ilv-tag ilv-tag-success m-l-0">4.9 <sup>/ 5.0</sup></span>
                                        <a className="ilv-text-small" href="">{Messages.format("TextEvaluations", [32])}</a>
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
                    </div>
                </div>
            </div>
        </div>);
    }
});
