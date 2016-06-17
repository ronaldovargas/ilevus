
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
                    <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-xl-6 col-xl-offset-3">
                        <form className="p-t-3" onSubmit={this.onSubmit}>
                            <h3>{Messages.get("TextSignUpTitle")}</h3>
                            <p className="m-y-0">
                                {Messages.get("TextSignUpDescription")}
                            </p>
                            <p>
                                {Messages.get("TextQHaveAccount")} <Link to="/login">
                                {Messages.get("TextSignIn")}</Link>
                           </p>

                            <div className="form-group row">
                                <div className="col-xs-12 col-sm-6">
                                    <label className="form-element-label" htmlFor="name">{Messages.get("LabelFirstName")}</label>
                                    <input className="form-element form-element-lg" id="name" name="name" type="text" ref="name" />
                                </div>
                                <div className="col-xs-12 col-sm-6">
                                    <label className="form-element-label" htmlFor="surname">{Messages.get("LabelSurname")}</label>
                                    <input className="form-element form-element-lg" id="surname" name="surname" type="text" ref="surname" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-element-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                                <input className="form-element form-element-lg" id="email" name="email" type="email" ref="email" />
                            </div>
                            <div className="form-group">
                                <label className="form-element-label" htmlFor="password">{Messages.get("LabelPassword")}</label>
                                <input className="form-element form-element-lg" id="password" name="password" type="password"  ref="password" />
                            </div>
                            <div className="form-group">
                                <label className="form-element-label" htmlFor="passwordconfirm">{Messages.get("LabelPasswordConfirm")}</label>
                                <input className="form-element form-element-lg" id="passwordconfirm" name="passwordconfirm" type="password"  ref="passwordconfirm" />
                            </div>

                            <ErrorAlert store={UserStore} />
                            
                            <p className="small">
                                {Messages.get("TextSignUpAgreement")}
                            </p>
                            <div className="form-group row">
                                <div className="col-xs-12 col-sm-6">
                                    <input className="btn btn-lg btn-brand btn-block" type="submit" value={Messages.get("LabelSignUp")} />
                                </div>
                            </div>
                        </form>

                        <div className="text-xs-center">
                            <p className="text-muted small p-t-2">
                                ©2016 Ilevus. {Messages.get("TextAllRightsReserved")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
