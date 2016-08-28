
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
        return {
            service: {}
        };
    },
    getInitialState() {
        return {
            edit: !!this.props.service.Name
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
            Price: this.refs['field-price'].valueAsNumber
        };
        this.props.onSubmit(data);
    },
    onCancel(event) {
        event.preventDefault();
        this.props.onCancel();
    },

    render() {
        return (<form onSubmit={this.onSubmit }>
		    <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="serviceName">
                    {Messages.get("LabelService")}
                </label>
			    <input className="ilv-form-control"
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
			    <input className="ilv-form-control"
                       type="number"
                       id="servicePrice"
                       ref="field-price"
                       defaultValue={this.props.service.Price} />
            </fieldset>

		    <input type="submit"
                    className="ilv-btn ilv-btn-block ilv-btn-primary"
                    value={this.state.edit ? Messages.get("ActionSaveOfferedService") : Messages.get("ActionAddNewOfferedService")} />
			<button className="ilv-btn ilv-btn-block ilv-btn-clean" onClick={this.onCancel }>
			    {Messages.get("LabelCancel")}
            </button>
		</form>);
    }
});
