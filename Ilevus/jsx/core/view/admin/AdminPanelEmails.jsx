
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true
        };
    },
    componentDidMount() {
        var me = this;
        SystemStore.on("retrieve-config", (config) => {
            me.setState({
                loading: false,
                config: config
            });
            console.log(config);
        }, me);

        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_CONFIG
        });
    },
    componentWillUnmount() {
        SystemStore.off(null, null, this);
    },

    updateLanguage(event) {
        $(this.refs["culture-save"]).addClass("loading").attr("disabled", "disabled");
        var data = {
            Culture: this.refs['account-culture'].value
        };

        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_CULTURE,
            data: data
        });
    },

    updatePassword(event) {
        $(this.refs["setpwd-save"]).addClass("loading").attr("disabled", "disabled");
        var data = {
            OldPassword: this.refs['setpwd-oldpassword'].value,
            NewPassword: this.refs['setpwd-password'].value,
            ConfirmPassword: this.refs['setpwd-passwordconfirm'].value
        };

        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PASSWORD,
            data: data
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (
            <div>
                
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>
                            {Messages.get("LabelWelcomeEmail")}
                        </strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editAccountFormPassword">{Messages.get("LabelPasswordCurrent")}</label>
                                        <input className="ilv-form-control" type="password" id="editAccountFormPassword" ref="setpwd-oldpassword" />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editAccountFormNewPassword">{Messages.get("LabelPasswordNew")}</label>
                                        <input className="ilv-form-control" type="password" id="editAccountFormNewPassword" ref="setpwd-password" />
                                    </div>

                                    <div className="ilv-form-group m-b-0">
                                        <label className="ilv-form-label" htmlFor="editAccountFormConfirmPassword">{Messages.get("LabelPasswordConfirm")}</label>
                                        <input className="ilv-form-control" type="password" id="editAccountFormConfirmPassword" ref="setpwd-passwordconfirm" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-primary" ref="setpwd-save" onClick={this.updatePassword}>
                            {Messages.get("ActionChangePassword")}
                        </button>
                    </div>
                </div>

            </div>
        );
    }
});
