
var _ = require("underscore");
var S = require("string");
var moment = require("moment");
var numeral = require("numeral");
var React = require('react');
var Link = require("react-router").Link;
var Toastr = require('toastr');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var EditableTextArea = require("ilevus/jsx/core/widget/coaching/EditableTextArea.jsx");
var SessionCharts = require("ilevus/jsx/core/widget/coaching/SessionCharts.jsx");
var SessionHistory = require("ilevus/jsx/core/widget/coaching/SessionHistory.jsx");
var SessionTags = require("ilevus/jsx/core/widget/coaching/SessionTags.jsx");
var SessionTimer = require("ilevus/jsx/core/widget/coaching/SessionTimer.jsx");
var SessionTools = require("ilevus/jsx/core/widget/coaching/SessionTools.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var UserIcon = require("ilevus/img/user.png");

var CommitmentBg = "rgba(75,192,192,0.4)";
var FeedbackBg = "rgba(103, 58, 183, 0.2)";

var ProcessStep = "";

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object,
    },
    childContextTypes: {
        isCoach: PropTypes.bool,
        process: PropTypes.object,
    },
    getChildContext() {
        return {
            isCoach: this.state.isCoach,
            process: this.state.process,
        };
    },
    getRoute(process, session) {
        return "/coaching/process/" + process + "/" + session;
    },

    getInitialState() {
        return {
            isCoach: false,
            process: null,
            loading: true
        };
    },

    componentDidMount() {
        var me = this;
        CoachingStore.on("retrieve-coaching-process", (process) => {
            if (!this.props.params.session) {
                me.context.router.replace(me.getRoute(me.props.params.id, process.Sessions.length - 1));
            }
            me.setState({
                isCoach: UserSession.get("user").Id === process.Coach.Id,
                process: process,
                lastModified: process.LastModified,
                loading: false,
            });
            _.delay(this.pollModifications, 5000);
        }, me);

        CoachingStore.on("process-modified", (process) => {
            me.setState({
                process: process,
                lastModified: process.LastModified,
            });
            _.delay(this.pollModifications, 5000);
        }, me);
        CoachingStore.on("process-not-modified", () => {
            _.delay(this.pollModifications, 5000);
        }, me);

        CoachingStore.on("updated-session-field", (process) => {
            me.setState({
                process: process,
                lastModified: process.LastModified,
            });
        }, me);

        CoachingStore.on("new-session", (process) => {
            me.setState({
                process: process,
                lastModified: process.LastModified,
            });
            me.context.router.push(me.getRoute(me.props.params.id, process.Sessions.length - 1));
        }, me);
        CoachingStore.on("start-session", (process) => {
            me.setState({
                process: process,
                lastModified: process.LastModified,
            });
        }, me);
        CoachingStore.on("finish-session", (process) => {
            me.setState({
                process: process,
                lastModified: process.LastModified,
            });
        }, me);

        CoachingStore.on("change-session-process-step", (process) => {
            me.setState({
                process: process,
                lastModified: process.LastModified,
            });
        }, me);
        
        CoachingStore.on("evaluate-session", (process) => {
            Toastr.success(Messages.get("TextEvaluationSaved"));
            me.setState({
                process: process,
                lastModified: process.LastModified,
            });
        }, me);

        CoachingStore.dispatch({
            action: CoachingStore.ACTION_RETRIEVE_COACHING_PROCESS,
            data: me.props.params.id
        });

    },
    componentDidUpdate() {
        setTimeout(function () {
            jQuery('.breadcrumb .active').parent().scrollLeft(document.querySelector('.breadcrumb .active').offsetLeft);
        }, 2000);
    },

    componentWillUnmount() {
        CoachingStore.off(null, null, this);
    },

    componentWillReceiveProps(newProps, newContext) {
        if (this.props.params.id != newProps.params.id) {
            this.setState({ loading: true });
            CoachingStore.dispatch({
                action: CoachingStore.ACTION_RETRIEVE_COACHING_PROCESS,
                data: newProps.params.id
            });
        }
    },

    pollModifications() {
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_POLL_PROCESS_MODIFICATIONS,
            data: {
                id: this.props.params.id,
                lastModified: this.state.lastModified,
            }
        });
    },

    updateProcessStep(event) {
        var step = parseInt(event.target.value);
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_CHANGE_SESSION_PROCESS_STEP,
            data: {
                Id: this.props.params.id,
                Session: parseInt(this.props.params.session),
                Step: step,
            }
        });
    },

    updateSessionField(field, value) {
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_UPDATE_SESSION_FIELD,
            data: {
                ProcessId: this.props.params.id,
                Session: parseInt(this.props.params.session),
                Field: field,
                Value: value
            }
        });
    },
    objectiveChange(newValue) {
        this.state.process.Sessions[parseInt(this.props.params.session)].Objectives = newValue;
        this.forceUpdate();
        this.updateSessionField("Objectives", newValue);
    },
    coacheeCommentsChange(newValue) {
        this.state.process.Sessions[parseInt(this.props.params.session)].CoacheeComments = newValue;
        this.forceUpdate();
        this.updateSessionField("CoacheeComments", newValue);
    },
    coachCommentsChange(newValue) {
        this.state.process.Sessions[parseInt(this.props.params.session)].CoachComments = newValue;
        this.forceUpdate();
        this.updateSessionField("CoachComments", newValue);
    },

    selectSession(index) {
        this.context.router.push(this.getRoute(this.props.params.id, index));
    },

    saveEvaluation(event) {
        event && event.preventDefault();
        var me = this;
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_EVALUATE_SESSION,
            data: {
                Id: me.props.params.id,
                Session: parseInt(this.props.params.session),
                Rating: this.refs['rate-feedback'].valueAsNumber,
                Commitment: this.refs['rate-commitment'].valueAsNumber
            }
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }

        if (this.props.children) {
            return this.props.children;
        }

        var process = this.state.process,
            isCoach = this.state.isCoach,
            coach = process.Coach,
            coachee = process.Coachee,
            other = isCoach ? coachee : coach,
            sessionIndex = parseInt(this.props.params.session),
            session = process.Sessions[sessionIndex],
            inProgress = (session.Status > 0) && (session.Status < 10),
            currentSession = process.Sessions.length == (sessionIndex + 1),
            latestFinished = process.Sessions[process.Sessions.length - 1].Status >= 10
        ;
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
                                        <h1 className="ilv-font-weight-bold">{Messages.get('LabelSession')}: {sessionIndex + 1}</h1>
                                        <p className="ilv-text-large">
                                            {isCoach ? Messages.get("TextCoachingSessionTo") : Messages.get("TextCoachingSessionBy")} <em>{other.Name} {other.Surname}</em>.
                                        </p>
                                    </div>
                                    <div className="ilv-media-right">
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
                                    
                                    <div className="ilv-media-body" style={{ width: '100%'}}>
                                        {isCoach ? (<select className="ilv-form-control ilv-form-control-sm" defaultValue={session.ProcessStep} onChange={this.updateProcessStep}>
                                            <div className="ilv-media-left mr-3">
                                                <span className="ilv-font-weight-semibold">{Messages.get('LabelRelatedProcessStep')}:</span>
                                            </div>
                                            {process.Steps.map((step, index) => {
                                                return <option value={index} key={"process-step-"+index}>{index+1} - {step.Label}</option>
                                            })}
                                        </select>):(<div className="dvBreadcrumb" style={{overflowX: 'auto'}}><ul className="breadcrumb mb-3 breadcrumb-scroll">
                                            {process.Steps.map((step1, index1) => {
                                                ProcessStep = (session.ProcessStep == index1 ? "active" : session.ProcessStep > index1 ? "completed" : "");
                                                return <li className={ProcessStep }><a href="javascript:;" title={step1.Label }>{ (step1.Label.length > 20 ? step1.Label.substring(0, 20) + ' ...' : step1.Label) }</a></li>
                                            })}
                                        </ul></div>)}
                                    </div>
                                </div>

                                <hr className="mt-3 mb-5" />

                                <EditableTextArea
                                                  label={Messages.get('LabelSessionObjectives')}
                                                  value={session.Objectives}
                                                  editable={isCoach && inProgress}
                                                  onChange={this.objectiveChange} />
                                <SessionTags ref="timer"
                                             process={process}
                                             session={session}
                                             sessionIndex={sessionIndex}
                                             isCoach={isCoach} />
                                
                            </div>
                        </div>

                        <div className="row mb-5">
                            <SessionTools className="col" isCoach={isCoach} processId={this.props.params.id} session={session} sessionIndex={sessionIndex} />
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
                        <SessionTimer ref="timer"
                                      process={process}
                                      session={session}
                                      isCoach={isCoach}
                                      />

                        {!isCoach && (session.Status >= 10) ? <div className="mb-5 text-center">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="ilv-card" style={{backgroundColor: CommitmentBg}}>
                                        <div className="ilv-card-body text-center">
                                            <span>{Messages.get("LabelCommitment")}</span>
                                            <input className="ilv-form-control mt-2" type="number" ref="rate-commitment" defaultValue={session.Commitment} min="0" max="10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="ilv-card" style={{backgroundColor: FeedbackBg}}>
                                        <div className="ilv-card-body text-center">
                                            <span>{Messages.get("LabelFeedback")}</span>
                                            <input className="ilv-form-control mt-2" type="number" ref="rate-feedback" defaultValue={session.Rating} min="0" max="10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="ilv-btn ilv-btn-sm ilv-btn-primary" onClick={this.saveEvaluation}>{Messages.get("LabelSave")}</button>
                        </div>:""}

                        <SessionCharts process={process} />
                        
                        <SessionHistory sessions={process.Sessions} current={sessionIndex} onChange={this.selectSession} />

                        </div>
                </div>
            </div>
        )
    }
});

