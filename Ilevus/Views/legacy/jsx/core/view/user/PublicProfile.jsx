﻿
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var Marked = require("marked");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");
var ServicesToHire = require("./../../widget/user/ServiceListToHire");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");
var FinancialStore = require("ilevus/jsx/core/store/Financial.jsx");
var AssessmentsStore = require("ilevus/jsx/core/store/Assessments.jsx");

var DocumentTitle = require('react-document-title');
var DocMeta = require('react-doc-meta');

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var MeetingSchedule = require("ilevus/jsx/core/widget/user/MeetingSchedule.jsx");
var UserContactInfo = require("ilevus/jsx/core/widget/user/UserContactInfo.jsx");

var Analytics = require("ilevus/jsx/core/util/Analytics.js");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

var Languages = require("ilevus/jsx/core/util/Languages.json");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },
    getInitialState() {
        return {
            model: null,
            receivedsAssessments: 0,
            favorited: UserSession.get("logged") ? (UserSession.get("user").Favorites.indexOf(this.props.params.id) >= 0) : false,
            mediaRating: 0
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

        AssessmentsStore.on("receivedassessmentget", (receiveds) => {
            console.log('recebidas', receiveds);
            me.setState({
                receivedsAssessments: receiveds ? receiveds.length : 0,
                mediaRating: receiveds && receiveds[0] ? receiveds[0].MediaRating : 0
            });
        }, me);

        UserSession.on("update", () => {
            me.setState({
                favorited: UserSession.get("logged") ? (UserSession.get("user").Favorites.indexOf(this.props.params.id) >= 0) : false
            });
        });

        UserStore.dispatch({
            action: UserStore.ACTION_RETRIEVE,
            data: this.props.params.id
        });

        AssessmentsStore.dispatch({
            action: AssessmentsStore.ACTION_USER_ASSESSMENTS,
            data: this.props.params.id
        });

    },
    componentWillUnmount() {
        UserStore.off(null, null, this);
        UserSession.off(null, null, this);
        AssessmentsStore.off(null, null, this);
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

    favoriteUser(event) {
        event && event.preventDefault();
        if (this.state.favorited) {
            UserSession.dispatch({
                action: UserSession.ACTION_UNFAVORITE_USER,
                data: this.props.params.id
            });
        } else {
            UserSession.dispatch({
                action: UserSession.ACTION_FAVORITE_USER,
                data: this.props.params.id
            });
        }
    },
    toHireService(event) {
        event && event.preventDefault();

        FinancialStore.dispatch({
            action: FinancialStore.ACTION_TO_HIRE_SERVICE,
            data: this.props.params.id
        });
        this.context.router.push("/checkout");

    },

    renderStars() {
        var qtde = this.state.mediaRating;

        var tmp = [];
        var cinzas = [];
        for (var i = 0; i < qtde; i++) {
            tmp.push(i);
        }

        for (var i = 0; i < 5 - qtde; i++) {
            cinzas.push(i);
        }

        var stars = tmp.map(function (i) {
            return (<i className="ilv-rating-item-no-hover material-icons">&#xE838;</i>);
        });

        var starsCinzas = cinzas.map(function (i) {
            return (<i className="ilv-rating-item-no-hover material-icons" style={{ color: "#22C8EB" }}>&#xE838;</i>);
        });

        return (
            <div className="ilv-rating">
                <div className="ilv-rating-list">
                    {starsCinzas}{stars}
                </div>
            </div>
        )
    },

    render() {
        if (!this.state.model) {
            return <LoadingGauge />;
        }

        var user = this.state.model;
        console.log('state model', user);
        var scheduleConfig = user.get("ScheduleConfig");
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
        var isPremium = false;
        try {
            isPremium = user.get("Premium").Premium.Active || false
        } catch (ex) {
            console.error(ex);
        }

        var listaKeys = [];
        listaKeys.push(S(user.get("Professional").Professional.Country));
        listaKeys.push(S(user.get("Professional").Professional.County));
        listaKeys.push(S(user.get("Professional").Professional.City));
        for (var i = 0; i < services.length; i++) {
            listaKeys.push(services[i].Name);
        }

        var tags = [
            { name: "description", content: summary },
            { name: "keywords", content: listaKeys.join() },
            { name: "author", content: 'Ilevus' },
            { name: "Author", content: 'Ilevus' }
            //{itemProp: "name", content: "The Name or Title Here"},
            //{itemProp: "description", content: "This is the page description"},
            //{itemProp: "image", content: "http://www.example.com/image.jpg"},
            //{name: "twitter:card", content: "product"},
            //{name: "twitter:site", content: "@publisher_handle"},
            //{name: "twitter:title", content: "Page Title"},
            //{name: "twitter:description", content: "Page description less than 200 characters"},
            //{name: "twitter:creator", content: "@author_handle"},
            //{name: "twitter:image", content: "http://www.example.com/image.html"},
            //{name: "twitter:data1", content: "$3"},
            //{name: "twitter:label1", content: "Price"},
            //{name: "twitter:data2", content: "Black"},
            //{name: "twitter:label2", content: "Color"},
            //{property: "og:title", content: "Title Here"},
            //{property: "og:type", content: "article"},
            //{property: "og:url", content: "http://www.example.com/"},
            //{property: "og:image", content: "http://example.com/image.jpg"},
            //{property: "og:description", content: "Description Here"},
            //{property: "og:site_name", content: "Site Name, i.e. Moz"},
            //{property: "og:price:amount", content: "15.00"},
            //{property: "og:price:currency", content: "USD"},
            //{weirdfield: "something", content: "really really cool", hello:"world", meh: "hahaha"}
        ];

        return (
            <DocMeta tags={tags}>
                <DocumentTitle title={'Ilevus | ' + user.get("Name") + ' ' + user.get("Surname")}>
                    <div className="my-5" role="banner">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8 col-sm-8 col-xs-12">
                                    <div className="mb-5 hidden-sm-down">
                                        <div className="ilv-media">
                                            <div className="ilv-media-left ilv-text-xs-center mr-3">
                                                <div title={user.get('Name') + ' ' + user.get('Surname')} className="ilv-avatar-fluid ilv-avatar-fluid-public hidden-sm-up" style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")", width: "5rem", height: "5rem" }} />
                                                <div title={user.get('Name') + ' ' + user.get('Surname')} className="ilv-avatar-fluid ilv-avatar-fluid-public hidden-sm-down" style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")" }} />


                                                <div className="hidden-sm-up">
                                                    <div className="ilv-card" style={{ border: "none", maxWidth: "200px" }}>
                                                        {!UserSession.get("logged") ? "" : <div className="ilv-card-body">
                                                            {this.state.favorited ?
                                                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-neutral" onClick={this.favoriteUser}>
                                                                    <i className="ilv-icon material-icons md-18" style={{ "color": "#F00" }}>&#xE7FD;</i>{Messages.get("LabelSaveAsFollowed")}
                                                                </button>
                                                                :
                                                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-neutral" onClick={this.favoriteUser}>
                                                                    <i className="ilv-icon material-icons md-18">&#xE7FE;</i>{Messages.get("LabelSaveAsFollow")}
                                                                </button>
                                                            }
                                                        </div>}
                                                        <div className="ilv-card-footer" style={{ borderTop: "none" }}>
                                                            <div className="row">
                                                                {!UserSession.get("logged") ? "" : <div className="col-12">
                                                                    <Link className="ilv-btn ilv-btn-block ilv-btn-neutral" to={"/coaching/hire/" + user.get("Id")}>{Messages.get("ActionHireProfessional")}
                                                                    </Link>
                                                                </div>}
                                                                {!UserSession.get("logged") ? "" : <div className="col-12 mt-3">
                                                                    <Link className="ilv-btn ilv-btn-block ilv-btn-neutral" to={"/notifications/messages/" + user.get("Id")}>{Messages.get("ActionSendMessage")}
                                                                    </Link>
                                                                </div>}
                                                                {!user.get("PhoneNumber") ? "" :
                                                                    <div className="col-12 mt-3">
                                                                        <button className="ilv-btn ilv-btn-block ilv-btn-neutral" onClick={this.openPhoneDialog}>
                                                                            {Messages.get("ActionRequestPhone")}
                                                                        </button>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ilv-media-body">
                                                <span className="h1">
                                                    {user.get("Name")} {user.get("Surname")}
                                                </span>
                                                <p>
                                                    <span className="ilv-tag ilv-tag-warning ml-0">{isPremium ? 'Premium' : ''}</span>
                                                    <span className="ilv-text-large ilv-font-weight-semibold">{industry.isEmpty() ? "" : industry.s}</span>
                                                </p>
                                                <p className="ilv-text-small">
                                                    {specialties.isEmpty() ? "" : "Especialista em: " + specialties.s}
                                                </p>
                                                <p className="ilv-text-small">
                                                    {userLocation.isEmpty() ? "" : userLocation.s}
                                                </p>
                                                <div>
                                                    <Link className="ilv-nav-link" to={"/assessments?userId=" + user.get("Id")}>
                                                        {this.renderStars()}
                                                        <div className="ilv-rating" style={{ display: "none" }}>
                                                            <div className="ilv-rating-list">
                                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                            </div>
                                                            <div style={{ display: "none" }} className="ilv-rating-label">3.5</div>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <Link className="small ilv-nav-link" to={"/assessments?userId=" + user.get("Id")}>{Messages.format("TextEvaluations", [this.state.receivedsAssessments])}</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-5 hidden-sm-up">
                                        <div className="ilv-media">
                                            <div className="ilv-media-left ilv-text-xs-center mr-3" style={{ width: "30%" }}>
                                                <div title={user.get('Name') + ' ' + user.get('Surname')} className="ilv-avatar-fluid ilv-avatar-fluid-public" style={{ backgroundImage: "url(" + (S(user.get("Image")).isEmpty() ? UserIcon : user.get("Image")) + ")", width: "5rem", height: "5rem" }} />

                                                <div className="hidden-sm-up">
                                                    <div className="ilv-card" style={{ border: "none", width: "200px", marginTop: "110px" }}>
                                                        {!UserSession.get("logged") ? "" : <div className="ilv-card-body">
                                                            {this.state.favorited ?
                                                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-neutral" onClick={this.favoriteUser}>
                                                                    <i className="ilv-icon material-icons md-18" style={{ "color": "#F00" }}>&#xE7FD;</i>{Messages.get("LabelSaveAsFollowed")}
                                                                </button>
                                                                :
                                                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-neutral" onClick={this.favoriteUser}>
                                                                    <i className="ilv-icon material-icons md-18">&#xE7FE;</i>{Messages.get("LabelSaveAsFollow")}
                                                                </button>
                                                            }
                                                        </div>}
                                                        <div className="ilv-card-footer" style={{ borderTop: "none" }}>
                                                            <div className="row">
                                                                {!UserSession.get("logged") ? "" : <div className="col-12">
                                                                    <Link className="ilv-btn ilv-btn-block ilv-btn-neutral" to={"/coaching/hire/" + user.get("Id")}>{Messages.get("ActionHireProfessional")}
                                                                    </Link>
                                                                </div>}
                                                                {!UserSession.get("logged") ? "" : <div className="col-12 mt-3">
                                                                    <Link className="ilv-btn ilv-btn-block ilv-btn-neutral" to={"/notifications/messages/" + user.get("Id")}>{Messages.get("ActionSendMessage")}
                                                                    </Link>
                                                                </div>}
                                                                {!user.get("PhoneNumber") ? "" :
                                                                    <div className="col-12 mt-3">
                                                                        <button className="ilv-btn ilv-btn-block ilv-btn-neutral" onClick={this.openPhoneDialog}>{Messages.get("ActionRequestPhone")}
                                                                        </button>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ilv-media-body">
                                                <span className="h1">{user.get("Name")} {user.get("Surname")}
                                                </span>
                                                <p>
                                                    <span className="ilv-tag ilv-tag-warning ml-0">{isPremium ? 'Premium' : ''}</span>
                                                    <span className="ilv-text-large ilv-font-weight-semibold">{industry.isEmpty() ? "" : industry.s}</span>
                                                </p>
                                                <p className="ilv-text-small">{specialties.isEmpty() ? "" : "Especialista em: " + specialties.s}
                                                </p>
                                                <p className="ilv-text-small">{userLocation.isEmpty() ? "" : userLocation.s}
                                                </p>
                                                <div>
                                                    <div className="ilv-rating">
                                                        <div className="ilv-rating-list">
                                                            <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                            <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                            <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                            <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                            <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                        </div>

                                                    </div>
                                                </div>
                                                <a className="ilv-text-small" href="">{Messages.format("TextEvaluations", [32])}</a>
                                            </div>
                                        </div>
                                    </div>
                                    {headline.isEmpty() ? "" :
                                        <div className="mb-5">
                                            <h4>{Messages.get("LabelHeadline")}</h4>
                                            <hr />
                                            {headline.s}
                                        </div>
                                    }

                                    {!scheduleConfig.Enabled ? "" :
                                        <div className="mb-5">
                                            <h4>{Messages.get("LabelBookMeeting")}</h4>
                                            <MeetingSchedule user={user} />
                                        </div>
                                    }

                                    <div className="mb-5">
                                        <h4>{Messages.get("LabelExperience")}</h4>
                                        <hr />
                                        <div className="ilv-media-list">
                                            {careers.length > 0
                                                ?
                                                <div className="ilv-media py-3">
                                                    <div className="ilv-media-left mr-3">
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
                                                                        : ", " + Messages.get("LabelStartedAt") + " " + career.Begin + " " + Messages.get("LabelTo") + " " + Messages.get("TextPresent")
                                                                    }.
                                                        </span>
                                                            </div>;
                                                        })}
                                                    </div>
                                                </div>
                                                : ""
                                            }

                                            {educations.length > 0
                                                ?
                                                <div className="ilv-media py-3">
                                                    <div className="ilv-media-left mr-3">
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
                                                : ""
                                            }

                                            {summary.isEmpty()
                                                ? ""
                                                : <div className="ilv-media py-3">
                                                    <div className="ilv-media-left mr-3">
                                                        <i className="ilv-icon material-icons md-24">&#xE851;</i>
                                                    </div>
                                                    <div className="ilv-media-body">
                                                        <p className="h5">{Messages.get("LabelAboutMe")}</p>
                                                        <div dangerouslySetInnerHTML={{ __html: Marked(summary.s) }} />
                                                    </div>
                                                </div>
                                            }

                                            {spokenLanguages.length > 0
                                                ?
                                                <div className="ilv-media py-3">
                                                    <div className="ilv-media-left mr-3">
                                                        <i className="ilv-icon material-icons md-24">&#xE894;</i>
                                                    </div>
                                                    <div className="ilv-media-body">
                                                        <p className="h5">{Messages.get("LabelLanguages")}</p>
                                                        {spokenLanguages.map((spokenLanguage, index) => {
                                                            var lang = Languages.Mapped[spokenLanguage];
                                                            return <span key={"spokenLanguage-" + index}>
                                                                {lang.nativeName}{lang.name != lang.nativeName ? " (" + lang.name + ")" : ""}
                                                                {spokenLanguages.length > 1 && index < (spokenLanguages.length - 1) ? ", " : "."}
                                                            </span>;
                                                        })}
                                                    </div>
                                                </div>
                                                : ""
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
                                                        <div className="col-lg-8 col-sm-8 col-xs-12">
                                                            <table className="ilv-table ilv-table-sm ilv-table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th>{Messages.get("LabelService")}</th>
                                                                        <th className="ilv-text-xs-right">{Messages.get("LabelPrice")}</th>
                                                                        <th className="ilv-text-xs-right hidden-sm-up"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {services.map((service, index) => {
                                                                        return (
                                                                            <ServicesToHire key={"service-" + index} service={service} />
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="col-4 hidden-sm-down">
                                                            <p className="ilv-font-weight-bold">{Messages.get("LabelTip")}</p>
                                                            <p>{Messages.get("TextOfferedServicesHelp")}</p>
                                                            {!UserSession.get("logged") ? "" : <Link className="ilv-btn ilv-btn-block ilv-btn-primary" to={"/notifications/messages/" + user.get("Id")}>
                                                                <i className="ilv-icon material-icons md-18">&#xE0BE;</i>{Messages.get("ActionSendMessage")}
                                                            </Link>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : ""
                                    }
                                </div>
                                <div className="col-4 hidden-sm-down">
                                    <div className="ilv-card">
                                        {!UserSession.get("logged") ? "" : <div className="ilv-card-body">
                                            {this.state.favorited ?
                                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-neutral" onClick={this.favoriteUser}>
                                                    <i className="ilv-icon material-icons md-18" style={{ "color": "#F00" }}>&#xE7FD;</i>{Messages.get("LabelSaveAsFollowed")}
                                                </button>
                                                :
                                                <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-neutral" onClick={this.favoriteUser}>
                                                    <i className="ilv-icon material-icons md-18">&#xE7FE;</i>{Messages.get("LabelSaveAsFollow")}
                                                </button>
                                            }
                                        </div>}
                                        <div className="ilv-card-footer">
                                            <div className="row">
                                                {!UserSession.get("logged") ? "" : <div className="col-12">
                                                    <Link className="ilv-btn ilv-btn-block ilv-btn-neutral" to={"/coaching/hire/" + user.get("Id")}>
                                                        {Messages.get("ActionHireProfessional")}
                                                    </Link>
                                                </div>}
                                                {!UserSession.get("logged") ? "" : <div className="col-12 mt-3">
                                                    <Link className="ilv-btn ilv-btn-block ilv-btn-neutral" to={"/notifications/messages/" + user.get("Id")}>
                                                        {Messages.get("ActionSendMessage")}
                                                    </Link>
                                                </div>}
                                                {!user.get("PhoneNumber") ? "" :
                                                    <div className="col-12 mt-3">
                                                        <button className="ilv-btn ilv-btn-block ilv-btn-neutral" onClick={this.openPhoneDialog}>
                                                            {Messages.get("ActionRequestPhone")}
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </DocumentTitle>
            </DocMeta>
        );
    }
});
