var S = require("string");
var React = require("react");
var MaskedInput = require("react-maskedinput");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var cartStore = require("./../../store/Cart.jsx");
var classNames = require('classnames');
var isInCart = false;
module.exports = React.createClass({
    getInitialState() {
        return {
            services: cartStore.getCacheServicesHired()
        }
    },
    renderRow(row) {
        return (
            <tr>
                <td className="ilv-font-weight-semibold">{row.Name}</td>
                <td className="ilv-text-xs-right">{row.Price}</td>
            </tr>
        )
    },
    render() {
        let rows = []
        for (let i = 0; i < this.state.services.length; i++) {
            rows.push(this.state.services[i])
        }
        if (rows.length == 0) {
            return (
                <tr>
                <td className="ilv-font-weight-semibold">{Messages.get("LabelCartEmpty")}</td>
                <td className="ilv-text-xs-right">0</td>
            </tr>
            )
        }
        return (
            <table className="ilv-table ilv-table-sm ilv-table-hover">
                <thead>
                    <tr>
                        <th>{Messages.get("LabelService")}</th>
                        <th className="ilv-text-xs-right">{Messages.get("LabelPrice")}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(this.renderRow)}
                </tbody>
            </table>
        )
    }
});
