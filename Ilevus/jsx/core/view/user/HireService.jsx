
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var Marked = require("marked");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var MeetingSchedule = require("ilevus/jsx/core/widget/user/MeetingSchedule.jsx");
var UserContactInfo = require("ilevus/jsx/core/widget/user/UserContactInfo.jsx");

var Analytics = require("ilevus/jsx/core/util/Analytics.js");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

var Languages = require("ilevus/jsx/core/util/Languages.json");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            model: null
        };
    },
 
    render() {
        if (!this.state.model) {
            return <LoadingGauge />;
        }

        var user = this.state.model;
       

        return (
             <tbody>
                {services.map((service, index) => {
                    return (
                        <tr key={"service-" + index}>
                            <td className="ilv-font-weight-semibold">{service.Name}</td>
                            <td className="ilv-text-xs-right">{service.Price}</td>
                        </tr>
                    );
                })}
            </tbody>
        );
    }
});
