
var marked = require("marked");
var React = require("react");
var Link = require("react-router").Link;

var WheelOfLifeStore = require("ilevus/jsx/core/store/coaching/WheelOfLife.jsx");

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
        };
    },

    componentDidMount() {
        var me = this;
        WheelOfLifeStore.on("initialize-tool", (toolDef) => {
            me.setState({
                tool: toolDef,
                loading: false,
            });
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
        WheelOfLifeStore.off(null, null, this);
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

    saveEvaluation(index, event) {
        event && event.preventDefault();
    },

    renderField(field, fieldIndex) {
        return (<div className="col mb-3">
            <h3 className="mb-3">{Messages.get("LabelField")}: {field.Label}</h3>
            <div className="ilv-markdown ilv-form-group" dangerouslySetInnerHTML={{__html: marked(field.Instructions)}} />
            <form className="ilv-form-group" onSubmit={this.saveEvaluation.bind(this, fieldIndex)}>
                <label className="ilv-form-label">{Messages.get("LabelGrade")}</label>
                <input className="ilv-form-control" type="number" max="10" min="0" defaultValue={field.Evaluation} />
            </form>
            <a className="font-weight-bold mr-4" href="#">&#8592; {Messages.get("LabelPrevious")}</a>
            <a className="font-weight-bold" href="#">{Messages.get("LabelNext")} &#8594;</a>
        </div>);
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        console.log(this.state.tool);
        return (
            <div className="container my-5">
                <div className="row mb-5">
                    <div className="col-12 mb-5">
                        <div className="ilv-media">
                            <div className="ilv-media-body">
                                <h1>{Messages.get("LabelWheelOfLife")}</h1>
                            </div>
                            <div className="ilv-media-right">
                                <button className="ilv-btn ilv-btn-primary">{Messages.get("LabelFinish")}</button>
                                <button className="ilv-btn">{Messages.get("LabelSaveDraft")}</button>
                            </div>
                        </div>
                    </div>

                    {this.renderField(this.state.tool.Fields[this.state.field])}
                    
                    <div className="col mb-3">
                        <Radar data={this.getChartData()} options={this.chartOptions} />
                    </div>
                </div>
                <hr className="mb-5" />
                <div className="row mb-5">
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
                </div>
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="ilv-form-group">
                            <h4>{Messages.get("LabelLearning")}</h4>
                            <textarea className="ilv-form-control" placeholder={Messages.get("PlaceholderDescribeYourWhatYouLearned")}></textarea>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});