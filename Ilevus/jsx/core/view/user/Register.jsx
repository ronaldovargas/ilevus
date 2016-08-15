
var React = require("react");
var Link = require("react-router").Link;
var UserStore = require("ilevus/jsx/core/store/User.jsx");
var ErrorAlert = require("ilevus/jsx/core/widget/ErrorAlert.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Toastr = require("toastr");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {};
    },
    componentDidMount() {
        var me = this;
        UserStore.on("sync", model => {
            Toastr.success(Messages.get("TextAccountCreated"));
            me.context.router.push("/login");
        }, me);
    },
    componentWillUnmount() {
        UserStore.off(null, null, this);
    },
    onSubmit(evt) {
        evt.preventDefault();
        var data = {
            Email: this.refs['email'].value,
            Name: this.refs['name'].value,
            Surname: this.refs['surname'].value,
            Password: this.refs['password'].value,
            ConfirmPassword: this.refs['passwordconfirm'].value
        };
        console.log(data);
        UserStore.dispatch({
            action: UserStore.ACTION_SIGNUP,
            data: data
        });
    },

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-10 offset-sm-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
                        <div className="ilv-card m-t-3">
                            <div className="ilv-card-header">
                                <h3>{Messages.get("TextSignUpTitle")}</h3>
                            </div>
                            <div className="ilv-card-body">
                                <form onSubmit={this.onSubmit}>
                                    <div className="row">
                                        <fieldset className="ilv-form-group col-md-6">
                                            <label className="ilv-form-label" htmlFor="name">{Messages.get("LabelFirstName")}</label>
                                            <input className="ilv-form-control ilv-form-control-lg" id="name" name="name" type="text" ref="name" />
                                        </fieldset>
                                        <fieldset className="ilv-form-group col-md-6">
                                            <label className="ilv-form-label" htmlFor="surname">{Messages.get("LabelSurname")}</label>
                                            <input className="ilv-form-control ilv-form-control-lg" id="surname" name="surname" type="text" ref="surname" />
                                        </fieldset>
                                    </div>

                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="email" name="email" type="email" ref="email" />
                                    </fieldset>

                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="password">{Messages.get("LabelPassword")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="password" name="password" type="password" ref="password" />
                                    </fieldset>

                                    <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="passwordconfirm">{Messages.get("LabelPasswordConfirm")}</label>
                                        <input className="ilv-form-control ilv-form-control-lg" id="passwordconfirm" name="passwordconfirm" type="password" ref="passwordconfirm" />
                                    </fieldset>

                                    <ErrorAlert store={UserStore} />

                                    <p className="ilv-text-small">{Messages.get("TextSignUpAgreement")}</p>
                                    <fieldset>
                                        <input
                                               className="ilv-btn ilv-btn-lg ilv-btn-primary ilv-btn-block"
                                               type="submit"
                                               value={Messages.get("ActionCreateMyAccount")} />
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    
                        <div className="ilv-text-xs-center m-y-3">
                            <p><Link className="ilv-font-weight-semibold" to="/login">{Messages.get("TextQHaveAccount")} {Messages.get("TextSignIn")}</Link></p>
                            <small className="text-muted">
                                ©2016 Ilevus. {Messages.get("TextAllRightsReserved")}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
