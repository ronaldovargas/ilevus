
var _ = require("underscore");
var S = require("string");
var moment = require("moment");
var React = require('react');

var WheelOfLifeStore = require("ilevus/jsx/core/store/coaching/WheelOfLife.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        process: React.PropTypes.object.isRequired,
        session: React.PropTypes.object.isRequired,
        sessionIndex: React.PropTypes.number.isRequired,
        tool: React.PropTypes.object.isRequired,
    },
    getDefaultProps() {
        return {
        };
    },
    getInitialState() {
        return {
            adding: false,
            saving: false,
        };
    },

    componentDidMount() {
        var me = this;
        WheelOfLifeStore.on("save-task", () => {

        }, me);
    },
    componentWillUnmount() {
        WheelOfLifeStore.off(null, null, this);
    },

    tweakAdding(event) {
        event && event.preventDefault();
        this.setState({adding: !this.state.adding});
    },

    saveTask(event) {
        event && event.preventDefault();
        WheelOfLifeStore.dispatch({
            action: WheelOfLifeStore.ACTION_SAVE_TASK,
            data: {
                ProcessId: this.props.process.Id,
                Session: this.props.sessionIndex,
                Description: this.refs['task-description'].value,
                Field: this.refs['task-field'].value,
                Deadline: this.refs['task-deadline'].value,
            }
        });
        this.props.tool.Tasks.push({
            Label: this.refs['task-description'].value,
            Field: this.refs['task-field'].value,
            Deadline: this.refs['task-deadline'].value,
        });
        this.tweakAdding();
    },

    editTask(index, event) {
        event && event.preventDefault();
        this.setState({ editing: index });
    },
    updateTask(index, event) {
        event && event.preventDefault();
        WheelOfLifeStore.dispatch({
            action: WheelOfLifeStore.ACTION_UPDATE_TASK,
            data: {
                ProcessId: this.props.process.Id,
                Session: this.props.sessionIndex,
                Task: index,
                Description: this.refs['edit-task-description'].value,
                Field: this.refs['edit-task-field'].value,
                Deadline: this.refs['edit-task-deadline'].value,
            }
        });
        this.props.tool.Tasks[index] = {
            Label: this.refs['edit-task-description'].value,
            Field: this.refs['edit-task-field'].value,
            Deadline: this.refs['edit-task-deadline'].value,
        };
        this.cancelEditing();
    },
    cancelEditing(event) {
        event && event.preventDefault();
        this.setState({editing: null});
    },

    removeTask(index, event) {
        event && event.preventDefault();
        WheelOfLifeStore.dispatch({
            action: WheelOfLifeStore.ACTION_REMOVE_TASK,
            data: {
                ProcessId: this.props.process.Id,
                Session: this.props.sessionIndex,
                Task: index,
            }
        });
        this.props.tool.Tasks.splice(index, 1);
        this.forceUpdate();
    },

    renderTasks() {
        if (this.props.tool.Tasks.length == 0) {
            return (<tr><td colSpan="4" className="text-center">
                <i>{Messages.get("TextNoTaskAdded")}</i>
            </td></tr>);
        }
        return this.props.tool.Tasks.map((task, index) => {
            return (this.state.editing == index ? this.renderEditForm(task, index):<tr key={"tool-task-" + index}>
                <td>{task.Label}</td>
                <td>{task.Field}</td>
                <td>{moment(task.Deadline.substr(0, 10)).format("DD/MM/Y")}</td>
                <td className="text-right">
                    {!!this.state.adding || (this.props.session.Status != 5) ? "":(<button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0" title={Messages.get("ActionEdit")} onClick={this.editTask.bind(this, index)}>
                        <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
                    </button>)}
                    {(this.props.session.Status != 5) ? "":(<button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0" title={Messages.get("LabelDelete")} onClick={this.removeTask.bind(this, index)}>
                        <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                    </button>)};
                </td>
            </tr>);
        });
    },

    renderEditForm(task, index) {
        return <tr key={"tool-task-" + index}><td colSpan="4">
            <form className="row" onSubmit={this.updateTask.bind(this, index)}>
                <div className="col">
                    <input type="text" className="ilv-form-control" placeholder={Messages.get("LabelDescription")} required={true} ref="edit-task-description" defaultValue={task.Label} />
                </div>
                <div className="col-2">
                    <select className="ilv-form-control" placeholder={Messages.get("LabelDescription")} required={true} ref="edit-task-field" defaultValue={task.Field}>
                        {this.props.tool.Fields.map((field, index) => {
                            return (<option key={"task-field-"+index} value={field.Label}>{field.Label}</option>);
                        })}
                    </select>
                </div>
                <div className="col-2">
                    <input type="date" className="ilv-form-control" placeholder={Messages.get("LabelDescription")} required={true} ref="edit-task-deadline" defaultValue={task.Deadline.substr(0, 10)} />
                </div>
                <div className="col-2 text-right">
                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean" onClick={this.cancelEditing} title={Messages.get("LabelCancel")}>X</button>
                    <button className="ilv-btn ilv-btn-sm ilv-btn-success" type="submit">{Messages.get("LabelSave")}</button>
                </div>
            </form>
        </td></tr>;
    },

    render() {
        return (<div className="row mb-5">
            <div className="col">
                <h4>{Messages.get("LabelTasks")}</h4>
                <table className="ilv-table">
                    <thead>
                        <tr>
                            <th>{Messages.get("LabelDescription")}</th>
                            <th width="160">{Messages.get("LabelField")}</th>
                            <th width="160">{Messages.get("LabelDeadline")}</th>
                            <th width="140"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTasks()}

                        {!this.state.adding ? (!!this.state.editing || (this.props.session.Status != 5) ? null:<tr>
                            <td colSpan="4" className="text-center">
                                <a className="font-weight-bold" href="javascript:;" onClick={this.tweakAdding}>+ {Messages.get("LabelAddTask")}</a>
                            </td>
                        </tr>) : (<tr><td colSpan="4">
                            <form className="row" onSubmit={this.saveTask}>
                                <div className="col">
                                    <input type="text" className="ilv-form-control" placeholder={Messages.get("LabelDescription")} required={true} ref="task-description" />
                                </div>
                                <div className="col-2">
                                    <select className="ilv-form-control" placeholder={Messages.get("LabelDescription")} required={true} ref="task-field">
                                        {this.props.tool.Fields.map((field, index) => {
                                            return <option key={"task-field-"+index} value={field.Label}>{field.Label}</option>;
                                        })}
                                    </select>
                                </div>
                                <div className="col-2">
                                    <input type="date" className="ilv-form-control" placeholder={Messages.get("LabelDescription")} required={true} ref="task-deadline" />
                                </div>
                                <div className="col-2 text-right">
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-clean" onClick={this.tweakAdding} title={Messages.get("LabelCancel")}>X</button>
                                    <button className="ilv-btn ilv-btn-sm ilv-btn-success" type="submit">{Messages.get("LabelSave")}</button>
                                </div>
                            </form>
                        </td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>);
    }
});