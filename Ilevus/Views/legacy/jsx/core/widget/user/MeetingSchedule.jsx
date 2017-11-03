
var moment = require("moment");
var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var ScheduleStore = require("ilevus/jsx/core/store/Schedule.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var MeetingScheduleForm = require("ilevus/jsx/core/widget/user/MeetingScheduleForm.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    propTypes: {
        user: PropTypes.object.isRequired
    },
    getDefaultProps() {
        return {
            user: null
        };
    },
    getInitialState() {
        return {
            meetings: null,
            begin: moment().day(0).milliseconds(0).seconds(0).minutes(0).hours(0),
            end: moment().day(6).milliseconds(999).seconds(59).minutes(59).hours(23),
            today: moment()
        };
    },

    componentDidMount() {
        var me = this;

        ScheduleStore.on("retrieve-meetings", (meetings) => {
            console.log(meetings);
            me.setState({
                meetings: meetings
            });
        }, me);

        this.retrieveMeetings();
    },
    componentWillUnmount() {
        ScheduleStore.off(null, null, this);
    },

    retrieveMeetings() {
        ScheduleStore.dispatch({
            action: ScheduleStore.ACTION_RETRIEVE_MEETINGS,
            data: {
                UserId: this.props.user.get("Id"),
                From: this.state.begin.format("YYYY-MM-DTHH:mm:ssZ"),
                To: this.state.end.format("YYYY-MM-DTHH:mm:ssZ")
            }
        });
    },

    backwardWeek() {
        this.setState({
            meetings: [],
            begin: this.state.begin.day(-7),
            end: this.state.end.day(-1)
        });
        this.retrieveMeetings();
    },
    forwardWeek() {
        this.setState({
            meetings: [],
            begin: this.state.begin.day(7),
            end: this.state.end.day(13)
        });
        this.retrieveMeetings();
    },

    bookHour(hour, event) {
        event && event.preventDefault();
        console.log(hour);
        Modal.largeModal(
            Messages.get("LabelBookMeeting"),
            <MeetingScheduleForm
                                 hour={hour}
                                 user={this.props.user}
                                 onBook={this.onBookMeeting} />
        );
    },
    onBookMeeting(meeting) {
        this.retrieveMeetings();
        Modal.hide();
        Toastr.remove();
        Toastr.success(Messages.get("TextBookMeetingSuccess"));
    },

    isHourBooked(hour) {
        for (var i = 0; i < this.state.meetings.length; i++) {
            if (hour.isSame(moment(this.state.meetings[i].Begin), 'minute')) {
                return true;
            }
        }
        return false;
    },

    renderCalendarForBooking() {
        var configs = this.props.user.get("ScheduleConfig");
        var days = [];
        for (var day = 0; day < 7; day++) {
            days.push(moment(this.state.begin).day(day));
        }
        var interval = configs.Interval;
        var accepts = JSON.parse(configs.HourConfig);
        var hoursEnabled = [];
        for (var i = 0; i < accepts.length ; i++) {
            hoursEnabled.push(accepts[i].indexOf(true) >= 0);
        }
        var hour = moment(this.state.begin).hours(0).minutes(0);

        return (<table className="ilv-schedule">
            <thead>
                <tr>
                    <th onClick={this.backwardWeek}  style={{ cursor: "pointer", width: "45px", maxWidth: "45px" }}>
                        <i className="material-icons md-36">&#xE314;</i>
                    </th>
                    {days.map((day, idx) => {
                        return (<th key={"day-header-"+idx}>
                            <div>{day.isSame(this.state.today, "date") ?
                                Messages.get("LabelToday")
                                :
                                day.format("ddd")
                            }</div>
                            <div>{day.format("D MMM")}</div>
                        </th>);
                    })}
                    <th onClick={this.forwardWeek} style={{cursor: "pointer", width: "45px", maxWidth: "45px"}}>
                        <i className="material-icons md-36">&#xE5CC;</i>
                    </th>
                </tr>
            </thead>
            <tbody>
                {hoursEnabled.map((enabled, idx) => {
                    var columns = accepts[idx].map((day, dayIdx) => {
                        var now = moment();
                        var bookHour = moment(hour).day(dayIdx);
                        var booked = this.isHourBooked(bookHour);
                        var antecipated = bookHour.isSameOrAfter(now.hours(now.hours() + configs.Antecedence), 'minute');
                        return (<td key={"hour-" + idx + "-day-" + dayIdx}>
                            {day && antecipated && (!booked) ?
                            <a onClick={this.bookHour.bind(this, bookHour)}>
                                {hour.format("HH:mm")}
                            </a>
                            :""
                            }
                        </td>);
                    });
                    hour.minutes(hour.minutes() + interval);
                    return (<tr key={"hour-row-" + idx} style={{ display: enabled ? undefined : "none" }}>
                        <td></td>
                        {columns}
                        <td></td>
                    </tr>);
                })}
            </tbody>
        </table>);
    },

    render() {
        if (!this.state.meetings) {
            return <div />;
        }
        return <div>
            {this.renderCalendarForBooking()}
        </div>;
    }
});
