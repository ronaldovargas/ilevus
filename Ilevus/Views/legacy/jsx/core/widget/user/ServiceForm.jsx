var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var CurrencyUtils = require("ilevus/jsx/core/util/CurrencyUtils.jsx");
import { CurrencyInput } from 'components'

module.exports = createClass({
    propTypes: {
        service: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    },
    getDefaultProps() {
        return { service: {} };
    },
    getInitialState() {
        return {
            edit: !!this.props.service.Name,
            sellPrice: this.calcFinalPrice(this.props.service.Price),
            price: this.props.service.Price
        };
    },
    onSubmit(event) {
        event.preventDefault();
        var name = S(this.refs['field-name'].value);
        if (name.isEmpty()) {
            Toastr.remove();
            Toastr.error(Messages.formatWithKeys("ValidationRequired", ['LabelService']));
            return;
        }
        var data = {
            Name: name.escapeHTML().s,
            Price: this.state.price
        };
        this.props.onSubmit(data);
    },
    onCancel(event) {
        event.preventDefault();
        this.props.onCancel();
    },
    calcFinalPrice(value) {
        if (!value) {
            return 'R$ 0';
        }
        var percMoip = value * 0.0549;
        var percImpMoip = percMoip * 0.15;
        var mktDir = 29.90;
        var comIle = 1.15;
        var calc = percMoip + percImpMoip + mktDir + comIle + (value * 1);
        var sellPrice = CurrencyUtils.format(calc);
        return sellPrice;
    },
    handleChange(event, value, maskedValue) {
        this.setState({
            sellPrice: this.calcFinalPrice(value) || 0,
            price: value
        });
    },
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label" htmlFor="serviceName">
                        {Messages.get("LabelService")}
                    </label>
                    <input
                        className="ilv-form-control"
                        type="text"
                        spellCheck={false}
                        id="serviceName"
                        ref="field-name"
                        defaultValue={this.props.service.Name} />
                </fieldset>

                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label" htmlFor="servicePrice">
                        {Messages.get("LabelPrice")}
                    </label>

                    <CurrencyInput
                        onChange={this.handleChange}
                        value={this.props.service.Price} />
                </fieldset>

                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label" htmlFor="serviceSellPrice">
                        {Messages.get("LabelSellPrice")}
                    </label>
                    <input
                        className="ilv-form-control"
                        type="text"
                        disabled="disabled"
                        id="serviceSellPrice"
                        ref="field-sell-price"
                        value={this.state.sellPrice} />
                </fieldset>

                <input
                    type="submit"
                    className="ilv-btn ilv-btn-block ilv-btn-primary"
                    value={this.state.edit
                        ? Messages.get("ActionSaveOfferedService")
                        : Messages.get("ActionAddNewOfferedService")} />
                <button className="ilv-btn ilv-btn-block ilv-btn-clean" onClick={this.onCancel}>
                    {Messages.get("LabelCancel")}
                </button>
            </form>
        );
    }
});
