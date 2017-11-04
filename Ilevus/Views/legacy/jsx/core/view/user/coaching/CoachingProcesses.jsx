var moment = require("moment");
var React = require('react');
var Link = require("react-router").Link;
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var string = require("string");
var UserIcon = require("ilevus/img/user.png");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },

    getInitialState() {
        return {
            asCoach: null,
            asCoachee: null,
            loaded: false
        };
    },

    componentDidMount() {
        var me = this;
        CoachingStore.on("retrieve-coach-processes", (processes) => {
            me.setState({
                asCoach: processes || [],
                loaded: !!me.state.asCoachee
            });
        }, me);
        CoachingStore.on("retrieve-coachee-processes", (processes) => {
            me.setState({
                asCoachee: processes || [],
                loaded: !!me.state.asCoach
            });
        }, me);

        me.refreshProcesses();
    },

    componentWillUnmount() {
        CoachingStore.off(null, null, this);
    },

    refreshProcesses() {
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_RETRIEVE_COACH_PROCESSES
        });
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_RETRIEVE_COACHEE_PROCESSES
        });
    },

    renderProcesses(asCoach) {
        return (<table className="ilv-table">
            <thead>
                <tr>
                    <th>{asCoach ? Messages.get("LabelCoachee") : Messages.get("LabelCoach")}</th>
                    <th>{Messages.get("LabelStatus")}</th>
                    <th>{Messages.get("LabelCurrentSession")}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {(asCoach ? this.state.asCoach : this.state.asCoachee).map((process, index) => {
                    console.log(process);
                    var display = asCoach ? process.Coachee : process.Coach;
                    var statusEl;
                    if (process.Status == 0) {
                        statusEl = <label className="ilv-tag ilv-tag-warning m-0">{Messages.get("LabelNotStarted")}</label>;
                    } else if (process.Status == 10) {
                        statusEl = <label className="ilv-tag ilv-tag-success m-0">{Messages.get("LabelFinished")}</label>;
                    } else if (process.Status > 10) {
                        statusEl = <label className="ilv-tag ilv-tag-danger m-0">{Messages.get("LabelCanceled")}</label>;
                    } else {
                        statusEl = <label className="ilv-tag ilv-tag-info m-0">{Messages.get("LabelInProgress")}</label>;
                    }

                    return (<tr key={"coaching-" + index}>
                        <td>
                            <div className="ilv-media ilv-media-middle">
                                <div className="ilv-media-left">
                                    <span className="ilv-avatar-fluid ilv-avatar-fluid-sm" style={{ backgroundImage: "url( "+(
                                        string(display.Image).isEmpty() ? UserIcon : display.Image
                                        )+" )" }} />
                                </div>
                                <div className="ilv-media-body">
                                    {display.Name} {display.Surname}
                                </div>
                            </div>
                        </td>
                        <td>
                            {statusEl}
                        </td>
                        <td>
                            <h3 className="m-0">{process.Sessions.length}</h3>
                        </td>
                        <td className="text-right">
                            <Link to={"/coaching/process/" + process.Id} className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelParticipate")}>
                                <i className="material-icons md-24">&#xE037;</i>
                            </Link>
                            {/*<button className="ilv-btn ilv-btn-clean" data-toggle="tooltip" title={Messages.get("LabelRate")}>
                                <i className="material-icons md-24">&#xE838;</i>
                            </button>*/}
                        </td>
                    </tr>);
                })}
            </tbody>
        </table>);
    },

    render() {
        if (!this.state.loaded) {
            return <LoadingGauge />;
        }
        return (<div className="container">
            <h2 className="mb-5">
                {Messages.get("TextHello")}&nbsp;
                {UserSession.get("user").Name},&nbsp;
                {Messages.get("TextWelcomeBack")}!
            </h2>

            {this.state.asCoach.length <= 0 ? "":<div className="row mb-5">
                <div className="col">
                    <div className="ilv-media ilv-media-middle mb-4">
                        <div className="ilv-media-body">
                            <h4>
                                {Messages.get("TextCoachProgramsAsCoach")} ({this.state.asCoach.length})
                            </h4>
                        </div>
                        <div className="ilv-media-right">
                            <input className="ilv-form-control" placeholder={Messages.get("LabelSearch")} />
                        </div>
                    </div>

                    {this.renderProcesses(true)}
                </div>
            </div>}

            {this.state.asCoachee.length <= 0 ? "":<div className="row mb-5">
                <div className="col">
                    <div className="ilv-media ilv-media-middle mb-4">
                        <div className="ilv-media-body">
                            <h4>
                                {Messages.get("TextCoachProgramsAsCoachee")} ({this.state.asCoachee.length})
                            </h4>
                        </div>
                        <div className="ilv-media-right">
                            <input className="ilv-form-control" placeholder={Messages.get("LabelSearch")} />
                        </div>
                    </div>

                    {this.renderProcesses(false)}
                </div>
            </div>}

        </div>);
    }
});