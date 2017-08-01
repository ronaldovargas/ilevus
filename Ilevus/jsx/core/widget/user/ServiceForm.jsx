var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        service: React.PropTypes.object.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {service: {}};
    },
    getInitialState() {
        return {
            edit: !!this.props.service.Name,
            sellPrice: this.calcFinalPrice(this.props.service.Price)
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
            Name: name
                .escapeHTML()
                .s,
            Price: this.refs['field-price'].valueAsNumber
        };
        this
            .props
            .onSubmit(data);
    },
    onCancel(event) {
        event.preventDefault();
        this
            .props
            .onCancel();
    },
    calcFinalPrice(value) {
        var percMoip = value * 0.0549;
        var percImpMoip = percMoip * 0.15;
        var mktDir = 29.90;
        var comIle = 1.15;
        return percMoip + percImpMoip + mktDir + comIle + (value * 1);
    },
    handleChange(e) {
        // var calc = (((e.target.value * 0.0579) * 0.15 ) + 29.90 + 1.15 ) +
        // e.target.value;
        var percMoip = e.target.value * 0.0549;
        var percImpMoip = percMoip * 0.15;
        var mktDir = 29.90;
        var comIle = 1.15;
        var calc = percMoip + percImpMoip + mktDir + comIle + (e.target.value * 1);
        this.setState({
            sellPrice: calc || 0
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
                        defaultValue={this.props.service.Name}/>
                </fieldset>

                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label" htmlFor="servicePrice">
                        {Messages.get("LabelPrice")}
                    </label>
                    <input
                        className="ilv-form-control"
                        type="number"
                        id="servicePrice"
                        ref="field-price"
                        onChange={this.handleChange}
                        defaultValue={this.props.service.Price}/>
                </fieldset>

                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label" htmlFor="serviceSellPrice">
                        {Messages.get("LabelSellPrice")}
                    </label>
                    <input
                        className="ilv-form-control"
                        type="number"
                        disabled="disabled"
                        id="serviceSellPrice"
                        ref="field-sell-price"
                        value={this.state.sellPrice}/>
                </fieldset>

                <input
                    type="submit"
                    className="ilv-btn ilv-btn-block ilv-btn-primary"
                    value={this.state.edit
                    ? Messages.get("ActionSaveOfferedService")
                    : Messages.get("ActionAddNewOfferedService")}/>
                <button className="ilv-btn ilv-btn-block ilv-btn-clean" onClick={this.onCancel}>
                    {Messages.get("LabelCancel")}
                </button>
            </form>
        );
    }
});
