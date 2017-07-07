
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var FinancialStore = require("ilevus/jsx/core/store/Financial.jsx");
var SubscriptionStatus = require("ilevus/jsx/core/store/moip/SubscriptionStatus.json");
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
        FinancialStore.on("retrieve-subscriptions-customers", (customers) => {
            me.setState({
                loading: !this.state.subscriptions,
                customers: customers,
            });
        }, me);
        FinancialStore.on("retrieve-subscriptions", (subscriptions) => {
            me.setState({
                loading: !this.state.customers,
                subscriptions: subscriptions,
            });
        }, me);


        FinancialStore.dispatch({
            action: FinancialStore.ACTION_RETRIEVE_SUBSCRIPTIONS,
        });
        FinancialStore.dispatch({
            action: FinancialStore.ACTION_RETRIEVE_SUBSCRIPTIONS_CUSTOMERS,
        });
    },
    componentWillUnmount() {
        FinancialStore.off(null, null, this);
    },
    
    renderCustomers(customers) {
        if (!customers || customers.length <= 0) {
            return <i>{Messages.get("TextNoCustomersYet")}</i>;
        }
        return (<table className="ilv-table">
            <thead>
                <tr>
                    <th>{Messages.get("LabelName")}</th>
                    <th>{Messages.get("LabelEmail")}</th>
                    <th>CPF</th>
                </tr>
            </thead>
            <tbody>
                {customers.map((customer, index) => {
                    return (<tr key={"customer-" + index}>
                        <td><Link to={"/admin/subscriptions/customer/"+customer.Code}>
                            {customer.Fullname}
                        </Link></td>
                        <td>
                            {customer.Email}
                        </td>
                        <td>
                            {customer.Cpf}
                        </td>
                    </tr>);
                })}
            </tbody>
        </table>);
    },
    renderSubscriptions(subscriptions) {
        if (!subscriptions || subscriptions.length <= 0) {
            return <i>{Messages.get("TextNoSubscriptionsYet")}</i>;
        }
        return (<table className="ilv-table">
            <thead>
                <tr>
                    <th>{Messages.get("LabelCustomer")}</th>
                    <th>{Messages.get("LabelStatus")}</th>
                    <th>{Messages.get("LabelNextInvoice")}</th>
                </tr>
            </thead>
            <tbody>
                {subscriptions.map((subscription, index) => {
                    console.log(subscription);
                    return (<tr key={"subscription-" + index}>
                        <td><Link to={"/admin/subscriptions/detail/" + subscription.Code}>
                            {subscription.Customer.Fullname}
                        </Link></td>
                        <td>
                            {SubscriptionStatus[subscription.Status]}
                        </td>
                        <td>
                            {subscription.NextInvoiceDate.Day}/{subscription.NextInvoiceDate.Month}/{subscription.NextInvoiceDate.Year}
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
        if (this.props.children) {
            return this.props.children;
        }
        return (<div>
            <h1>{Messages.get("LabelSubscriptions")}</h1>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <strong>{Messages.get("LabelMoipSubscriptions")} ({this.state.subscriptions ? this.state.subscriptions.length : 0})
                    </strong>
                </div>
                <div className="ilv-card-body">{this.renderSubscriptions(this.state.subscriptions)}
                </div>
            </div>       
     
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <strong>
                        {Messages.get("LabelMoipCustomers")} ({this.state.customers ? this.state.customers.length:0})
                    </strong>
                </div>
                <div className="ilv-card-body">
                    {this.renderCustomers(this.state.customers)}
                </div>
            </div>
        </div>);
    }
});
