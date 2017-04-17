﻿
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
var SessionTools = require("ilevus/jsx/core/widget/coaching/SessionTools.jsx");

var WheelOfLifeChart = require("ilevus/jsx/core/widget/coaching/wheeloflife/Chart.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var UserIcon = require("ilevus/img/user.png");

var CommitmentBg = "rgba(75,192,192,0.4)";
var FeedbackBg = "rgba(103, 58, 183, 0.2)";

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object,
    },
    childContextTypes: {
        isCoach: React.PropTypes.bool,
        process: React.PropTypes.object,
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
            this.updateDurationCounter();
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

    componentWillUnmount() {
        CoachingStore.off(null, null, this);
    },

    componentWillReceiveProps(newProps, newContext) {
        if (this.props.params.id != newProps.params.id) {
            console.log("Changing process...");
            this.setState({ loading: true });
            CoachingStore.dispatch({
                action: CoachingStore.ACTION_RETRIEVE_COACHING_PROCESS,
                data: newProps.params.id
            });
        }
    },

    updateDurationCounter() {
        var el = this.refs["duration-counter"],
            session = this.state.process.Sessions[parseInt(this.props.params.session)];
        if (session.Status == 5 && el) {
            if (!this.sessionDuration) {
                this.sessionDuration = moment.duration(moment().diff(moment(session.Started), "seconds"), "seconds");
            } else {
                this.sessionDuration.add(1, "seconds");
            }
            var hours = numeral(this.sessionDuration.hours()),
                minutes = numeral(this.sessionDuration.minutes()),
                seconds = numeral(this.sessionDuration.seconds());
            el.innerHTML = hours.format("00") + ":" + minutes.format("00") + ":" + seconds.format("00");
        }
        _.delay(this.updateDurationCounter, 1000);
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

    newSession(event) {
        event && event.preventDefault();
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_NEW_SESSION,
            data: this.props.params.id
        });
    },
    startSession(event) {
        event && event.preventDefault();
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_START_SESSION,
            data: this.props.params.id
        });
    },
    finishSession(event) {
        event && event.preventDefault();
        var me = this;
        Modal.confirm(Messages.get("TextAreYouSure"), Messages.get("TextSessionFinishConfirmation"), () => {
            CoachingStore.dispatch({
                action: CoachingStore.ACTION_FINISH_SESSION,
                data: me.props.params.id
            });
            Modal.hide();
        });
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
            latestFinished = process.Sessions[process.Sessions.length - 1].Status >= 10,
            currentDuration = session.Status >= 10 ? moment.duration(moment(session.Finished).diff(moment(session.Started), "seconds"), "seconds") : null,
            currentDurationString = currentDuration ? (
                numeral(currentDuration.hours()).format("00") + ":" +
                numeral(currentDuration.minutes()).format("00") + ":" +
                numeral(currentDuration.seconds()).format("00")
            ):null
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
                                    <div className="ilv-media-left mr-3">
                                        <span className="ilv-font-weight-semibold">{Messages.get('LabelRelatedProcessStep')}:</span>
                                    </div>
                                    <div className="ilv-media-body">
                                        {isCoach ? (<select className="ilv-form-control ilv-form-control-sm" defaultValue={session.ProcessStep} onChange={this.updateProcessStep}>
                                            {process.Steps.map((step, index) => {
                                                return <option value={index} key={"process-step-"+index}>{index+1} - {step.Label}</option>
                                            })}
                                        </select>):(<div>
                                            {session.ProcessStep + 1} - {process.Steps[session.ProcessStep].Label}
                                        </div>)}
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
                        <div className="ilv-card mb-5">
                            {session.Status == 0 ? <div className="ilv-card-header text-center">
                                <i>{Messages.get("LabelNotStarted")}</i>
                                {isCoach ? <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-success mt-2" onClick={this.startSession}>{Messages.get("LabelStartSession")}</button>:""}
                            </div>:(session.Status < 10 ? <div className="ilv-card-header text-center">
                                <small>{Messages.get("LabelSessionDuration")}:</small>
                                <h1 className="mb-3" ref="duration-counter"></h1>
                                {isCoach ? <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-destructive" onClick={this.finishSession}>{Messages.get("LabelEndSession")}</button>:""}
                            </div>:<div className="ilv-card-header text-center">
                                <small>{Messages.get("LabelSessionDuration")}:</small>
                                <h1 className="mb-3">
                                    {currentDurationString}
                                </h1>
                                <i>{Messages.get("LabelFinished")}</i>
                            </div>)}
                            {latestFinished && isCoach ? <div className="ilv-card-block">
                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-link" onClick={this.newSession}>{Messages.get("LabelNewSession")}</button>
                            </div> : ""}
                        </div>

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

