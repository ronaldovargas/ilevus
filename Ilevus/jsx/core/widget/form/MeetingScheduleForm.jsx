
var moment = require("moment");
var React = require("react");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var ScheduleStore = require("ilevus/jsx/core/store/Schedule.jsx");

var MeetingScheduleForm = React.createClass({
    propTypes: {
        hour: React.PropTypes.object.isRequired,
        user: React.PropTypes.object.isRequired,
        onBook: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            hour: null,
            user: null,
            onBook: null
        };
    },
    getInitialState() {
        return {
            saving: false
        };
    },

    componentDidMount() {
        var me = this;
        ScheduleStore.on("book-meeting", (meeting) => {
            me.setState({
                saving: false
            });
            me.props.onBook(meeting);
        }, me);
        ScheduleStore.on("fail", (meeting) => {
            me.setState({
                saving: false
            });
        }, me);
    },
    componentWillUnmount() {
        ScheduleStore.off(null, null, this);
    },

    bookMeeting(event) {
        event && event.preventDefault();
        this.setState({
            saving: true
        });
        ScheduleStore.dispatch({
            action: ScheduleStore.ACTION_BOOK_MEETING,
            data: {
                UserId: this.props.user.get("Id"),
                CoacheeEmail: this.refs['email'].value,
                CoacheeFullName: this.refs['fullname'].value,
                CoacheePhone: this.refs['phone'].value,
                Subject: this.refs['subject'].value,
                Begin: this.props.hour.format("YYYY-MM-DTHH:mm:00Z")
            }
        });
    },

    render() {
        return(
            <div className="row">
                <div className="col-md-4">
                    <div className="ilv-form-group text-xs-center">
                        <div className="ilv-avatar-fluid ilv-avatar-fluid-xl mb-1"
                            style={{ backgroundImage: "url()" }} />
                        <p className="h3"> {this.props.user.get("Name")} {this.props.user.get("Surname")} </p>
                        
                        <span>{Messages.get("LabelInvestmentPrice")}</span>
                        <p className="h1">R$150,00</p>
                    </div>
                    <hr />
                    <div className="ilv-media-list">
                        <div className="ilv-media">
                            <div className="ilv-media-left">
                                <i className="ilv-text-primary ilv-icon material-icons md-24">&#xE8DF;</i>
                            </div>
                            <div className="ilv-media-body">
                                <label className="ilv-form-label">{Messages.get("LabelWhen")}:</label>
                                {this.props.hour.format("dddd, D/MM/YYYY HH:mm")}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <form onSubmit={this.bookMeeting}>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelCompleteName")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="fullname" />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelEmailAddress")}</label>
                            <input className="ilv-form-control" type="email" spellCheck={false} ref="email" />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelPhoneNumber")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="phone" />
                        </div>
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelInterviewSubject")}</label>
                            <textarea className="ilv-form-control" ref="subject"></textarea>
                        </div>
                        <input className="ilv-btn ilv-btn-lg ilv-btn-primary" type="submit" value={Messages.get("LabelSave")} disabled={this.state.saving} />
                    </form>
                </div>
            </div>
        )
    }
});

module.exports = MeetingScheduleForm;
