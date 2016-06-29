
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
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
                        <div className="card">
                            <div className="card-block">
                                <div className="media m-a-0">
                                    <div className="media-left text-xs-center">
                                        <div className="avatar-fluid avatar-fluid-xl"
                                            style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")" }}
                                        />
                                    </div>
                                    <div className="media-body">
                                        <h1 className="m-y-0 h4">
                                            {user.get("Name")} {user.get("Surname")}
                                        </h1>
                                        <p className="m-y-0">
                                            <span className="label label-default">Premium</span>
                                            <small className="m-x-1">Desenvolvimento Profissional, {userLocation}</small>
                                        </p>
                                    </div>
                                    <div className="media-right text-xs-right">
                                        <h3 className="m-a-0">
                                            <span className="label label-success font-weight-bold">4.9 <sup>/ 5.0</sup></span>
                                        </h3>
                                        <a className="small" href="">
                                            {Messages.format("TextEvaluations", [32])}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="btn-toolbar">
                                    <button className="btn btn-brand">{Messages.get("ActionSendMessage")}</button>
                                    <button className="btn btn-neutral">{Messages.get("ActionRequestMeeting")}</button>
                                    <button className="btn btn-neutral">{Messages.get("ActionRequestPhone")}</button>

                                    <div className="btn-group pull-sm-right">
                                        <button className="btn btn-clean">{Messages.get("LabelShare")}</button>
                                        <button className="btn btn-clean">{Messages.get("LabelSave")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
});
