import React from 'react';
import ReactDOM from 'react-dom';
var PaymentStore = require("ilevus/jsx/core/store/PaymentStore");

var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var S = require("string");

module.exports = React.createClass({
    propTypes: {
        initialValue: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            payments: []
        };
    },
    handleChange: function (event) {
        this.setState({
            text: event.target.value
        });
    },
    componentWillMount: function () {
        debugger;
        PaymentStore.dispatch({
            action: PaymentStore.ACTION_GET_ALL
        });
    },
    render: function () {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Dia do pagamento</th>
                        <th>Valor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.payments.map((item, index) => (
                        <tr>
                            <th>item.PayDay</th>
                            <th>Amount</th>
                            <th>OK</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
});