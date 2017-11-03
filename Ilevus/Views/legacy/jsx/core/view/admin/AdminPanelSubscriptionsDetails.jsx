
var Numeral = require("numeral");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var FinancialStore = require("ilevus/jsx/core/store/Financial.jsx");
var SubscriptionStatus = require("ilevus/jsx/core/store/moip/SubscriptionStatus.json");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },
    getInitialState() {
        return {
            loading: true
        };
    },
    componentDidMount() {
        var me = this;
        FinancialStore.on("retrieve-subscription-detail", (subscription) => {
            me.setState({
                loading: !this.state.invoices,
                subscription: subscription,
            });
        }, me);
        FinancialStore.on("retrieve-subscription-invoices", (invoices) => {
            me.setState({
                loading: !this.state.subscription,
                invoices: invoices,
            });
        }, me);

        this.loadSubscription(this.props.params.id);
    },
    componentWillReceiveProps(newProps) {
        if (this.props.params.id != newProps.params.id) {
            this.loadSubscription(newProps.params.id);
        }
    },
    componentWillUnmount() {
        FinancialStore.off(null, null, this);
    },

    loadSubscription(id) {
        FinancialStore.dispatch({
            action: FinancialStore.ACTION_RETRIEVE_SUBSCRIPTION_DETAIL,
            data: id,
        });
        this.loadInvoices(id);
    },
    loadInvoices(id) {
        FinancialStore.dispatch({
            action: FinancialStore.ACTION_RETRIEVE_SUBSCRIPTION_INVOICES,
            data: id,
        });
    },

    renderInvoices(invoices) {
        if (!invoices || invoices.length <= 0) {
            return <i>{Messages.get("TextNoCreditCardYet")}</i>;
        }
        return (<table className="ilv-table">
            <thead>
                <tr>
                    <th>{Messages.get("LabelCode")}</th>
                    <th>{Messages.get("LabelPlan")}</th>
                    <th>{Messages.get("LabelCreatedAt")}</th>
                    <th>{Messages.get("LabelStatus")}</th>
                    <th>{Messages.get("LabelTotal")}</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice, index) => {
                    console.log(invoice);
                    return (<tr key={"invoice-" + index}>
                        <td><Link to={"/admin/subscriptions/invoice/" + invoice.Id}>
                            {invoice.Id}
                        </Link></td>
                        <td>
                            {invoice.Plan.Name}
                        </td>
                        <td>
                            {invoice.CreationDate.Day}/{invoice.CreationDate.Month}/{invoice.CreationDate.Year}
                        </td>
                        <td>
                            {invoice.Status.Description}
                        </td>
                        <td>
                            R${Numeral(invoice.Amount / 100).format("0,0.00")}
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
        var sub = this.state.subscription;
        return (<div>
            <h2>{Messages.get("LabelSubscriptionDetail")}</h2>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <h4>
                        {sub.Customer.Fullname}
                    </h4>
                </div>
                <div className="ilv-card-body">
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelCode")}</div>
                            <b>{sub.Code}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelCreatedAt")}</div>
                            <b>{sub.CreationDate.Day}/{sub.CreationDate.Month}/{sub.CreationDate.Year}
                                &nbsp;{Messages.get("LabelAt")} {sub.CreationDate.Hour}:{sub.CreationDate.Minute}
                            </b>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelStatus")}</div>
                            <b>{SubscriptionStatus[sub.Status]}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelNextInvoiceDate")}</div>
                            <b>{sub.NextInvoiceDate.Day}/{sub.NextInvoiceDate.Month}/{sub.NextInvoiceDate.Year}</b>
                        </div>
                    </div>

                     <hr className="mb-4" />
                    <div className="mb-4"><strong>{Messages.get("LabelInvoices")}</strong></div>

                    {this.renderInvoices(this.state.invoices)}

                </div>
            </div>
        </div>);
    }
});
