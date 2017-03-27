
var _ = require("underscore");
var S = require("string");
var marked = require("marked");
var React = require('react');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired,
        editable: React.PropTypes.bool.isRequired
    },
    getDefaultProps() {
        return {
            editable: true,
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
        return (!this.state.editing ? <div>
            <h4 className="ilv-font-weight-semibold my-3">{this.props.label}:</h4>
            {value.isEmpty() ? <p><i>{Messages.get("TextNoFilledContent")}</i></p> : <div dangerouslySetInnerHTML={{__html: marked(value.s)}}></div>}
            {this.props.editable ? <a className="font-weight-bold" onClick={this.tweakEditing} href="#">{Messages.get('LabelEdit')}</a>:""}
        </div>:<div>
            <h4 className="ilv-font-weight-semibold my-3">{this.props.label}:</h4>
            <textarea className="ilv-form-control" ref="textarea" style={{minHeight: '150px'}} defaultValue={value.s} />
            <button className="ilv-btn ilv-btn-primary" onClick={this.saveEdit}>{Messages.get("LabelSave")}</button>
            <button className="ilv-btn ilv-btn-sm ilv-btn-clean" onClick={this.tweakEditing}>{Messages.get("LabelCancel")}</button>
        </div>);
    }
});