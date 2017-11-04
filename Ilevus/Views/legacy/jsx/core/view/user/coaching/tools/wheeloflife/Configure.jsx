
var S = require('string');
var marked = require("marked");
var React = require('react');
var Toastr = require("toastr");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var WheelOfLifeStore = require("ilevus/jsx/core/store/coaching/WheelOfLife.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var EditableText = require("ilevus/jsx/core/widget/coaching/EditableText.jsx");
var EditableTextArea = require("ilevus/jsx/core/widget/coaching/EditableTextArea.jsx");

module.exports = createClass({
    getInitialState() {
        return {
            changed: false,
            field: 0,
            configs: UserSession.get("user").Professional.Professional.CoachingToolsConfigs.WheelOfLifeDefaults,
        }
    },

    componentDidMount() {
        var me = this;

        window.onbeforeunload = me.beforeClose;

        WheelOfLifeStore.on("save-configuration", (data) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccess"));
            me.setState({
                changed: false,
                configs: data,
            });
        }, me);
    },
    componentWillUnmount() {
        window.onbeforeunload = undefined;
        WheelOfLifeStore.off(null, null, this);
    },

    beforeClose() {
        if (this.state.changed)
            return "Tem certeza?";
        return undefined;
    },

    saveConfigs(event) {
        event && event.preventDefault();
        WheelOfLifeStore.dispatch({
            action: WheelOfLifeStore.ACTION_SAVE_CONFIGURATION,
            data: this.state.configs,
        });
    },

    changeField(event) {
        this.setState({
            field: event.target.value,
        });
    },
    instructionsChange(content) {
        this.state.configs[this.state.field].Instructions = content;
        this.setState({ changed: true });
    },
    labelChange(content) {
        this.state.configs[this.state.field].Label = content;
        this.setState({ changed: true });
    },

    addField(event) {
        event && event.preventDefault();
        this.state.configs.push({
            Label: Messages.get("LabelName"),
            Instructions: "",
        });
        this.setState({
            changed: true,
            field: this.state.configs.length - 1,
        });
    },
    removeField(index, event) {
        event && event.preventDefault();
        if (this.state.configs.length == 0)
            return;
        var me = this;
        Modal.deleteConfirm(() => {
            Modal.hide();
            me.state.configs.splice(index, 1);
            me.setState({
                changed: true,
                field: me.state.field == 0 ? 0 : me.state.field - 1,
            });
        });
    },

    previousField(event) {
        event && event.preventDefault()
        var field = this.state.field - 1;
        if (this.state.field == 0) {
            field = this.state.configs.length - 1;
        }
        this.setState({
            field: field,
        });
    },
    nextField(event) {
        event && event.preventDefault()
        var field = this.state.field + 1;
        if (this.state.field == (this.state.configs.length - 1)) {
            field = 0;
        }
        this.setState({
            field: field,
        });
    },

    renderField(fieldIndex) {
        var field = this.state.configs[fieldIndex];
        return (<div className="col mb-3">
            <EditableText
                          inline={true}
                          label={Messages.get('LabelField')}
                          value={field.Label}
                          editable={true}
                          onChange={this.labelChange} />
            <EditableTextArea
                label={Messages.get('LabelInstructions')}
                value={field.Instructions}
                editable={true}
                onChange={this.instructionsChange} />
            <div className="mt-3">
                <a className="font-weight-bold mr-4" href="#" onClick={this.previousField}>&#8592; {Messages.get("LabelPrevious")}</a>
                <a className="font-weight-bold mr-4" href="#" onClick={this.nextField}>{Messages.get("LabelNext")} &#8594;</a>
                <button className="ilv-btn ilv-btn-error" onClick={this.removeField.bind(this, fieldIndex)} title={Messages.get("LabelRemoveField")}>
                    {Messages.get("LabelRemoveField")}
                </button>
            </div>
        </div>);
    },

    render() {
        return (<div>
            <div className="row mb-2">
                <div className="col">
                    <fieldset className="ilv-form-group">
                        <div className="ilv-input-group mb-5">
                            <label className="ilv-form-label">{Messages.get("LabelFields")}</label>
                            <div className="ilv-input-group-btn">
                                <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-primary" onClick={this.saveConfigs} title={Messages.get("LabelSave")} disabled={!this.state.changed}>
                                    {Messages.get("LabelSave")}
                                </button>
                            </div>
                        </div>
                        <div className="ilv-input-group">
                            <select className="ilv-form-control ilv-form-control-lg" value={this.state.field} onChange={this.changeField}>
                                {this.state.configs.map((config, index) => {
                                    return (<option value={index} key={"field-"+index}>
                                        {config.Label}
                                    </option>);
                                })}
                            </select>
                            <div className="ilv-input-group-btn">
                                <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-success" onClick={this.addField} title={Messages.get("LabelNewField")}>
                                    <i className="ilv-icon material-icons md-24">&#xE145;</i>
                                </button>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {this.renderField(this.state.field)}
                </div>
            </div>
        </div>);
    }
});