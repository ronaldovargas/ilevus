
var marked = require("marked");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var CoachingStore = require("ilevus/jsx/core/store/Coaching.jsx");
var WheelOfLifeStore = require("ilevus/jsx/core/store/coaching/WheelOfLife.jsx");

var EditableTextArea = require("ilevus/jsx/core/widget/coaching/EditableTextArea.jsx");
var SessionTimer = require("ilevus/jsx/core/widget/coaching/SessionTimer.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Radar = require('react-chartjs-2').Radar;

module.exports = React.createClass({
    contextTypes: {
        isCoach: React.PropTypes.bool.isRequired,
        process: React.PropTypes.object.isRequired,
        router: React.PropTypes.object,
    },

    chartOptions: {
        scale: {
            lineArc: false,
            ticks: {
                beginAtZero: true,
                max: 10,
                stepSize: 2.5,
            },
        }
    },

    getInitialState() {
        var session = this.context.process.Sessions[this.props.params.session];
        return {
            session: session,
            tool: session.WheelOfLifeTool,
            loading: !session.WheelOfLifeTool,
            field: 0,
            fieldEvaluation: session.WheelOfLifeTool ? session.WheelOfLifeTool.Fields[0].Evaluation : 0,
        };
    },

    componentDidMount() {
        var me = this;
        WheelOfLifeStore.on("initialize-tool", (toolDef) => {
            console.log(toolDef);
            me.setState({
                tool: toolDef,
                loading: false,
                fieldEvaluation: toolDef.Fields[this.state.field].Evaluation,
            });
        }, me);

        CoachingStore.on("finish-session", (process) => {
            location.back();
        }, me);

        if (this.state.loading) {
            WheelOfLifeStore.dispatch({
                action: WheelOfLifeStore.ACTION_INITIALIZE_TOOL,
                data: {
                    ProcessId: me.props.params.id,
                    Session: me.props.params.session,
                }
            });
        }
    },
    
    componentWillUnmount() {
        CoachingStore.off(null, null, this);
        WheelOfLifeStore.off(null, null, this);
    },

    componentWillReceiveProps(newProps, newContext) {
        var session = newContext.process.Sessions[newProps.params.session];
        if ((this.props.params.id != newProps.params.id) || (this.props.params.session != newProps.params.session)) {
            this.setState({
                session: session,
                tool: session.WheelOfLifeTool,
                loading: !session.WheelOfLifeTool,
                field: 0,
                fieldEvaluation: session.WheelOfLifeTool ? session.WheelOfLifeTool.Fields[0].Evaluation : 0,
            });
            if (!session.WheelOfLifeTool) {
                WheelOfLifeStore.dispatch({
                    action: WheelOfLifeStore.ACTION_INITIALIZE_TOOL,
                    data: {
                        ProcessId: newProps.params.id,
                        Session: newProps.params.session,
                    }
                });
            }
        } else {
            this.setState({
                session: session,
                tool: session.WheelOfLifeTool,
            });
        }
    },

    getChartData() {
        var labels = [], data = [], fields = this.state.tool.Fields;
        for (var i = 0; i < fields.length; i++) {
            labels.push(fields[i].Label);
            data.push(fields[i].Evaluation);
        }
        return {
            labels: labels,
            datasets: [
              {
                  label: Messages.get("LabelGrade"),
                  backgroundColor: "rgba(103, 58, 183, 0.2)",
                  borderColor: 'rgba(103, 58, 183,1)',
                  pointBackgroundColor: '#fff',
                  pointBorderColor: 'rgba(103, 58, 183,1)',
                  ointHoverBackgroundColor: 'rgba(103, 58, 183,1)',
                  pointHoverBorderColor: 'rgba(103, 58, 183,1)',
                  data: data
              }
            ]
        };
    },

    previousField(event) {
        event && event.preventDefault()
        var field = this.state.field - 1;
        if (this.state.field == 0) {
            field = this.state.tool.Fields.length - 1;
        }
        this.setState({
            field: field,
            fieldEvaluation: this.state.tool.Fields[field].Evaluation,
        });
    },
    nextField(event) {
        event && event.preventDefault()
        var field = this.state.field + 1;
        if (this.state.field == (this.state.tool.Fields.length - 1)) {
            field = 0;
        }
        this.setState({
            field: field,
            fieldEvaluation: this.state.tool.Fields[field].Evaluation,
        });
    },

    saveEvaluation(event) {
        event && event.preventDefault();
        WheelOfLifeStore.dispatch({
            action: WheelOfLifeStore.ACTION_SAVE_EVALUATION,
            data: {
                ProcessId: this.props.params.id,
                Session: this.props.params.session,
                Field: this.state.field,
                Evaluation: this.state.fieldEvaluation,
            }
        });
        this.state.tool.Fields[this.state.field].Evaluation = this.state.fieldEvaluation;
        this.forceUpdate();
    },
    onEvaluationChange() {
        var grade = this.refs['field-grade'].valueAsNumber;
        if (grade === undefined || grade < 0 || grade > 10) {
            Toastr.remove();
            Toastr.error(Messages.get("TextTypeValidGrade"));
            return;
        }
        this.setState({
            fieldEvaluation: grade
        });
    },

    learningsChange(newValue) {
        this.state.tool.Learnings = newValue;
        this.forceUpdate();
        WheelOfLifeStore.dispatch({
            action: WheelOfLifeStore.ACTION_SAVE_LEARNINGS,
            data: {
                ProcessId: this.props.params.id,
                Session: this.props.params.session,
                Learnings: newValue,
            }
        });
    },

    finish(event) {
        event && event.preventDefault();
        history.back();
    },

    renderField(fieldIndex) {
        var field = this.state.tool.Fields[fieldIndex];
        return (<div className="col mb-3">
            <h3 className="mb-3">{Messages.get("LabelField")}: {field.Label}</h3>
            <div className="ilv-markdown ilv-form-group" dangerouslySetInnerHTML={{__html: marked(field.Instructions)}} />
            <div className="ilv-form-group">
                <label className="ilv-form-label">{Messages.get("LabelGrade")}</label>
                <input className="ilv-form-control" type="number" max="10" min="0" value={this.state.fieldEvaluation}
                       onBlur={this.saveEvaluation} ref="field-grade" onChange={this.onEvaluationChange} />
            </div>
            <a className="font-weight-bold mr-4" href="#" onClick={this.previousField}>&#8592; {Messages.get("LabelPrevious")}</a>
            <a className="font-weight-bold" href="#" onClick={this.nextField}>{Messages.get("LabelNext")} &#8594;</a>
        </div>);
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }

        var session = this.context.process.Sessions[parseInt(this.props.params.session)];
        return (
            <div className="container my-5">
                <div className="row mb-2">
                    <div className="col">
                        <div className="ilv-media mb-3">
                            <div className="ilv-media-body">
                                <h1>{Messages.get("LabelWheelOfLife")}</h1>
                            </div>
                            <div className="ilv-media-right">
                                <button className="ilv-btn ilv-btn-primary" onClick={this.finish}>{Messages.get("LabelFinish")}</button>
                            </div>
                        </div>
                        {this.renderField(this.state.field)}
                    </div>

                    <div className="col-5">
                        <SessionTimer ref="timer"
                                      process={this.context.process}
                                      session={session}
                                      isCoach={this.context.isCoach} />
                        <Radar data={this.getChartData()} options={this.chartOptions} />
                    </div>
                </div>
                

                <div className="row mb-5">
                    <div className="col-12">
                        <EditableTextArea label={Messages.get('LabelLearning')}
                                          value={this.state.tool.Learnings}
                                          editable={!this.context.isCoach}
                                          onChange={this.learningsChange} />
                    </div>
                </div>

                {/*<div className="row mb-5">
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
                                <tr>
                                    <td>Fazer check-up anual</td>
                                    <td>Saúde</td>
                                    <td>Fev / 2017</td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Ler livros sobre finanças</td>
                                    <td>Finanças</td>
                                    <td>Mar / 2017</td>
                                    <td className="text-right">
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
                                        </button>
                                        <button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                            <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        <a className="font-weight-bold" href="javascript:;">+ {Messages.get("LabelAddTask")}</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>*/}

            </div>
        );
    }
});