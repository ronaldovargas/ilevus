
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
            total: 0
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
                                    style={{ backgroundImage: "url(" + (S(model.Image).isEmpty() ? UserIcon : model.Image) + ")" }} />
                            </div>
                            <div className="ilv-media-body">
                                <div style={{marginBottom: ".25rem"}}>
                                    <Link to={"/profile/"+model.Id}><strong>{model.Name} {model.Surname}</strong></Link>
                                </div>
                                <div>
                                    <p className="ilv-text-small">
                                        <span className="ilv-tag ilv-tag-warning ml-0">Premium</span>
                                        { industry.isEmpty() ? "" : industry.s }
                                    </p>
                                    <span className="ilv-tag ilv-tag-success ml-0">4.9 <sup>/ 5.0</sup></span>
                                    <a className="small" href="">{Messages.format("TextEvaluations", [32])}</a>
                                </div>
                            </div>
                            <div className="ilv-media-right ilv-text-small" style={{minWidth: "12rem"}}>
                                <p style={{marginBottom: ".25rem"}}><a href=""><i className="ilv-icon m-r-1 material-icons md-18">&#xE878;</i>{Messages.get("ActionRequestMeeting")}</a></p>
                                <p style={{marginBottom: ".25rem"}}>
                                    <Link to={"/notifications/messages/"+model.Id}>
                                        <i className="ilv-icon m-r-1 material-icons md-18">&#xE0BE;</i>
                                        {Messages.get("ActionSendMessage")}
                                    </Link>
                                </p>
                                {!model.PhoneNumber ? "" :(<p style={{ marginBottom: ".25rem" } }>
                                    <a href="" onClick={this.openPhoneDialog.bind(this, model)}>
                                        <i className="ilv-icon m-r-1 material-icons md-18">&#xE0B0;</i>{Messages.get("ActionRequestPhone")}
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
                            <div className="col-3">
                                <AdSideBar keyword={this.props.params.term} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
