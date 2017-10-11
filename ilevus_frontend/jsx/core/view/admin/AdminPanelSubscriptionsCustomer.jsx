
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var FinancialStore = require("ilevus/jsx/core/store/Financial.jsx");
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
        FinancialStore.on("retrieve-subscriptions-customer", (customer) => {
            me.setState({
                loading: false,
                customer: customer,
            });
        }, me);
        this.loadCustomer(this.props.params.id);
    },
    componentWillReceiveProps(newProps) {
        if (this.props.params.id != newProps.params.id) {
            this.loadCustomer(newProps.params.id);
        }
    },
    componentWillUnmount() {
        FinancialStore.off(null, null, this);
    },

    loadCustomer(id) {
        FinancialStore.dispatch({
            action: FinancialStore.ACTION_RETRIEVE_SUBSCRIPTIONS_CUSTOMER,
            data: id,
        });
    },

    renderCreditCards(cards) {
        if (!cards || cards.length <= 0) {
            return <i>{Messages.get("TextNoCreditCardYet")}</i>;
        }
        return (<table className="ilv-table">
            <thead>
                <tr>
                    <th>{Messages.get("LabelCard")}</th>
                    <th>{Messages.get("LabelHolderName")}</th>
                    <th>{Messages.get("LabelExpirationData")}</th>
                </tr>
            </thead>
            <tbody>
                {cards.map((card, index) => {
                    return (<tr key={"card-" + index}>
                        <td>
                            {card.Brand} XXXX-XXXX-XXXX-{card.LastFourDigits}
                        </td>
                        <td>
                            {card.HolderName}
                        </td>
                        <td>
                            {card.ExpirationMonth}/{card.ExpirationYear}
                        </td>
                    </tr>);
                })}
            </tbody>
        </table>);
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var customer = this.state.customer;
        return (<div>
            <h2>{Messages.get("LabelSubscriptionsCustomer")}</h2>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <h4>
                        {customer.Fullname}
                    </h4>
                </div>
                <div className="ilv-card-body">
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelEmail")}</div>
                            <b>{customer.Email}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">CPF</div>
                            <b>{customer.Cpf}</b>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelCreatedAt")}</div>
                            <b>{customer.CreationDate} {Messages.get("LabelAt")} {customer.CreationTime}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelPhone")}</div>
                            <b>({customer.PhoneAreaCode}) {customer.PhoneNumber}</b>
                        </div>
                    </div>
                     <hr className="mb-4" />
                    <div className="mb-4"><strong>{Messages.get("LabelCreditCards")}</strong></div>

                    {this.renderCreditCards(customer.BillingInfo.CreditCards)}

                    <hr className="mb-4" />
                    <div className="mb-4"><strong>{Messages.get("LabelAddress")}</strong></div>

                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelStreet")}</div>
                            <b>{customer.Address.Street}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelNumber")}</div>
                            <b>{customer.Address.Number}</b>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelComplement")}</div>
                            <b>{customer.Address.Complement}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelDistrict")}</div>
                            <b>{customer.Address.District}</b>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelCity")}</div>
                            <b>{customer.Address.City}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelState")}</div>
                            <b>{customer.Address.State}</b>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelCountry")}</div>
                            <b>{customer.Address.Country}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelZipcode")}</div>
                            <b>{customer.Address.Zipcode}</b>
                        </div>
                    </div>

                </div>
            </div>
        </div>);
    }
});
