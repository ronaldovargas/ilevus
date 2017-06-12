
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

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
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

    updateSubscription(response) {
        //a

        FinancialStore.dispatch({
            action: FinancialStore.ACTION_UPDATE_USER_SUBSCRIPTION,
            data: {
                Id: this.state.subscription.Id,
                Amount: response.amount,
                Invoice: response.invoice,
                NextInvoiceDate: response.next_invoice_date,
                CreditCard: response.customer.billing_info.credit_card,
                Status: "PROCESSING",
            },
        });
    },

    getCustomerObject() {
        var birthdate = this.refs['personal-birthdate'].value;

        var customer = new Customer({
            fullname: this.refs['personal-fullname'].value,
            email: UserSession.get("user").Email,
            code: UserSession.get("user").Id,
            cpf: this.refs['personal-cpf'].value,
            birthdate_day: birthdate.substr(8, 2),
            birthdate_month: birthdate.substr(5, 2),
            birthdate_year: birthdate.substr(0, 4),
            phone_area_code: this.refs['personal-phone-area'].value,
            phone_number: this.refs['personal-phone-number'].value,
            billing_info: new BillingInfo({
                fullname: this.refs['card-holder'].value,
                expiration_month: this.refs['card-expiration-month'].value,
                expiration_year: this.refs['card-expiration-year'].value,
                credit_card_number: this.refs['card-number'].value
            }),
            address: new Address({
                street: this.refs['address-street'].value,
                number: this.refs['address-number'].value,
                complement: this.refs['address-complement'].value,
                district: this.refs['address-district'].value,
                zipcode: this.refs['address-zipcode'].value,
                city: this.refs['address-city'].value,
                state: this.refs['address-county'].value,
                country: this.refs['address-country'].value
            }),
        });
        return customer;
    },
    getSubscriptionObject() {
        var plan_code = this.state.config.MoipSubscriptionCode;
        var ilevusSubscription = this.state.subscription;

        var subscription = new Subscription()
                .with_code(ilevusSubscription.Id)
                .with_plan_code(plan_code)
        ;
        return subscription;
    },

    processMoipResponse(response) {
        console.log(response);
        if (response.has_errors()) {
            var errors = "";
            for (var i = 0; i < response.errors.length; i++) {
                var erro = response.errors[i].description;
                console.error(erro);
                errors += (errors != "" ? "<br />" : "") + erro;
                if (erro.indexOf("do cliente") >= 0) {
                    var moip = new MoipAssinaturas(this.state.config.MoipSubscriptionKey);
                    var subscription = this.getSubscriptionObject();
                    var customer = this.getCustomerObject();
                    subscription.with_customer(customer);
                    moip.subscribe(subscription).callback(this.processMoipResponse);
                    return;
                }
            }
            $("#submittingOverlay").removeClass("show");
            Toastr.remove();
            Toastr.error(errors);
            return;
        }
        this.updateSubscription(response);
    },
    processSubscriptionUpdateResponse(data) {
        $("#submittingOverlay").removeClass("show");
        Toastr.remove();
        Toastr.success(Messages.get("TextPaymentConfirmed"));
        this.context.router.push("/user/financial");
    },

    subscribe(event) {
        event && event.preventDefault();

        var moip = new MoipAssinaturas(this.state.config.MoipSubscriptionKey);
        var ilevusSubscription = this.state.subscription;
        var subscription = this.getSubscriptionObject();
        var customer = this.getCustomerObject();

        if (ilevusSubscription.Status === "NEW") {
            subscription.with_new_customer(customer);
        } else {
            subscription.with_customer(customer);
        }

        console.log(subscription);
        $("#submittingOverlay").addClass("show");
        moip.subscribe(subscription).callback(this.processMoipResponse);
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
