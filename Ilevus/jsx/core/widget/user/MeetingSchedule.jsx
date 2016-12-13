
var moment = require("moment");
var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var ScheduleStore = require("ilevus/jsx/core/store/Schedule.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },
    getDefaultProps() {
        return {
            user: null
        };
    },
    getInitialState() {
        return {
            meetings: [],
            begin: moment().day(0).milliseconds(0).seconds(0).minutes(0).hours(0),
            end: moment().day(6).milliseconds(999).seconds(59).minutes(59).hours(23),
            today: moment()
        };
    },

    componentDidMount() {
        var me = this;

        ScheduleStore.on("retrieve", (meetings) => {
            me.setState({
                meetings: meetings
            });
        }, me);
    },
    componentWillUnmount() {
        ScheduleStore.off(null, null, this);
    },

    backwardWeek() {
        this.setState({
            meetings: null,
            begin: this.state.begin.day(-7),
            end: this.state.end.day(-1)
        });
    },
    forwardWeek() {
        this.setState({
            meetings: null,
            begin: this.state.begin.day(7),
            end: this.state.end.day(13)
        });
    },

    renderCalendarForBooking() {
        var days = [];
        for (var day = 0; day < 7; day++) {
            days.push(moment(this.state.begin).day(day));
        }
        return (<table className="ilv-schedule">
            <thead>
                <tr>
                    <th onClick={this.backwardWeek}  style={{cursor: "pointer"}}>
                        <i className="material-icons md-36">&#xE314;</i>
                    </th>
                    {days.map((day, idx) => {
                        return (<th key={"day-header-"+idx}>
                            <div>{day.isSame(this.state.today, "date") ?
                                Messages.get("LabelToday")
                                :
                                day.format("dddd")
                            }</div>
                            <div>{day.format("D MMM")}</div>
                        </th>);
                    })}
                    <th onClick={this.forwardWeek} style={{cursor: "pointer"}}>
                        <i className="material-icons md-36">&#xE5CC;</i>
                    </th>
                </tr>
            </thead>
        </table>);
    },

    render() {
        console.log(this.state.begin.format("dddd YYYY-MM-D HH:mm:ss"));
        console.log(this.state.today.format("dddd YYYY-MM-D HH:mm:ss"));
        console.log(this.state.end.format("dddd YYYY-MM-D HH:mm:ss"));
        if (!this.state.meetings) {
            return <div />;
        }
        return <div>
            {this.renderCalendarForBooking()}
        </div>;
    }
});
