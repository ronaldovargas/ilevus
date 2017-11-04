
var S = require('string');
var React = require('react');
var ReactColor = require("react-color");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var TwitterPicker = ReactColor.TwitterPicker;

module.exports = createClass({
    getInitialState() {
        return {
            newStepColor: "#AAAAAA",
            processSteps: UserSession.get("user").Professional.Professional.ProcessSteps,
        }
    },

    onColorPick(color) {
        this.setState({ newStepColor : color.hex });
    },

    saveProcessSteps() {
        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PROCESS_STEPS,
            data: this.state.processSteps
        });
    },

    raiseStep(index, event) {
        event && event.preventDefault();
        var step = this.state.processSteps[index];
        this.state.processSteps.splice(index, 1);
        this.state.processSteps.splice(index - 1, 0, step);
        this.forceUpdate();
        this.saveProcessSteps();
    },
    dropStep(index, event) {
        event && event.preventDefault();
        var step = this.state.processSteps[index];
        this.state.processSteps.splice(index, 1);
        this.state.processSteps.splice(index+1, 0, step);
        this.forceUpdate();
        this.saveProcessSteps();
    },
    removeStep(index, event) {
        event && event.preventDefault();
        this.state.processSteps.splice(index, 1);
        this.forceUpdate();
        this.saveProcessSteps();
    },

    addStep(event) {
        event && event.preventDefault();
        var label = S(this.refs['step-label'].value);
        if (label.isEmpty()) {
            return;
        }
        this.state.processSteps.push({
            Label: label.s,
            Color: this.state.newStepColor,
        });
        this.refs['step-label'].value = '';
        this.setState({ newStepColor: '#AAAAAA' });
        this.saveProcessSteps();
    },

    renderSteps() {
        if (this.state.processSteps.length == 0) {
            return <i>{Messages.get("TextNoProcessStepYet")}</i>;
        }

        return <table className="ilv-table">
            <thead>
                <tr>
                    <th width="80"></th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {this.state.processSteps.map((step, index) => {
                    return <tr key={"process-step-"+index}>
                        <td>
                            <div className="ilv-btn-group">
                                {index > 0 ? <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelRaiseOneLevel")} onClick={this.raiseStep.bind(this, index)}>
                                    <i className="ilv-icon material-icons md-24">&#xE316;</i>
                                </button>:""}
                                {index < this.state.processSteps.length-1 ? <button className="ilv-btn ilv-btn-sm ilv-btn-clean p-0" title={Messages.get("LabelDropOneLevel")} onClick={this.dropStep.bind(this, index)}>
                                    <i className="ilv-icon material-icons md-24">&#xE313;</i>
                                </button>:""}
                            </div>
                        </td>
                        <td>
                            <span data-toggle="dropdown" className="mr-1"
                                  style={{ width: "20px", height: "20px", borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle', backgroundColor: step.Color, transition: "all 0.5s" }} />
                            <span>{step.Label}</span>
                        </td>
                        <td className="text-right">
                            <div className="ilv-btn-group">
                                <button className="ilv-btn ilv-btn-sm ilv-btn-clean ilv-btn-block" title={Messages.get("LabelDelete")} onClick={this.removeStep.bind(this, index)}>
                                    <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                </button>
                            </div>
                        </td>
                    </tr>;
                })}
            </tbody>
        </table>;
    },

    render() {
        return (
            <div>
                <form onSubmit={this.addStep}>
                    <div className="ilv-form-group">
                        <div className="ilv-media ilv-media-middle">
                            <div className="ilv-media-left mr-3 row">
                                <div className="col-sm-10">
                                    <input className="ilv-form-control d-inline-block"
                                        type="text"
                                        required={true}
                                        style={{minWidth: '280px' }}
                                        placeholder={Messages.get("LabelAddProcessStep")}
                                        ref="step-label" />
                                </div>
                                <div className="col-sm-2 dropdown">
                                    <a  data-toggle="dropdown" style={{ width: "30px", height: "30px", borderRadius: '2px', display: 'inline-block', backgroundColor: this.state.newStepColor }} />
                                    <div className="dropdown-menu" id="color-picker-dropdown">
                                        <TwitterPicker onChangeComplete={this.onColorPick} />
                                    </div>
                                </div>
                            </div>
                            <div className="ilv-media-body">
                                <button type="submit" className="ilv-btn ilv-btn-success">{Messages.get("LabelAdd")}</button>
                            </div>
                        </div>
                    </div>
                </form>
                
                {this.renderSteps()}
            </div>
        );
    }
});