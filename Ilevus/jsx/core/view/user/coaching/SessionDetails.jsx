var React = require('react');
var S = require("string");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var EditableTextArea = require("ilevus/jsx/core/widget/coaching/EditableTextArea.jsx");
var SessionHistory = require("ilevus/jsx/core/widget/coaching/SessionHistory.jsx");
var WheelOfLifeChart = require("ilevus/jsx/core/widget/coaching/wheeloflife/Chart.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var UserIcon = require("ilevus/img/user.png");

var Line = require("react-chartjs-2").Line;

const configCommitment = {
    data: {
        labels: ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"],
        datasets: [
            {
                label: "Comprometimento",
                fill: true,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(75,192,192,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [5, 7, 8, 8, 6],
                spanGaps: false,
            }
        ],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 10,
                    stepSize: 2,
                }
            }]
        }
    }
};

const configScore = {
    data: {
        labels: ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"],
        datasets: [
            {
                label: "Nota da avaliação",
                fill: true,
                lineTension: 0.1,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(255,99,132,1)',
                pointBackgroundColor: "#fff",
                pointBorderWidth: 10,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(255,99,132,1)',
                pointHoverBorderColor: 'rgba(255,99,132,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [8, 7, 8, 4, 6],
                spanGaps: false,
            }
        ],
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 10,
                    stepSize: 2,
                }
            }]
        }
    }
};

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    getInitialState() {
        return {
            isCoach: false,
            process: null,
            session: 0,
            loading: true
        };
    },

    componentDidMount() {
        var me = this;
        CoachingStore.on("retrieve-coaching-process", (process) => {
            me.setState({
                isCoach: UserSession.get("user").Id === process.Coach.Id,
                process: process,
                session: process.Sessions.length - 1,
                loading: false
            });
        }, me);
        CoachingStore.on("updated-session-field", (process) => {
            me.setState({
                process: process
            });
        }, me);

        CoachingStore.dispatch({
            action: CoachingStore.ACTION_RETRIEVE_COACHING_PROCESS,
            data: me.props.params.id
        });
    },

    componentWillUnmount() {
        CoachingStore.off(null, null, this);
    },

    updateSessionField(field, value) {
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_UPDATE_SESSION_FIELD,
            data: {
                ProcessId: this.props.params.id,
                Session: this.state.session,
                Field: field,
                Value: value
            }
        });
    },
    objectiveChange(newValue) {
        this.state.process.Sessions[this.state.session].Objectives = newValue;
        this.forceUpdate();
        this.updateSessionField("Objectives", newValue);
    },
    coacheeCommentsChange(newValue) {
        this.state.process.Sessions[this.state.session].CoacheeComments = newValue;
        this.forceUpdate();
        this.updateSessionField("CoacheeComments", newValue);
    },
    coachCommentsChange(newValue) {
        this.state.process.Sessions[this.state.session].CoachComments = newValue;
        this.forceUpdate();
        this.updateSessionField("CoachComments", newValue);
    },

    selectSession(index) {
        this.setState({
            session: index
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var process = this.state.process,
            isCoach = this.state.isCoach,
            coach = process.Coach,
            coachee = process.Coachee,
            other = isCoach ? coachee : coach,
            session = process.Sessions[this.state.session],
            inProgress = (session.Status > 0) && (session.Status < 10)
        ;
        console.log(session);
        return (
            <div className="container my-5">
                <div className="row">
                    <div className="col-xs-12 col-sm-8">
                        <div className="row mb-5">
                            <div className="col">
                                <div className="ilv-media">
                                    <div className="ilv-media-left mr-4">
                                        <div className="ilv-avatar-fluid ilv-avatar-fluid-xl"
                                             style={{ backgroundImage: "url(" + (S(other.Image).isEmpty() ? UserIcon : other.Image) + ")" }
                                        } />
                                    </div>
                                    <div className="ilv-media-body">
                                        <h1 className="ilv-font-weight-bold">{Messages.get('LabelSession')}: {this.state.session + 1}</h1>
                                        <p className="ilv-text-large">
                                            {isCoach ? Messages.get("TextCoachingSessionTo") : Messages.get("TextCoachingSessionBy")} <em>{other.Name} {other.Surname}</em>.
                                        </p>
                                    </div>
                                    <div className="ilv-media-right">
                                        <button className="ilv-btn ilv-btn-clean">
                                            <i className="ilv-icon material-icons md-24">&#xE8D0;</i>
                                        </button>
                                        <div className="dropdown" style={{display: 'inline-block'}}>
                                            <button className="ilv-btn ilv-btn-clean" data-toggle="dropdown">
                                                <i className="ilv-icon material-icons md-24">&#xE2C4;</i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <a className="dropdown-item" href="#">{Messages.get("LabelDownloadSession")}</a>
                                                <a className="dropdown-item" href="#">{Messages.get("LabelDownloadAllSessions")}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mb-3"/>
                                <div className="ilv-media ilv-media-middle">
                                    <div className="ilv-media-left mr-3">
                                        <span className="ilv-font-weight-semibold">{Messages.get('LabelRelatedProcessStep')}:</span>
                                    </div>
                                    <div className="ilv-media-body">
                                        <select className="ilv-form-control ilv-form-control-sm">
                                            <option>1 - Identificar situação atual</option>
                                            <option>2 - Criar perspectivas</option>
                                            <option>3 - Definir metas</option>
                                            <option>4 - Criar plano de ação</option>
                                            <option>5 - Desenvolver continuamente</option>
                                        </select>
                                    </div>
                                </div>

                                <hr className="mt-3 mb-5" />

                                <EditableTextArea
                                                  label={Messages.get('LabelSessionObjectives')}
                                                  value={session.Objectives}
                                                  editable={isCoach && inProgress}
                                                  onChange={this.objectiveChange} />
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col">
                                <h4>{Messages.get("SessionTools")}</h4>
                                <div className="ilv-card">
                                    <div className="ilv-card-body">
                                        <table className="ilv-table ilv-table-sm">
                                            <thead>
                                                <tr>
                                                    <th>{Messages.get("LabelTool")}</th>
                                                    <th className="text-right">{Messages.get("LabelActions")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Roda da vida</td>
                                                    <td className="text-right">
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE89E;</i>
                                                        </button>
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>SMART</td>
                                                    <td className="text-right">
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE89E;</i>
                                                        </button>
                                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <a className="font-weight-bold" href="javascript:;">{Messages.get('LabelApplyTool')}</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col">
                                <EditableTextArea label={Messages.get('LabelMyComments')}
                                              value={isCoach ? session.CoachComments : session.CoacheeComments}
                                              editable={inProgress}
                                              onChange={isCoach ? this.coachCommentsChange : this.coacheeCommentsChange} />
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col">
                                <EditableTextArea label={Messages.get(isCoach ? 'LabelCoacheeComments':'LabelCoachComments')}
                                              value={isCoach ? session.CoacheeComments : session.CoachComments}
                                              editable={false} />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="ilv-card mb-5">
                            {session.Status == 0 ? <div className="ilv-card-header text-center">
                                <i>{Messages.get("LabelNotStarted")}</i>
                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-success mt-2">{Messages.get("LabelStartSession")}</button>
                            </div>:(session.Status < 10 ? <div className="ilv-card-header text-center">
                                <small>{Messages.get("LabelSessionDuration")}:</small>
                                <h1 className="mb-3">1:31:47</h1>
                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-destructive">{Messages.get("LabelEndSession")}</button>
                            </div>:<div className="ilv-card-header text-center">
                                <small>{Messages.get("LabelSessionDuration")}:</small>
                                <h1 className="mb-3">1:31:47</h1>
                                <i>{Messages.get("LabelFinished")}</i>
                            </div>)}
                            <div className="ilv-card-block">
                                {session.Status >= 10 ? <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-link">{Messages.get("LabelNewSession")}</button> : ""}
                            </div>
                        </div>

                        <div className="mb-5">
                            <Line data={configCommitment.data} options={configCommitment.options} />
                        </div>
                        <div className="mb-5">
                            <Line data={configScore.data} options={configScore.options} />
                        </div>

                        <div className="ilv-card mb-5">
                            <div className="ilv-card-block">
                                <SessionHistory sessions={process.Sessions} onChange={this.selectSession} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

