
var _ = require("underscore");
var S = require("string");
var marked = require("marked");
var React = require('react');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var Line = require("react-chartjs-2").Line;

var CommitmentBg = "rgba(75,192,192,0.4)";
var FeedbackBg = "rgba(103, 58, 183, 0.2)";

module.exports = createClass({
    propTypes: {
        process: PropTypes.object.isRequired
    },
    getDefaultProps() {
        return {
            process: null
        };
    },

    chartOptions: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 10,
                    stepSize: 2,
                }
            }]
        }
    },

    getCommitmentChartData() {
        var process = this.props.process, labels = [], data = [];
        for (var i = 0; i < process.Sessions.length-1; i++) {
            labels.push(Messages.get("LabelSession") + " " + (i + 1));
            data.push(process.Sessions[i].Commitment);
        }
        var latest = process.Sessions[process.Sessions.length - 1];
        if (latest.Status >= 10) {
            labels.push(Messages.get("LabelSession") + " " + process.Sessions.length);
            data.push(latest.Commitment);
        }
        return {
            labels: labels,
            datasets: [
                {
                    label: Messages.get("LabelCommitment"),
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: CommitmentBg,
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(75,192,192,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }
            ],
        };
    },

    getFeedbackChartData() {
        var process = this.props.process, labels = [], data = [];
        for (var i = 0; i < process.Sessions.length-1; i++) {
            labels.push(Messages.get("LabelSession") + " " + (i + 1));
            data.push(process.Sessions[i].Rating);
        }
        var latest = process.Sessions[process.Sessions.length - 1];
        if (latest.Status >= 10) {
            labels.push(Messages.get("LabelSession") + " " + process.Sessions.length);
            data.push(latest.Rating);
        }
        return {
            labels: labels,
            datasets: [
                {
                    label: Messages.get("LabelFeedback"),
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: FeedbackBg,
                    borderColor: 'rgba(103, 58, 183,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(103, 58, 183,1)',
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(103, 58, 183,1)',
                    pointHoverBorderColor: 'rgba(103, 58, 183,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }
            ],
        };
    },

    render() {
        return (<div>
            <div className="mb-5">
                <Line data={this.getCommitmentChartData()} options={this.chartOptions} />
            </div>
            <div className="mb-5">
                <Line data={this.getFeedbackChartData()} options={this.chartOptions} />
            </div>
        </div>);
    }
});
