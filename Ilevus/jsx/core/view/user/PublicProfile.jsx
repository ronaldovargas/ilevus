
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var Marked = require("marked");
var React = require("react");
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

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

        return (<div className="m-y-3" role="banner">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ilv-card">
                            <div className="ilv-card-body">
                                <div className="ilv-media">
                                    <div className="ilv-media-left ilv-text-xs-center">
                                        <div className="ilv-avatar-fluid ilv-avatar-fluid-xl"
                                            style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")" }}
                                        />
                                    </div>
                                    <div className="ilv-media-body">
                                        <span className="h2">
                                            {user.get("Name")} {user.get("Surname")}
                                        </span>
                                        <span className="ilv-tag ilv-tag-warning">Premium</span>
                                        <div className="ilv-text-large ilv-font-weight-semibold">
                                            {industry.isEmpty() ? "":industry.s}
                                        </div>
                                        <div className="ilv-text-small">
                                            {specialties.isEmpty() ? "":"Especialista em: "+specialties.s}
                                        </div>
                                        <p className="ilv-text-small">
                                            {userLocation.isEmpty() ? "":userLocation.s}
                                        </p>
                                        {headline.isEmpty() ? "":<div>{headline.s}</div>}
                                    </div>
                                    <div className="ilv-media-right">
                                        <div className="ilv-text-xs-center">
                                            <span className="ilv-btn ilv-btn-success">
                                                4.9 <sup>/ 5.0</sup>
                                            </span>
                                            <p>
                                                <a className="ilv-text-small" href="">{Messages.format("TextEvaluations", [32])}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-card-footer">
                                <button className="ilv-btn ilv-btn-primary">
                                    <i className="ilv-icon material-icons md-18">&#xE878;</i>
                                    {Messages.get("ActionRequestMeeting")}
                                </button>

                                <button className="ilv-btn ilv-btn-primary">
                                    <i className="ilv-icon material-icons md-18">&#xE0BE;</i>
                                    {Messages.get("ActionSendMessage")}
                                </button>
                                
                                <button className="ilv-btn ilv-btn-neutral">
                                    <i className="ilv-icon material-icons md-18">&#xE0B0;</i>
                                    {Messages.get("ActionRequestPhone")}
                                </button>

                                <div className="ilv-btn-group pull-sm-right">
                                    <button className="ilv-btn ilv-btn-clean">
                                        <i className="ilv-icon material-icons md-18">&#xE80D;</i>
                                        {Messages.get("LabelShare")}
                                    </button>

                                    <button className="ilv-btn ilv-btn-clean">
                                        <i className="ilv-icon material-icons md-18">&#xE866;</i>
                                        {Messages.get("LabelSave")}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="ilv-card">
                            <div className="ilv-card-header">
                                <strong>{Messages.get("LabelExperience")}</strong>
                            </div>
                            <div className="ilv-card-body">
                                <div className="ilv-media-list ilv-media-list-bordered">
                                    {services.length > 0
                                        ?
                                            <div className="ilv-media p-b-2">
                                                <div className="ilv-media-left m-r-1">
                                                    <i className="ilv-icon material-icons md-24">&#xE0AF;</i>
                                                </div>
                                                <div className="ilv-media-body">
                                                    <p className="h4">{Messages.get("TextOfferedServices")}</p>
                                                    {services.map((service, index) => {
                                                        return <div key={"service-" + index}>
											                <strong>{service.Name} </strong>
                                                        </div>;
                                                    })}
                                                </div>
                                            </div>
                                        :""
                                    }

                                    {careers.length > 0
                                        ?
                                            <div className="ilv-media p-y-2">
                                                <div className="ilv-media-left m-r-1">
                                                    <i className="ilv-icon material-icons md-24">&#xE8F9;</i>
                                                </div>
                                                <div className="ilv-media-body">
                                                    <p className="h4">{Messages.get("TextCareer")}</p>
                                                    {careers.map((career, index) => {
                                                        return <div key={"education-" + index}>
											                <strong>{career.Role} </strong>
                                                            <span>
                                                                em {career.Institution} - {career.Location}, {career.Finished
                                                                    ? career.Begin + " " + Messages.get("LabelTo") + " " + career.End
                                                                    : Messages.get("LabelStartedAt") + " " + career.Begin
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
                                            <div className="ilv-media p-y-2">
                                                <div className="ilv-media-left m-r-1">
                                                    <i className="ilv-icon material-icons md-24">&#xE80C;</i>
                                                </div>
                                                <div className="ilv-media-body">
                                                    <p className="h4">{Messages.get("TextEducation")}</p>
                                                    {educations.map((education, index) => {
                                                        return <div key={"education-" + index}>
											                <strong>{Messages.get("EducationType" + education.Type)} em {education.Area} </strong>
                                                            <span>
                                                                na {education.Institution}, {education.Finished
                                                                    ? education.Begin + " " + Messages.get("LabelTo") + " " + education.End
                                                                    : Messages.get("LabelStartedAt") + " " + education.Begin
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
                                        :<div className="ilv-media p-y-2">
                                            <div className="ilv-media-left m-r-1">
                                                <i className="ilv-icon material-icons md-24">&#xE851;</i>
                                            </div>
                                            <div className="ilv-media-body">
                                                <p className="h4">{Messages.get("LabelAboutMe")}</p>
                                                <div dangerouslySetInnerHTML={{__html: Marked(summary.s)}} />
                                            </div>
                                        </div>
                                    }

                                    {spokenLanguages.length > 0
                                        ?
                                            <div className="ilv-media p-t-2">
                                                <div className="ilv-media-left m-r-1">
                                                    <i className="ilv-icon material-icons md-24">&#xE894;</i>
                                                </div>
                                                <div className="ilv-media-body">
                                                    <p className="h4">{Messages.get("LabelLanguages")}</p>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
});
