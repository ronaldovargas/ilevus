var moment = require("moment");
var React = require('react');
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var ScheduleStore = require("ilevus/jsx/core/store/Schedule.jsx");
var MeetingScheduleConfig = require("ilevus/jsx/core/widget/user/MeetingScheduleConfig.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var string = require("string");
var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
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
                <div className="row">
                    <div className="col">
                        <h2 className="mb-5">{Messages.get("TextHello")} Jon Snow, {Messages.get("TextWelcomeBack")}!</h2>
                        <div className="ilv-media ilv-media-middle mb-4">
                            <div className="ilv-media-body">
                                <h4>{Messages.get("TextCoachPrograms")} (4)</h4>
                            </div>
                            <div className="ilv-media-right">
                                <input className="ilv-form-control" placeholder={Messages.get("LabelSearch")} />
                            </div>
                        </div> 

                        <table className="ilv-table">
                            <thead>
                                <tr>
                                    <th>{Messages.get("LabelCoach")}</th>
                                    <th>{Messages.get("LabelStatus")}</th>
                                    <th>{Messages.get("LabelCurrentSession")}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="ilv-media ilv-media-middle">
                                            <div className="ilv-media-left">
                                                <span className="ilv-avatar-fluid ilv-avatar-fluid-sm" style={{ backgroundImage: `url( ${string(UserIcon)} )` }}></span>
                                            </div>
                                            <div className="ilv-media-body">
                                                Daenerys Targaryen
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <label className="ilv-tag ilv-tag-info m-0">{Messages.get("LabelInProgress")}</label>
                                    </td>
                                    <td>
                                        <h3 className="m-0">6</h3>
                                    </td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelParticipate")}>
                                            <i className="material-icons md-24">&#xE037;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelRate")}>
                                            <i className="material-icons md-24">&#xE838;</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="ilv-media ilv-media-middle">
                                            <div className="ilv-media-left">
                                                <span className="ilv-avatar-fluid ilv-avatar-fluid-sm" style={{ backgroundImage: `url( ${string(UserIcon)} )` }}></span>
                                            </div>
                                            <div className="ilv-media-body">
                                                Sansa Stark
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <label className="ilv-tag ilv-tag-info m-0">{Messages.get("LabelInProgress")}</label>
                                    </td>
                                    <td>
                                        <h3 className="m-0">3</h3>
                                    </td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelParticipate")}>
                                            <i className="material-icons md-24">&#xE037;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelRate")}>
                                            <i className="material-icons md-24">&#xE838;</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="ilv-media ilv-media-middle">
                                            <div className="ilv-media-left">
                                                <span className="ilv-avatar-fluid ilv-avatar-fluid-sm" style={{ backgroundImage: `url( ${string(UserIcon)} )` }}></span>
                                            </div>
                                            <div className="ilv-media-body">
                                                Arya Stark
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <label className="ilv-tag ilv-tag-success m-0">{Messages.get("LabelFinished")}</label>
                                    </td>
                                    <td>
                                        <h3 className="m-0">4</h3>
                                    </td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelParticipate")}>
                                            <i className="material-icons md-24">&#xE037;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelRate")}>
                                            <i className="material-icons md-24">&#xE838;</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="ilv-media ilv-media-middle">
                                            <div className="ilv-media-left">
                                                <span className="ilv-avatar-fluid ilv-avatar-fluid-sm" style={{ backgroundImage: `url( ${string(UserIcon)} )` }}></span>
                                            </div>
                                            <div className="ilv-media-body">
                                                Clark Kent
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <label className="ilv-tag ilv-tag-warning m-0">{Messages.get("LabelNotStarted")}</label>
                                    </td>
                                    <td>
                                        <h3 className="m-0">1</h3>
                                    </td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelParticipate")}>
                                            <i className="material-icons md-24">&#xE037;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelRate")}>
                                            <i className="material-icons md-24">&#xE838;</i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="ilv-media ilv-media-middle mb-4">
                            <div className="ilv-media-body">
                                <h4>{Messages.get("YourSchedules")} (1)</h4>
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