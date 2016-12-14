
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var Marked = require("marked");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var MeetingSchedule = require("ilevus/jsx/core/widget/user/MeetingSchedule.jsx");
var UserContactInfo = require("ilevus/jsx/core/widget/user/UserContactInfo.jsx");

var Analytics = require("ilevus/jsx/core/util/Analytics.js");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

var Languages = require("ilevus/jsx/core/util/Languages.json");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            model: null
        };
    },
    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("retrieve", (model) => {
            me.setState({
                model: model
            });
        }, me);

        UserStore.dispatch({
            action: UserStore.ACTION_RETRIEVE,
            data: this.props.params.id
        });
    },
    componentWillUnmount() {
        UserStore.off(null, null, this);
    },
    componentDidUpdate() {
        /*$('[data-toggle="tooltip"]').tooltip({
            animation: true
        });*/
    },

    openMeetingSchedule() {
        
    },

    openPhoneDialog(event) {
        event && event.preventDefault();
        Analytics.sendPhoneRequestEvent();
        Modal.detailsModal(Messages.get("LabelContact"), <UserContactInfo user={this.state.model.attributes} />);
    },

    render() {
        if (!this.state.model) {
            return <LoadingGauge />;
        }

        var user = this.state.model;
        var userLocation = user.get("Country");
        if (user.get("County")) {
            userLocation = user.get("County") + ", " + userLocation;
        }
        if (user.get("City")) {
            userLocation = user.get("City") + ", " + userLocation;
        }
        userLocation = S(userLocation);
        var industry = S(user.get("Professional").Professional.Industry);
        var headline = S(user.get("Professional").Professional.Headline);
        var summary = S(user.get("Professional").Professional.Summary);
        var specialties = S(user.get("Professional").Professional.Specialties);

        var educations = user.get("Professional").Professional.Education || [];
        var careers = user.get("Professional").Professional.Career || [];
        var services = user.get("Professional").Professional.Services || [];

        var spokenLanguages = user.get("Professional").Professional.SpokenLanguages || [];

        return (<div className="my-3" role="banner">
            <div className="container">
                <div className="row">
                    <div className="col-xs-8">
                        <div className="mb-3">
                            <div className="ilv-media">
                                <div className="ilv-media-left ilv-text-xs-center mr-1">
                                    <div className="ilv-avatar-fluid ilv-avatar-fluid-public"
                                        style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")" }}
                                    />
                                </div>
                                <div className="ilv-media-body">
                                    <span className="h1">
                                        {user.get("Name")} {user.get("Surname")}
                                    </span>
                                    <p>
                                        <span className="ilv-tag ilv-tag-warning ml-0">Premium</span>
                                        <span className="ilv-text-large ilv-font-weight-semibold">{industry.isEmpty() ? "":industry.s}</span>
                                    </p>
                                    <p className="ilv-text-small">
                                        {specialties.isEmpty() ? "":"Especialista em: "+specialties.s}
                                    </p>
                                    <p className="ilv-text-small">
                                        {userLocation.isEmpty() ? "":userLocation.s}
                                    </p>
                                    <p>
                                        <span className="ilv-btn ilv-btn-sm ilv-btn-success mr-1">
                                            4.9 <sup>/ 5.0</sup>
                                        </span>
                                        <a className="ilv-text-small" href="">{Messages.format("TextEvaluations", [32])}</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                                                
                        {headline.isEmpty() ? "" :
                            <div className="mb-3">
                                <h4>{Messages.get("LabelHeadline")}</h4>
                                <hr />
                                {headline.s}
                            </div>              
                        }
                        <div className="mb-3">
                            <h4>{Messages.get("LabelBookMeeting")}</h4>
                            <MeetingSchedule user={user} />
                        </div>

                        <div className="mb-3">
                            <h4>{Messages.get("LabelExperience")}</h4>
                            <hr />
                            <div className="ilv-media-list">
                                {careers.length > 0
                                    ?
                                        <div className="ilv-media py-1">
                                            <div className="ilv-media-left mr-1">
                                                <i className="ilv-icon material-icons md-24">&#xE8F9;</i>
                                            </div>
                                            <div className="ilv-media-body">
                                                <p className="h5">{Messages.get("TextCareer")}</p>
                                                {careers.map((career, index) => {
                                                    return <div key={"education-" + index}>
											            <strong>{career.Role} </strong>
                                                        <span>
                                                            em {career.Institution} - {career.Location}
                                                            {career.Finished
                                                                ? ", " + career.Begin + (career.End ? " " + Messages.get("LabelTo") + " " + career.End : "")
                                                                : ", " + Messages.get("LabelStartedAt") + " " + career.Begin + " " + Messages.get("LabelTo") + Messages.get("TextPresent")
                                                            }.
                                                        </span>
                                                    </div>;
                                                })}
                                            </div>
                                        </div>
                                    :""
                                }

                                {educations.length > 0
                                    ?
                                        <div className="ilv-media py-1">
                                            <div className="ilv-media-left mr-1">
                                                <i className="ilv-icon material-icons md-24">&#xE80C;</i>
                                            </div>
                                            <div className="ilv-media-body">
                                                <p className="h5">{Messages.get("TextEducation")}</p>
                                                {educations.map((education, index) => {
                                                    return <div key={"education-" + index}>
											            <strong>{Messages.get("EducationType" + education.Type)} em {education.Area} </strong>
                                                        <span>
                                                            na {education.Institution}
                                                            {education.Finished
                                                                ? ", " + education.Begin + (education.End ? " " + Messages.get("LabelTo") + " " + education.End : "")
                                                                : ", " + Messages.get("LabelStartedAt") + " " + education.Begin
                                                            }.
                                                        </span>
                                                    </div>;
                                                })}
                                            </div>
                                        </div>
                                    :""
                                }

                                {summary.isEmpty()
                                    ? ""
                                    :<div className="ilv-media py-1">
                                        <div className="ilv-media-left mr-1">
                                            <i className="ilv-icon material-icons md-24">&#xE851;</i>
                                        </div>
                                        <div className="ilv-media-body">
                                            <p className="h5">{Messages.get("LabelAboutMe")}</p>
                                            <div dangerouslySetInnerHTML={{__html: Marked(summary.s)}} />
                                        </div>
                                    </div>
                                }

                                {spokenLanguages.length > 0
                                    ?
                                        <div className="ilv-media py-1">
                                            <div className="ilv-media-left mr-1">
                                                <i className="ilv-icon material-icons md-24">&#xE894;</i>
                                            </div>
                                            <div className="ilv-media-body">
                                                <p className="h5">{Messages.get("LabelLanguages")}</p>
                                                {spokenLanguages.map((spokenLanguage, index) => {
                                                    var lang = Languages.Mapped[spokenLanguage];
                                                    return <span key={"spokenLanguage-" + index}>
                                                        {lang.nativeName}{lang.name != lang.nativeName ? " ("+lang.name+")":""}
                                                        {spokenLanguages.length > 1 && index < (spokenLanguages.length - 1) ? ", " :"."}
                                                    </span>;
                                                })}
                                            </div>
                                        </div>
                                    :""
                                }
                            </div>

                        </div>
                        
                        {services.length > 0
                            ?
                            <div className="mb-3">
                                <h4>{Messages.get("TextOfferedServices")}</h4>
                                <div className="ilv-card">
                                    <div className="ilv-card-body">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <table className="ilv-table ilv-table-sm ilv-table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>{Messages.get("LabelService")}</th>
                                                            <th className="ilv-text-xs-right">{Messages.get("LabelPrice")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {services.map((service, index) => {
                                                            return (
                                                                <tr key={"service-" + index}>
                                                                    <td className="ilv-font-weight-semibold">{service.Name}</td>
                                                                    <td className="ilv-text-xs-right">{service.Price}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-4">
                                                <p className="ilv-font-weight-bold">{Messages.get("LabelTip")}</p>
                                                <p>{Messages.get("TextOfferedServicesHelp")}</p>
                                                <button className="ilv-btn ilv-btn-block ilv-btn-primary">
                                                    <i className="ilv-icon material-icons md-18">&#xE0BE;</i>{Messages.get("ActionSendMessage")}
                                                </button>
                                            </div>
                                        </div>                                                      
                                    </div>
                                </div>
                            </div>
                            :""
                        }
                    </div>
                    <div className="col-xs-4">
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-form-group">
                                    <button className="ilv-btn ilv-btn-primary ilv-btn-lg ilv-btn-block" onClick={this.openMeetingSchedule}>
                                        <i className="ilv-icon material-icons md-18">&#xE878;</i>{Messages.get("ActionBookMeeting")}
                                    </button>
                                </div>
                                <div className="text-xs-center">
                                    <small className="text-muted">{Messages.get("TextBookingWillNotCharge")}</small>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <Link className="ilv-btn ilv-btn-block ilv-btn-neutral" to={"/notifications/messages/"+user.get("Id")}>
                                            {Messages.get("ActionSendMessage")}
                                        </Link>
                                    </div>
                                    <div className="col-md-6">
                                        {!user.get("PhoneNumber") ? "":<button className="ilv-btn ilv-btn-block ilv-btn-neutral" onClick={this.openPhoneDialog}>
                                            {Messages.get("ActionRequestPhone")}
                                         </button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs-center">
                            <button className="ilv-btn ilv-btn-clean">
                                <i className="ilv-icon material-icons md-18">&#xE87E;</i>{Messages.get("LabelSaveAsFavorite")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
});
