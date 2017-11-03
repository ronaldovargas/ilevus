
var _ = require("underscore");
var S = require("string");
var marked = require("marked");
var React = require('react');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    propTypes: {
        inline: PropTypes.bool,
        label: PropTypes.string.isRequired,
        value: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        editable: PropTypes.bool.isRequired
    },
    getDefaultProps() {
        return {
            editable: true,
            inline: false,
            onChange: _.noop
        };
    },
    getInitialState() {
        return {
            editing: false
        };
    },
    tweakEditing(event) {
        event && event.preventDefault();
        this.setState(prev => {
            return {editing: !prev.editing};
        });
    },

    saveEdit(event) {
        event && event.preventDefault();
        this.props.onChange(this.refs["textarea"].value);
        this.tweakEditing();
    },

    render() {
        var value = S(this.props.value);
        if (this.props.inline) {
            return (!this.state.editing ? (<h4>
                {this.props.label}:
                &nbsp;{value.isEmpty() ? <i>{Messages.get("TextNoFilledContent")}</i> : value.s}
                &nbsp;{this.props.editable ? <a className="font-weight-bold" onClick={this.tweakEditing} href="#">{Messages.get('LabelEdit')}</a>:""}
            </h4>):(<h4>
                {this.props.label}:
                <input className="ilv-form-control mb-2" ref="textarea" defaultValue={value.s} />
                <button className="ilv-btn ilv-btn-primary" onClick={this.saveEdit}>{Messages.get("LabelSave")}</button>
                <button className="ilv-btn ilv-btn-sm ilv-btn-clean" onClick={this.tweakEditing}>{Messages.get("LabelCancel")}</button>
            </h4>));
        }
        return (!this.state.editing ? (<h4>
            {this.props.label}:
            <br />{value.isEmpty() ? <i>{Messages.get("TextNoFilledContent")}</i> : value.s}
            <br />{this.props.editable ? <a className="font-weight-bold" onClick={this.tweakEditing} href="#">{Messages.get('LabelEdit')}</a>:""}
        </h4>):(<h4>
            {this.props.label}:
            <input className="ilv-form-control mb-2" ref="textarea" defaultValue={value.s} />
            <button className="ilv-btn ilv-btn-primary" onClick={this.saveEdit}>{Messages.get("LabelSave")}</button>
            <button className="ilv-btn ilv-btn-sm ilv-btn-clean" onClick={this.tweakEditing}>{Messages.get("LabelCancel")}</button>
        </h4>));
    }
});
