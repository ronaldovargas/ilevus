﻿var moment = require("moment");
var React = require('react');
var Link = require("react-router").Link;
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var ScheduleStore = require("ilevus/jsx/core/store/Schedule.jsx");
var MeetingScheduleConfig = require("ilevus/jsx/core/widget/user/MeetingScheduleConfig.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var string = require("string");
var UserIcon = require("ilevus/img/user.png");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },

    getInitialState() {
        return {
            meetings: null,
            loaded: false
        };
    },

    componentDidMount() {
        var me = this;
        ScheduleStore.on("retrieve-my-meetings", (meetings) => {
            me.setState({
                meetings: meetings,
                loaded: true
            });
        }, me);

        ScheduleStore.dispatch({
            action: ScheduleStore.ACTION_RETRIEVE_MY_MEETINGS,
            data: {}
        });
    },

    componentWillUnmount() {
        ScheduleStore.off(null, null, this);
    },

    renderMeetings() {
        if (!this.state.meetings || this.state.meetings.length <= 0) {
            return <i>Nenhuma reunião futura marcada até o momento.</i>;
        }
        return (<div className="ilv-media-list ilv-media-list-bordered">
            {this.state.meetings.map((meeting, index) => {
                return (
                    <div className="ilv-media mb-3" key={"meeting-" + index}>
                        <div className="ilv-media-body">
                            <h4 className="my-0">{meeting.CoacheeFullName}</h4>
                            <span>
                                <i className="ilv-icon material-icons md-inherit mr-1">&#xE8B5;</i>
                                <span>{moment(meeting.Begin).format("dddd, D/MM/YYYY HH:mm")}</span>
                            </span>
                            <p><small>{meeting.CoacheePhone} - {meeting.CoacheeEmail}</small></p>
                            <small><strong>{Messages.get("LabelDescription")}</strong></small>
                            <p>{meeting.Subject}</p>
                        </div>
                    </div>
                );
            })}
        </div>);
    },

    render() {
        if (!this.state.loaded) {
            return <LoadingGauge />;
        }
        return (
            <div className="container">
                <div className="row mb-5">
                    <div className="col">
                        <div className="ilv-media ilv-media-middle mb-4">
                            <div className="ilv-media-body">
                                <h4>
                                    {Messages.get("YourSchedules")} ({!this.state.meetings || this.state.meetings.length <= 0 ? 0 : this.state.meetings.length})
                                    &nbsp;<Link to="/user/schedule/configure" className="ilv-btn ilv-btn-primary">{Messages.get("ActionConfigure")}</Link>
                                </h4>
                            </div>
                            <div className="ilv-media-right">
                                <select className="ilv-form-control">
                                    <option>{Messages.get("AllSchedules")}</option>
                                    <option>{Messages.get("AcceptedSchedules")}</option>
                                    <option>{Messages.get("RefusedSchedules")}</option>
                                </select>
                            </div>
                        </div>

                        {this.renderMeetings()}
                    </div>
                </div>
            </div>
        );
    }
});