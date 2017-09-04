
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var AdSideBar = require("ilevus/jsx/core/widget/AdSideBar.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var UserContactInfo = require("ilevus/jsx/core/widget/user/UserContactInfo.jsx");

var Analytics = require("ilevus/jsx/core/util/Analytics.js");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    getInitialState() {
        return {
            models: null,
            term: null,
            total: 0,
            receivedsAssessments: 0
        };
    },
    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("search", (response) => {
            me.setState({
                models: response.data,
                term: me.props.params.term,
                total: response.total
            });
        }, me);

        UserStore.dispatch({
            action: UserStore.ACTION_SEARCH,
            data: {
                keywords: me.props.params.term
            }
        });
        
    },
    componentWillUnmount() {
        UserStore.off(null, null, this);        
    },
    componentWillReceiveProps(newProps) {
        UserStore.dispatch({
            action: UserStore.ACTION_SEARCH,
            data: {
                keywords: newProps.params.term
            }
        });
    },
    componentDidUpdate() {
        /*$('[data-toggle="tooltip"]').tooltip({
            animation: true
        });*/
    },

    openPhoneDialog(user, event) {
        event && event.preventDefault();
        Analytics.sendPhoneRequestEvent();
        Modal.detailsModal(Messages.get("LabelContact"), <UserContactInfo user={user} />);
    },

    renderStars(model, qtde) {
        var tmp = [];
        var cinzas = [];
        for (var i = 0; i < qtde; i++) {
            tmp.push(i);
        }

        for (var i = 0; i < 5-qtde; i++) {
            cinzas.push(i);
        }

        var stars = tmp.map(function (i) {
            return (<i className="ilv-rating-item-no-hover material-icons" style={{fontSize: "15px"}}>&#xE838;</i>);
        });

        var starsCinzas = cinzas.map(function (i) {
            return (<i className="ilv-rating-item-no-hover material-icons" style={{ fontSize: "15px", color: "#22C8EB" } }>&#xE838;</i>);
        });

        return (
                <div className="ilv-rating" style={{ marginLeft: "5px" }}>
                    <div className="ilv-rating-list">
                        {starsCinzas}{stars}
                    </div>
                </div>
        )
    },

    renderModels() {
        if (!(this.state.models.length > 0)) {
            return (
                <div className="ilv-blankslate ilv-blankslate-lg">
                    <h3>{Messages.get("TextUserNotFound")}</h3>
                    <p>{Messages.get("TextSearchVerifyTerms")}</p>
                </div>
            );
        }

        return <div>
            {this.state.models.map((model, index) => {
                var industry = S(model.Professional.Professional.Industry);
                var headline = S(model.Professional.Professional.Headline);
                return (
                    <div className="py-3" style={{ borderBottom: "1px solid #eee" }} key={"search-result-"+index}>
                        <div className="ilv-media" key={"result-"+index}>
                            <div className="ilv-media-left ilv-text-xs-center mr-3">
                                <div className="ilv-avatar-fluid ilv-avatar-fluid-xl"
                                    style={{marginRight: "10px", backgroundImage: "url(" + (S(model.Image).isEmpty() ? UserIcon : model.Image) + ")" }} />
                            </div>
                            <div className="ilv-media-body">
                                <div style={{marginBottom: ".25rem"}}>
                                    <Link to={"/profile/"+model.Id}><strong>{model.Name} {model.Surname}</strong></Link>
                                </div>
                                <div>
                                    <p className="ilv-text-small">
                                        <span className="ilv-tag ilv-tag-warning ml-0">{model.Premium && model.Premium.Active ? 'Premium' : ''}</span>
                                        { industry.isEmpty() ? "" : industry.s }
                                    </p>
                                    
                                    <Link className="small ilv-nav-link" to={"/assessments?userId=" + model.Id }>{Messages.format("TextEvaluations", [model.Assessments])}</Link>
                                    {this.renderStars(model, model.MediaRating)}
                                </div>
                            </div>
                            <div className="ilv-media-right ilv-text-small">
                                <p style={{marginBottom: ".25rem"}}><a href=""><i className="ilv-icon m-r-1 material-icons md-18">&#xE878;</i><span className="hidden-sm-down">{Messages.get("ActionRequestMeeting")}</span></a></p>
                                <p style={{marginBottom: ".25rem"}}>
                                    <Link to={"/notifications/messages/"+model.Id}>
                                        <i className="ilv-icon m-r-1 material-icons md-18">&#xE0BE;</i>
                                        <span className="hidden-sm-down">{Messages.get("ActionSendMessage")}</span>
                                    </Link>
                                </p>
                                {!model.PhoneNumber ? "" :(<p style={{ marginBottom: ".25rem" } }>
                                    <a href="" onClick={this.openPhoneDialog.bind(this, model)}>
                                        <i className="ilv-icon m-r-1 material-icons md-18">&#xE0B0;</i>
                                        <span className="hidden-sm-down">{Messages.get("ActionRequestPhone")}</span>
                                    </a>
                                </p>)}
                            </div>
                        </div>
                    </div>
                );
            })} 
        </div>;
    },

    render() {
        if (!this.state.models) {
            return <LoadingGauge />;
        }

        return (
            <div>                
                <div className="my-5" role="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="ilv-media ilv-media-middle mb-3">
                                    <div className="ilv-media-body">
                                        <h2>{this.state.term}</h2>
                                        <p className="ilv-text-small">{Messages.format("TextSearchNumberOfResults", [this.state.total, this.state.term])}</p>
                                    </div>
                                </div>

                                {this.renderModels()}
                            </div>
                            <div className="col-3 hidden-sm-down">
                                <AdSideBar keyword={this.props.params.term} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
