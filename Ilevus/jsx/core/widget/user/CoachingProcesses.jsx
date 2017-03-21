var moment = require("moment");
var React = require('react');
var Link = require("react-router").Link;
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var string = require("string");
var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            processes: null,
            loaded: false
        };
    },

    componentDidMount() {
        var me = this;
        CoachingStore.on("retrieve-processes", (processes) => {
            me.setState({
                processes: processes,
                loaded: true
            });
        }, me);

        me.refreshProcesses();
    },

    componentWillUnmount() {
        CoachingStore.off(null, null, this);
    },

    refreshProcesses() {
        if (this.props.user.IsProfessional) {
            CoachingStore.dispatch({
                action: CoachingStore.ACTION_RETRIEVE_COACH_PROCESSES
            });
        } else {
            CoachingStore.dispatch({
                action: CoachingStore.ACTION_RETRIEVE_COACHEE_PROCESSES
            });
        }
    },

    renderProcesses() {
        if (!this.state.processes || this.state.processes.length <= 0) {
            return <i>Nenhum processo de coaching iniciado até o momento.</i>;
        }
        return (<table className="ilv-table">
            <thead>
                <tr>
                    <th>{this.props.user.IsProfessional ? Messages.get("LabelCoachee") : Messages.get("LabelCoach")}</th>
                    <th>{Messages.get("LabelStatus")}</th>
                    <th>{Messages.get("LabelCurrentSession")}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {this.state.processes.map((process, index) => {
                    console.log(process);
                    var display = this.props.user.IsProfessional ? process.Coachee : process.Coach;
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
        return (
            <div className="container">
                <div className="row mb-5">
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

                        {this.renderProcesses()}
                    </div>
                </div>
            </div>
        );
    }
});