var React = require('react');
var S = require("string");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var EditableTextArea = require("ilevus/jsx/core/widget/coaching/EditableTextArea.jsx");
var WheelOfLifeChart = require("ilevus/jsx/core/widget/coaching/wheeloflife/Chart.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var UserIcon = require("ilevus/img/user.png");

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

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var process = this.state.process,
            isCoach = this.state.isCoach,
            coach = process.Coach,
            coachee = process.Coachee,
            other = isCoach ? coachee : coach,
            session = process.Sessions[this.state.session]
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
                                    <div className="ilv-media-left">
                                        <span className="ilv-font-weight-semibold">{Messages.get('LabelRelatedProcess')}:</span>
                                    </div>
                                    <div className="ilv-media-body">
                                        <a href="javascript:;">{Messages.get("LabelLinkSessionToProcessStep")}</a>
                                    </div>
                                </div>

                                <hr className="mt-3 mb-5" />

                                <EditableTextArea
                                                  label={Messages.get('LabelSessionObjectives')}
                                                  value={session.Objectives}
                                                  editable={isCoach}
                                                  onChange={this.objectiveChange} />
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col">
                                <WheelOfLifeChart />
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
                        <div className="ilv-card">
                            <div className="ilv-card-header text-center">
                                <small>{Messages.get("LabelSessionDuration")}:</small>
                                <h1 className="mb-3">1:31:47</h1>
                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-destructive">{Messages.get("LabelEndSession")}</button>
                            </div>
                            <div className="ilv-card-block">
                                <table className="ilv-table mb-0">
                                    <thead>
                                        <tr style={{backgroundColor: '#f5f7f9'}}>
                                            <th className="text-center" colSpan="2"><small className="font-weight-bold">{Messages.get("TextSessionHistory")}</small></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 5</div>
                                                <small>{Messages.get('LabelDuration')}: 1:02</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 4</div>
                                                <small>{Messages.get('LabelDuration')}: 1:13</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 3</div>
                                                <small>{Messages.get('LabelDuration')}: 0:57</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 2</div>
                                                <small>{Messages.get('LabelDuration')}: 1:03</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="font-weight-bold">{Messages.get('LabelSession')} 1</div>
                                                <small>{Messages.get('LabelDuration')}: 1:24</small>
                                            </td>
                                            <td className="text-right">
                                                <a className="ilv-btn ilv-btn-sm ilv-btn-clean px-0" href="javascript:;">
                                                    <i className="ilv-icon material-icons md-24">&#xE5CC;</i>
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-link">{Messages.get("LabelNewSession")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

