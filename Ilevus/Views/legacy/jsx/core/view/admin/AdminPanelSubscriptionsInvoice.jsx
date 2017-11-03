
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
        FinancialStore.on("retrieve-subscription-invoice", (invoice) => {
            me.setState({
                loading: false,
                invoice: invoice,
            });
        }, me);

        this.loadInvoice(this.props.params.id);
    },
    componentWillReceiveProps(newProps) {
        if (this.props.params.id != newProps.params.id) {
            this.loadInvoice(newProps.params.id);
        }
    },
    componentWillUnmount() {
        FinancialStore.off(null, null, this);
    },

    loadInvoice(id) {
        FinancialStore.dispatch({
            action: FinancialStore.ACTION_RETRIEVE_SUBSCRIPTION_INVOICE,
            data: id,
        });
    },

    renderItems(items) {
        return (<table className="ilv-table">
            <thead>
                <tr>
                    <th>{Messages.get("LabelDescription")}</th>
                    <th>{Messages.get("LabelValue")}</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => {
                    return (<tr key={"item-" + index}>
                        <td>
                            {item.Type}
                        </td>
                        <td>
                            R${Numeral(item.Amount / 100).format("0,0.00")}
                        </td>
                    </tr>);
                })}
                <tr>
                    <td>
                        <b>{Messages.get("LabelTotal")}</b>
                    </td>
                    <td>
                        <b>R${Numeral(this.state.invoice.Amount/100).format("0,0.00")}</b>
                    </td>
                </tr>
            </tbody>
        </table>);
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var invoice = this.state.invoice;
        return (<div>
            <h2>{Messages.get("LabelInvoice")} {invoice.Id}</h2>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <h4>
                        {invoice.Customer.Fullname}
                    </h4>
                </div>
                <div className="ilv-card-body">
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelPlan")}</div>
                            <b>{invoice.Plan.Name}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelCreatedAt")}</div>
                            <b>{invoice.CreationDate.Day}/{invoice.CreationDate.Month}/{invoice.CreationDate.Year}
                                &nbsp;{Messages.get("LabelAt")} {invoice.CreationDate.Hour}:{invoice.CreationDate.Minute}
                            </b>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelStatus")}</div>
                            <b>{invoice.Status.Description}</b>
                        </div>
                        <div className="col col-md-6">
                            <div className="ilv-small">{Messages.get("LabelTotal")}</div>
                            <b>R${Numeral(invoice.Amount / 100).format("0,0.00")}</b>
                        </div>
                    </div>

                     <hr className="mb-4" />
                    <div className="mb-4"><strong>{Messages.get("LabelInvoiceDetail")}</strong></div>

                    {this.renderItems(invoice.Items)}

                </div>
            </div>
        </div>);
    }
});
