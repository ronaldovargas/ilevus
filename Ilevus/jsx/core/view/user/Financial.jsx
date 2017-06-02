﻿
var S = require("string");
require("ilevus/jsx/vendor/intlTelInput.js");

var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: UserSession.get("loading"),
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("loaded", () => {
            me.setState({
                loading: false,
            });
        }, me);

    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    componentDidUpdate() {
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user"),
            financial = user.Financial,
            premium = user.Premium ? user.Premium : { Active: false },
            ilevusCode = "Av7ZseP"
        ;
        return (
            <div>
                {user.IsProfessional ? (<div className="ilv-card mb-5">
                    <div className="ilv-card-body">
                        <h4>{Messages.get("LabelIndications")}</h4>
                        <p>{Messages.get("TextIndicationsExplanation")}</p>
                        <div className="row">
                            <div className="col">
                                {Messages.get("LabelIlevusCode")}: <input readOnly={true} className="ilv-form-control" value={ilevusCode} />
                            </div>
                            <div className="col">
                                {Messages.get("LabelSignupLink")}: <input readOnly={true} className="ilv-form-control" value={"https://www.ilevus.com/#signup/" + ilevusCode} />
                            </div>
                        </div>
                    </div>
                </div>):""}

                <div className="row">
                    <div className="col mb-5">
                        <h4>{Messages.get("LabelFinancialReports")}</h4>
                    </div>
                    <div className="col mb-5">
                        <h4>
                            {Messages.get("LabelPremiumMembership")} {premium.Active ? (
                                <span className="ilv-tag ilv-tag-success">{Messages.get("LabelActive")}</span>
                            ):(
                                <span className="ilv-tag ilv-tag-info">{Messages.get("LabelUnactive")}</span>
                            )}
                        </h4>
                        {user.IsProfessional ? (
                            premium.Active ? (<div>
                            </div>):(<Link to="/subscribe" className="ilv-btn ilv-btn-primary ilv-btn-sm">{Messages.get("LabelBecomePremium")}</Link>)
                        ):(<Link to="/become-a-professional">{Messages.get("TextBecomeProfessionalToPremium")}</Link>)}
                    </div>

                </div>
            </div>
        );
    }
});
