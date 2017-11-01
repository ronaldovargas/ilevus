
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");


var ReportStore = require("ilevus/jsx/core/store/Reports.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var Line = require("react-chartjs-2").Line;
//var LineClicks = require("react-chartjs-2").Line;
//var LineViews = require("react-chartjs-2").Line;
//var LineEfficiency = require("react-chartjs-2").Line;
//var LineConsumption = require("react-chartjs-2").Line;

var CommitmentBg = "rgba(255, 255, 255, 0)";
var FeedbackBg = "rgba(103, 58, 183, 0.2)";

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            dtInit: null,
            dtEnd: null,
            adsClicks: [],
            adsViews: [],
            loading: true
        };
    },
    componentDidMount() {
        var me = this;
        me.setState({
            loading: false
        });

        ReportStore.on("load-clicks-report", (ads) => {
            me.setState({
                adsClicks: ads,
                loading: false
            });
        }, me);

        ReportStore.on("load-views-report", (ads) => {
            me.setState({
                adsViews: ads,
                loading: false
            });
        }, me);

        


        var di = new Date();
        di.setDate(1);
        //di.setMonth(di.getMonth() - 1);

        var de = new Date(di.getFullYear(), di.getMonth() + 1, 0);

        this.state.dtInit = ("0" + di.getDate()).slice(-2) + "/" + ("0" + (di.getMonth() + 1)).slice(-2) + "/" + di.getFullYear();
        this.state.dtEnd = ("0" + de.getDate()).slice(-2) + "/" + ("0" + (de.getMonth() + 1)).slice(-2) + "/" + de.getFullYear();

        ReportStore.dispatch({
            action: ReportStore.ACTION_ADS_CLICKS,
            data: {
                Id: me.props.params.idAd,
                modeView: "m",
                DtIni: this.state.dtInit,
                DtEnd: this.state.dtEnd
            }
        });

        ReportStore.dispatch({
            action: ReportStore.ACTION_ADS_VIEWS,
            data: {
                Id: me.props.params.idAd,
                modeView: "m",
                DtIni: this.state.dtInit,
                DtEnd: this.state.dtEnd
            }
        });
    },

    componentDidUpdate() {
        
        var di = new Date();
        //di.setDate(1);
        var de = new Date(di.getFullYear() - 1, di.getMonth() + 1, di.getDate());

        var dtInit = ("0" + di.getDate()).slice(-2) + "/" + ("0" + (di.getMonth() + 1)).slice(-2) + "/" + di.getFullYear();
        var dtEnd = ("0" + de.getDate()).slice(-2) + "/" + ("0" + (de.getMonth() + 1)).slice(-2) + "/" + de.getFullYear();

        jQuery('input[id="DtInit"], input[id="DtEnd"]').daterangepicker({
            singleDatePicker: true,
            locale: {
                format: 'DD/MM/YYYY'
            },
            opens: 'right',
            drops: 'down',
            showDropdowns: true,
            minDate: de,
            maxDate: di
        });

        $("#rdbView1").prop("checked", true);
    },

    componentWillUnmount() {
        ReportStore.off(null, null, this);
    },

    chartOptions: {
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    //max: 10,
                    //stepSize: 2,
                }
            }]
        }
    },

    getClicksChartData() {
        var process = this.state.adsClicks, labels = [], data = [];
        for (var i = 0; i < process.length; i++) {
            labels.push(process[i].Key);
            data.push(parseInt(process[i].Value));
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: "Clicks", //Messages.get("LabelCommitment"),
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(255, 195, 10, 1)",
                    borderColor: "rgba(255, 195, 10, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(255, 195, 10, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255, 195, 10, 1)",
                    pointHoverBorderColor: "rgba(255, 195, 10, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }
            ],
        };
    },

    getViewsChartData() {
        var process = this.state.adsViews, labels = [], data = [];
        for (var i = 0; i < process.length; i++) {
            labels.push(process[i].Key);
            data.push(parseInt(process[i].Value));
        }
        return {
            labels: labels,
            datasets: [
                {
                    label: "Visualizações", //Messages.get("LabelCommitment"),
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(238, 127, 52, 1)",
                    borderColor: "rgba(238, 127, 52, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(238, 127, 52, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(238, 127, 52, 1)",
                    pointHoverBorderColor: "rgba(238, 127, 52, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }
            ],
        };
    },

    getEfficiencyChartData() {
        var process = this.props.process, labels = [], data = [];
        /*for (var i = 0; i < process.Sessions.length - 1; i++) {
            labels.push(Messages.get("LabelSession") + " " + (i + 1));
            data.push(process.Sessions[i].Commitment);
        }*/
        labels.push("Jan", "Fev");
        data.push("45", "89");
        /*var latest = process.Sessions[process.Sessions.length - 1];
        if (latest.Status >= 10) {
            labels.push(Messages.get("LabelSession") + " " + process.Sessions.length);
            data.push(latest.Commitment);
        }*/
        return {
            labels: labels,
            datasets: [
                {
                    label: "Efetividade", //Messages.get("LabelCommitment"),
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(255, 4, 4, 1)",
                    borderColor: "rgba(255, 4, 4, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(255, 4, 4, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255, 4, 4, 1)",
                    pointHoverBorderColor: "rgba(255, 4, 4, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false,
                }
            ],
        };
    },

    getConsumptionChartData() {
        var process = this.props.process, labels = [], data = [];
        /*for (var i = 0; i < process.Sessions.length - 1; i++) {
            labels.push(Messages.get("LabelSession") + " " + (i + 1));
            data.push(process.Sessions[i].Commitment);
        }*/
        labels.push("Jan", "Fev");
        data.push("12.50", "36.00");
        /*var latest = process.Sessions[process.Sessions.length - 1];
        if (latest.Status >= 10) {
            labels.push(Messages.get("LabelSession") + " " + process.Sessions.length);
            data.push(latest.Commitment);
        }*/
        return {
            labels: labels,
            datasets: [
                {
                    label: "Consumo", //Messages.get("LabelCommitment"),
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(166, 166, 166, 1)",
                    borderColor: "rgba(166, 166, 166, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(166, 166, 166, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(166, 166, 166, 1)",
                    pointHoverBorderColor: "rgba(166, 166, 166, 1)",
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
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
            <h5>{Messages.get("LabelReport")} <button className="ilv-btn ilv-btn-link pull-right"><i className="fa fa-download"></i></button></h5>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <div className="ilv-media ilv-media-middle">
                        <div className="ilv-media-body">
                            <strong>{Messages.get("LabelFilter")}</strong>
                        </div>
                    </div>
                </div>
                <div className="ilv-card-body" id="productivity-container">
                    
                    <form className="tab-content">
                        <div className="row">
                            <div className="col-4">
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("LabelDataInicio")}</label>
                                    <input className="ilv-form-control" type="text" id="DtInit" ref="DtInit" defaultValue={this.state.dtInit} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("LabelDataFinal")}</label>
                                    <input className="ilv-form-control" type="text" id="DtEnd" ref="DtEnd" defaultValue={this.state.dtEnd} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="ilv-radio inline">
									<label htmlFor="rdbView1" className="mr-10">
										<input className="ilv-control-input" id="rdbView1" name="rdbView" ref="rdbView" value="m" type="radio" />
                                        <span className="ilv-control-indicator"></span>
                                        <span className="ilv-control-label">Mensal</span>
									</label>
                                
                                
									<label htmlFor="rdbView2" className="mr-10">
										<input className="ilv-control-input" id="rdbView2" name="rdbView" ref="rdbView" value="w" type="radio" />
                                        <span className="ilv-control-indicator"></span>
                                        <span className="ilv-control-label">Semana</span>
									</label>
                                
									<label htmlFor="rdbView3">
										<input className="ilv-control-input" id="rdbView3" name="rdbView" ref="rdbView" value="d" type="radio" />
                                        <span className="ilv-control-indicator"></span>
                                        <span className="ilv-control-label">Diário</span>
									</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-5">
                    <Line data={this.getClicksChartData()} options={this.chartOptions} />
                </div>

                <div className="col-md-6 mb-5">
                    <Line data={this.getViewsChartData()} options={this.chartOptions} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-5">
                    <Line data={this.getEfficiencyChartData()} options={this.chartOptions} />
                </div>

                <div className="col-md-6 mb-5">
                    <Line data={this.getConsumptionChartData()} options={this.chartOptions} />
                </div>
            </div>

        </div>);
    }
});