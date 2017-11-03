
var $ = require("jquery");
var S = require("string");

var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var FinancialStore = require("ilevus/jsx/core/store/Financial.jsx");
var SystemStore = require("ilevus/jsx/core/store/System.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            config: null,
            subscription: null,
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("loaded", () => {
            if (!UserSession.get("logged")) {
                me.context.router.push("/login");
                return;
            }
            if (!UserSession.get("user").IsProfessional) {
                me.context.router.push("/become-a-professional");
                return;
            }
            me.setState({
                loading: (!!me.state.config) && (!!me.state.subscription),
            });
        }, me);

        FinancialStore.on("retrieve-user-subscription", (data) => {
            me.setState({
                loading: UserSession.get("loading") && (!!me.state.config),
                subscription: data,
            });
        }, me);
        FinancialStore.on("update-user-subscription", this.processSubscriptionUpdateResponse, me);

        SystemStore.on("retrieve-config", (data) => {
            me.setState({
                loading: UserSession.get("loading") && (!!me.state.subscription),
                config: data,
            });
        }, me);

        if ((!this.state.loading) && (!UserSession.get("logged"))) {
            me.context.router.push("/login");
            return;
        }

        FinancialStore.dispatch({
            action: FinancialStore.ACTION_RETRIEVE_USER_SUBSCRIPTION,
        });
        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_CONFIG
        });

    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
        FinancialStore.off(null, null, this);
        SystemStore.off(null, null, this);
    },

    componentDidUpdate() {
    },

    digitFilterRe: /[0-9]/,
    digitFilter(event, opts) {
        if (event.key && event.key.match && !event.key.match(this.digitFilterRe))
            event.preventDefault();
    },

    updateSubscription() {
        //a
        var birthdate = this.refs['personal-birthdate'].value;
        FinancialStore.dispatch({
            action: FinancialStore.ACTION_UPDATE_USER_SUBSCRIPTION,
            data: {
                Id: this.state.subscription.Id,
                Customer: {
                    Fullname: this.refs['personal-fullname'].value,
                    Email: UserSession.get("user").Email,
                    Code: UserSession.get("user").Id,
                    Cpf: this.refs['personal-cpf'].value,
                    BirthdateDay: birthdate.substr(8, 2),
                    BirthdateMonth: birthdate.substr(5, 2),
                    BirthdateYear: birthdate.substr(0, 4),
                    PhoneAreaCode: this.refs['personal-phone-area'].value,
                    PhoneNumber: this.refs['personal-phone-number'].value,
                    BillingInfo: {
                        CreditCard: {
                            HolderName: this.refs['card-holder'].value,
                            ExpirationMonth: this.refs['card-expiration-month'].value,
                            ExpirationYear: this.refs['card-expiration-year'].value,
                            Number: this.refs['card-number'].value,
                        },
                    },
                    Address: {
                        Street: this.refs['address-street'].value,
                        Number: this.refs['address-number'].value,
                        Complement: this.refs['address-complement'].value,
                        District: this.refs['address-district'].value,
                        Zipcode: this.refs['address-zipcode'].value,
                        City: this.refs['address-city'].value,
                        State: this.refs['address-county'].value,
                        Country: "BRA"
                    },
                },
            },
        });
    },

    processSubscriptionUpdateResponse(data) {
        console.log(data);
        $("#submittingOverlay").removeClass("show");
        Toastr.remove();
        Toastr.success(Messages.get("TextPaymentConfirmed"));
        this.context.router.push("/user/financial");
    },

    subscribe(event) {
        event && event.preventDefault();
        $("#submittingOverlay").addClass("show");
        this.updateSubscription();
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user"),
            professional = user.Professional.Professional,
            financial = user.Financial,
            subscription = this.state.subscription,
            phone = user.PhoneNumber.split(" ")
        ;

        if (!user.IsProfessional) {
            this.context.router.push("/become-a-professional");
            return <div />;
        }

        var months = [], years = [];
        for (var i = 0; i < 12; i++) {
            months.push(<option key={"month-" + i} value={(i < 9 ? "0" : "") + (i + 1)}>
                {(i < 9 ? "0" : "") + (i + 1)}
            </option>);
        }
        for (var i = 17; i < 100; i++) {
            years.push(<option key={"year-" + i} value={i}>
                {i}
            </option>);
        }

        return (
            <div className="container mt-3">
                <div className="ilv-overlay" id="submittingOverlay">
                  <div className="ilv-overlay-box" role="document" style={{textAlign: "center"}}>
                    <LoadingGauge />
                    <h5>{Messages.get("TextWaitingPaymentConfirmation")}...</h5>
                  </div>
                </div>
                <div className="ilv-card mb-5">
                    <div className="ilv-card-body">
                        <h4>{Messages.get("LabelBecomePremiumMember")}</h4>
                        <div className="ilv-media">
                            <div className="ilv-media-body">
                                <p>{Messages.get("TextBecomePremiumMember")}</p>
                            </div>
                            <div className="ilv-media-right text-right">
                                <h1>R$50,00/mês</h1>
                            </div>
                        </div>

                        <form onSubmit={this.subscribe}>

                            <hr />
                            <h4>{Messages.get("LabelCreditCard")}</h4>
                            <div className="ilv-form-group">
                                <div className="row">
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelCardNumber")}</label>
                                        <input className="ilv-form-control" type="tel" ref="card-number" maxLength="16" pattern="\d{16}"
                                               spellCheck={false} autoComplete="cc-number" autoCorrect={false} />
                                    </div>
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelExpirationDate")}</label>
                                        <div className="row">
                                            <div className="col">
                                                <select className="ilv-form-control" ref="card-expiration-month">
                                                    {months}
                                                </select>
                                            </div>
                                            <div className="col col-sm-1 text-center" style={{fontSize: '24px'}}>/</div>
                                            <div className="col">
                                                <select className="ilv-form-control" ref="card-expiration-year">
                                                    {years}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label">{Messages.get("LabelCardHolderName")}</label>
                                <input className="ilv-form-control" type="text" ref="card-holder" spellCheck={false} />
                            </div>

                            <hr />
                            <h4>{Messages.get("LabelAddress")}</h4>
                            <div className="ilv-form-group">
                                <div className="row">
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelStreet")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-street" spellCheck={false} defaultValue={professional.Address} />
                                    </div>
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelNumber")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-number" spellCheck={false} />
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-form-group">
                                <div className="row">
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelComplement")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-complement" spellCheck={false} defaultValue={professional.Complement} />
                                    </div>
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelZipcode")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-zipcode" spellCheck={false} defaultValue={professional.Zipcode} />
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-form-group">
                                <div className="row">
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelDistrict")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-district" spellCheck={false} defaultValue={professional.District} />
                                    </div>
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelCity")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-city" spellCheck={false} defaultValue={professional.City} />
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-form-group">
                                <div className="row">
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelCounty")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-county" spellCheck={false} defaultValue={professional.County} />
                                    </div>
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelCountry")}</label>
                                        <input className="ilv-form-control" type="text" ref="address-country" spellCheck={false} defaultValue={professional.Country} />
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <h4>{Messages.get("LabelPersonalInfo")}</h4>
                            <div className="ilv-form-group">
                                <div className="row">
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelFullname")}</label>
                                        <input className="ilv-form-control" type="text" ref="personal-fullname" spellCheck={false} defaultValue={user.Name + " " + user.Surname} />
                                    </div>
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelBirthdate")}</label>
                                        <input className="ilv-form-control" type="date" ref="personal-birthdate" spellCheck={false} defaultValue={user.Birthdate ? user.Birthdate.substr(0, 10):null} />
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-form-group">
                                <div className="row">
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelCPF")}</label>
                                        <input className="ilv-form-control" type="text" ref="personal-cpf" spellCheck={false} maxLength="11" onKeyPress={this.cpfFilter} />
                                    </div>
                                    <div className="col col-md-6">
                                        <label className="ilv-form-label">{Messages.get("LabelPhone")}</label>
                                        <div className="row">
                                            <div className="col col-sm-2">
                                                <input className="ilv-form-control" type="tel" ref="personal-phone-area" spellCheck={false}
                                                       onKeyPress={this.digitFilter} defaultValue={phone[1]} placeholder="DDD" maxLength="2" />
                                            </div>
                                            <div className="col">
                                                <input className="ilv-form-control" type="tel" ref="personal-phone-number" spellCheck={false}
                                                       onKeyPress={this.digitFilter} defaultValue={phone[2].replace("-", "")} placeholder={Messages.get("LabelNumber")} maxLength="9" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col">
                                    <button type="submit" className="ilv-btn ilv-btn-success">{Messages.get("ActionSubscribe")}</button>
                                </div>
                                <div className="col text-right">
                                    <img src={require("ilevus/img/moip.png")} />
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        );
    }
});
