
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
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
            submitting: false
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
                loading: !!this.state.config,
            });
        }, me);

        SystemStore.on("retrieve-config", (data) => {
            me.setState({
                loading: UserSession.get("loading"),
                config: data,
            });
        }, me);

        if ((!this.state.loading) && (!UserSession.get("logged"))) {
            me.context.router.push("/login");
            return;
        }

        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_CONFIG
        });

    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
        SystemStore.off(null, null, this);
    },

    componentDidUpdate() {
    },

    subscribe(event) {
        event && event.preventDefault();
        console.log(this.state.config.MoipSubscriptionCode, MoipAssinaturas);
        var moip = new MoipAssinaturas(this.state.config.MoipSubscriptionKey);
        var plan_code = "sub001";
        var subscription = new Subscription()
                .with_code(new Date().getTime())
                .with_new_customer(new Customer({
                    fullname: "Teste de Fulano",
                    email: "teste@fulano.com.br",
                    code: UserSession.get("user").Id,
                    cpf: "00000000000",
                    birthdate_day: "01",
                    birthdate_month: "01",
                    birthdate_year: "1990",
                    phone_area_code: "49",
                    phone_number: "999999999",
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
                    })
                }))
                .with_plan_code(plan_code);

        this.setState({ submitting: true });
        var me = this;
        moip.subscribe(subscription).callback(function (response) {
            if (response.has_errors()) {
                var errors = "";
                for (i = 0; i < response.errors.length; i++) {
                    var erro = response.errors[i].description;
                    console.error(erro);
                    errors += (errors != "" ? "<br />":"")+erro;
                }
                Toastr.remove();
                Toastr.error(errors);
                return;
            }
            console.log(response);
            Toastr.remove();
            Toastr.success(Messages.get("TextPaymentConfirmed"));
            me.router.push("/user/financial");
        });

    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user"),
            financial = user.Financial,
            premium = user.Premium ? user.Premium : { Active: false },
            ilevusCode = "Av7ZseP"
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

        var professional = UserSession.get("user").Professional.Professional;
        console.log(professional);

        return (
            <div className="container mt-3">
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
