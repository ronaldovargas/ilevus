
var _ = require("underscore");
var moment = require("moment");
var numeral = require("numeral");
var React = require('react');

var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

module.exports = createClass({
    propTypes: {
        process: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        isCoach: PropTypes.bool.isRequired,
    },
    getDefaultProps() {
        return {
            process: null
        };
    },

    componentDidMount() {
        this.updateDurationCounter();
    },
    componentWillReceiveProps() {
        this.sessionDuration = null;
    },

    newSession(event) {
        event && event.preventDefault();
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_NEW_SESSION,
            data: this.props.process.Id
        });
    },
    startSession(event) {
        event && event.preventDefault();
        CoachingStore.dispatch({
            action: CoachingStore.ACTION_START_SESSION,
            data: this.props.process.Id
        });
    },
    finishSession(event) {
        event && event.preventDefault();
        var me = this;
        Modal.confirm(Messages.get("TextAreYouSure"), Messages.get("TextSessionFinishConfirmation"), () => {
            CoachingStore.dispatch({
                action: CoachingStore.ACTION_FINISH_SESSION,
                data: me.props.process.Id
            });
            this.sessionDuration = null;
            Modal.hide();
        });
    },

    updateDurationCounter() {
        var el = this.refs["duration-counter"],
            session = this.props.session;
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
        if (this.isMounted())
            _.delay(this.updateDurationCounter, 1000);
    },


    render() {
        var latestFinished = this.props.process.Sessions[this.props.process.Sessions.length - 1].Status >= 10,
            currentDuration = this.props.session.Status >= 10 ? moment.duration(moment(this.props.session.Finished).diff(moment(this.props.session.Started), "seconds"), "seconds") : null,
            currentDurationString = currentDuration ? (
                numeral(currentDuration.hours()).format("00") + ":" +
                numeral(currentDuration.minutes()).format("00") + ":" +
                numeral(currentDuration.seconds()).format("00")
            ) : null
        ;
        return (<div className="ilv-card mb-5">
            {this.props.session.Status == 0 ? <div className="ilv-card-header text-center">
                <i>{Messages.get("LabelNotStarted")}</i>
                {this.props.isCoach ? <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-success mt-2" onClick={this.startSession}>{Messages.get("LabelStartSession")}</button> : ""}
            </div> : (this.props.session.Status < 10 ? <div className="ilv-card-header text-center">
                <small>{Messages.get("LabelSessionDuration")}:</small>
                <h1 className="mb-3" ref="duration-counter"></h1>
                {this.props.isCoach ? <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-destructive" onClick={this.finishSession }>{Messages.get("LabelEndSession")}</button> : ""}
            </div>:<div className="ilv-card-header text-center">
                <small>{Messages.get("LabelSessionDuration")}:</small>
                <h1 className="mb-3">
                    {currentDurationString}
                </h1>
                <i>{Messages.get("LabelFinished")}</i>
            </div>)}
            {latestFinished && this.props.isCoach ? <div className="ilv-card-block">
                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-link" onClick={this.newSession }>{Messages.get("LabelNewSession")}</button>
            </div> : ""}
        </div>);
    }
});
