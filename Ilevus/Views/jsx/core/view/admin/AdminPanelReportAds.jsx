
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
            modeView: null,
            adsClicks: [],
            adsViews: [],
            adsEfficiency: [],
            adsConsumption: [],
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

        ReportStore.on("load-efficiency-report", (ads) => {
            me.setState({
                adsEfficiency: ads,
                loading: false
            });
        }, me);

        ReportStore.on("load-consumption-report", (ads) => {
            me.setState({
                adsConsumption: ads,
                loading: false
            });
        }, me);
        
        var di = new Date();
        di.setDate(1);
        //di.setMonth(di.getMonth() - 1);

        var de = new Date(di.getFullYear(), di.getMonth() + 1, 0);

        this.state.dtInit = ("0" + di.getDate()).slice(-2) + "/" + ("0" + (di.getMonth() + 1)).slice(-2) + "/" + di.getFullYear();
        this.state.dtEnd = ("0" + de.getDate()).slice(-2) + "/" + ("0" + (de.getMonth() + 1)).slice(-2) + "/" + de.getFullYear();

        this.state.modeView = "m";
        
        ReportStore.dispatch({
            action: ReportStore.ACTION_ADS_CLICKS,
            data: {
                Id: me.props.params.idAd,
                modeView: this.state.modeView,
                DtIni: this.state.dtInit,
                DtEnd: this.state.dtEnd
            }
        });

        ReportStore.dispatch({
            action: ReportStore.ACTION_ADS_VIEWS,
            data: {
                Id: me.props.params.idAd,
                modeView: this.state.modeView,
                DtIni: this.state.dtInit,
                DtEnd: this.state.dtEnd
            }
        });

        ReportStore.dispatch({
            action: ReportStore.ACTION_ADS_EFFICIENCY,
            data: {
                Id: me.props.params.idAd,
                modeView: this.state.modeView,
                DtIni: this.state.dtInit,
                DtEnd: this.state.dtEnd
            }
        });

        ReportStore.dispatch({
            action: ReportStore.ACTION_ADS_CONSUMPTION,
            data: {
                Id: me.props.params.idAd,
                modeView: this.state.modeView,
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

        //$("#rdbView1").prop("checked", true);
    },

    componentWillUnmount() {
        ReportStore.off(null, null, this);
    },

    chartOptionsClicks_Views: {
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
                    stepSize: 2,
                }
            }]
        }
    },

    chartOptionsEfficiency: {
        tooltips: {
            intersect: false,
            enabled: true,
            mode: 'index',
            callbacks: {
                label: function(tooltipItems, data) { 
                    var item = String(tooltipItems.yLabel).replace(",", ".");
                    var p = parseFloat(item).toFixed(2).split(".");
                    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
                        return num + (i && !(i % 3) ? "." : "") + acc;
                    }, "") + "," + p[1] + " %";
                    //return tooltipItems.yLabel + ' €';
                }
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        var item = String(value).replace(",", ".");
                        var p = parseFloat(item).toFixed(2).split(".");
                        return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
                            return num + (i && !(i % 3) ? "." : "") + acc;
                        }, "") + "," + p[1] + " %";
                    }
                }
            }]
        }
    },

    chartOptionsConsumption: {
        tooltips: {
            intersect: false,
            tooltipEvents: ["mousemove", "touchstart", "touchmove"],
            enabled: true,
            mode: 'index',
            callbacks: {
                label: function(tooltipItems, data) { 
                    var item = String(tooltipItems.yLabel).replace(",", ".");
                    var p = parseFloat(item).toFixed(2).split(".");
                    return "R$ " + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
                        return num + (i && !(i % 3) ? "." : "") + acc;
                    }, "") + "," + p[1];
                    //return tooltipItems.yLabel + ' €';
                }
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        var item = String(value).replace(",", ".");
                        var p = parseFloat(item).toFixed(2).split(".");
                        return "R$ " + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
                            return num + (i && !(i % 3) ? "." : "") + acc;
                        }, "") + "," + p[1];
                    }
                }
            }]
        }
    },

    formatToCurrency(num, type) {
        type = type || "BRL";
        var _formtas = ["BRL", "USD", "EUR", "PERCENT"];
        _formtas["BRL"] = {"prefix" : "R$ ", "suffix" : "", "decimal" : ",", "thousand" : "."};
        _formtas["USD"] = {"prefix" : "$ ", "suffix" : "", "decimal" : ".", "thousand" : ","};
        _formtas["EUR"] = {"prefix" : "", "suffix" : " €", "decimal" : ",", "thousand" : "."};
        _formtas["PERCENT"] = {"prefix" : "", "suffix" : " %", "decimal" : ".", "thousand" : ","};

        var p = parseFloat(num.trim()).toFixed(2).split(".");
        return _formtas[type]["prefix"] + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
            return num + (i && !(i % 3) ? _formtas[type]["thousand"] : "") + acc;
        }, "") + _formtas[type]["decimal"] + p[1] + _formtas[type]["suffix"];
    },
    parseDate(str) {
        var dmy = str.split('/');
        return new Date(dmy[2], dmy[1]-1, dmy[0]);
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
                    pointBackgroundColor: "rgba(255, 195, 10, 1)",
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
            ]
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
                    pointBackgroundColor: "rgba(238, 127, 52, 1)",
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
            ]
        };
    },

    getEfficiencyChartData() {
        var process = this.state.adsEfficiency, labels = [], data = [];
        for (var i = 0; i < process.length; i++) {
            labels.push(process[i].Key);
            data.push(process[i].Value);
        }

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
                    pointBackgroundColor: "rgba(255, 4, 4, 1)",
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
        var process = this.state.adsConsumption, labels = [], data = [];
        for (var i = 0; i < process.length; i++) {
            labels.push(process[i].Key);
            data.push(process[i].Value);
        }

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
                    pointBackgroundColor: "rgba(166, 166, 166, 1)",
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
            ]
        };
    },

    exportCSV(e) {
        /*var A = [['n','sqrt(n)']];

        for(var j=1; j<10; ++j){
            A.push([j, Math.sqrt(j)]);
        }*/

        var csvRows = [];

        var line = Messages.get("LabelPeriod");
        line = line.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        this.state.adsClicks.map((Header, index) =>
            line += (line != "" ? ";" : "") + Header.Key
        )
        csvRows.push(line);

        line = Messages.get("LabelClicks");
        line = line.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        this.state.adsClicks.map((clicks, index) =>
            line += (line != "" ? ";" : "") + clicks.Value
        )
        csvRows.push(line);

        line = Messages.get("LabelViews");
        line = line.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        this.state.adsViews.map((clicks, index) =>
            line += (line != "" ? ";" : "") + clicks.Value
        )
        csvRows.push(line);

        line = Messages.get("LabelEfficiency");
        line = line.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        this.state.adsEfficiency.map((clicks, index) =>
            line += (line != "" ? ";" : "") + clicks.Value
        )
        csvRows.push(line);

        line = Messages.get("LabelConsumption");
        line = line.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        this.state.adsConsumption.map((clicks, index) =>
            line += (line != "" ? ";" : "") + clicks.Value
        )
        csvRows.push(line);

        var csvString = csvRows.join('\n');
        var a         = document.createElement('a');
        a.href        = 'data:attachment/csv,' + encodeURIComponent(csvString);
        a.target      = '_blank';
        a.download    = 'Report-Ad.csv';

        document.body.appendChild(a);
        a.click();
    },
    
    eventloadDataGraphs() {
        var me = this;

        var DtInit = $('#DtInit').val();
        var DtEnd = $('#DtEnd').val();

        var blExecuteQuery = true;

        if (!(this.parseDate(DtInit) > this.parseDate(DtEnd))) {

            if (me.state.modeView == "d") {
                var diffDays = Math.abs(Math.round((this.parseDate(DtInit) - this.parseDate(DtEnd)) / (1000 * 60 * 60 * 24)));
                if (diffDays >= 30) {
                    blExecuteQuery = false;
                    alert("Período não pode ser superior a 30 dias");
                }
            }

            if (blExecuteQuery) {
                ReportStore.dispatch({
                    action: ReportStore.ACTION_ADS_CLICKS,
                    data: {
                        Id: me.props.params.idAd,
                        modeView: me.state.modeView,
                        DtIni: DtInit,
                        DtEnd: DtEnd
                    }
                });

                ReportStore.dispatch({
                    action: ReportStore.ACTION_ADS_VIEWS,
                    data: {
                        Id: me.props.params.idAd,
                        modeView: me.state.modeView,
                        DtIni: DtInit,
                        DtEnd: DtEnd
                    }
                });

                ReportStore.dispatch({
                    action: ReportStore.ACTION_ADS_EFFICIENCY,
                    data: {
                        Id: me.props.params.idAd,
                        modeView: me.state.modeView,
                        DtIni: DtInit,
                        DtEnd: DtEnd
                    }
                });

                ReportStore.dispatch({
                    action: ReportStore.ACTION_ADS_CONSUMPTION,
                    data: {
                        Id: me.props.params.idAd,
                        modeView: me.state.modeView,
                        DtIni: DtInit,
                        DtEnd: DtEnd
                    }
                });
            }
        } else {
            alert("Data inicial não pode ser maior do que a data final!");
        }



    },

    handleChange(e) {
        var value = e.target.value;
        this.setState({
            modeView: value
        })
    },

    createGridResult() {

        if (!this.state.adsClicks && !this.state.adsViews && !this.state.adsEfficiency && !this.state.adsConsumption) {
            return <i>Carregando Dados...</i>;
        }

        return (<table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    {this.state.adsClicks.map((Header, index) =>
                        <th>{Header.Key}</th>
                    )}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Cliques</td>
                    {this.state.adsClicks.map((clicks, index) =>
                        <td>{clicks.Value}</td>
                    )}
                </tr>
                <tr>
                    <td>Visualizacoes</td>
                    {this.state.adsViews.map((views, index) =>
                        <td>{views.Value}</td>
                    )}
                </tr>
                <tr>
                    <td>Eficiência</td>
                    {this.state.adsEfficiency.map((efficiency, index) =>
                        <td>{this.formatToCurrency(efficiency.Value, "PERCENT")}</td>
                    )}
                </tr>
                <tr>
                    <td>Consumo</td>
                    {this.state.adsConsumption.map((consumption, index) =>
                        <td>{this.formatToCurrency(consumption.Value, "BRL")}</td>
                    )}
                </tr>
            </tbody>
        </table>);
    },
    
    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
            <h5>{Messages.get("LabelReport")} <button className="ilv-btn ilv-btn-link pull-right" onClick={this.exportCSV}><i className="fa fa-download"></i></button></h5>
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
                             <div className="col-2">
                                <input className="ilv-btn ilv-btn-lg ilv-btn-success" type="button" value={Messages.get("LabelFilter")} onClick={this.eventloadDataGraphs} disabled={this.state.saving} style={{ marginTop: '30px' }} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="ilv-radio inline">
									<label htmlFor="rdbView1" className="mr-10">
										<input className="ilv-control-input" id="rdbView1" name="rdbView" ref="rdbViewM" value="m" type="radio" checked={this.state.modeView == "m"} onChange={this.handleChange} />
                                        <span className="ilv-control-indicator"></span>
                                        <span className="ilv-control-label">Mensal</span>
									</label>
                                
                                
									<label htmlFor="rdbView3">
										<input className="ilv-control-input" id="rdbView3" name="rdbView" ref="rdbViewD" value="d" type="radio" checked={this.state.modeView == "d"} onChange={this.handleChange} />
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
                    <Line data={this.getClicksChartData()} options={this.chartOptionsClicks_Views} />
                </div>

                <div className="col-md-6 mb-5">
                    <Line data={this.getViewsChartData()} options={this.chartOptionsClicks_Views} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-5">
                    <Line data={this.getEfficiencyChartData()} options={this.chartOptionsEfficiency} />
                </div>

                <div className="col-md-6 mb-5">
                    <Line data={this.getConsumptionChartData()} options={this.chartOptionsConsumption} />
                </div>
            </div>

            <div className="row">
                <div className="col-md-12 table-responsive">
                    {this.createGridResult()}
                </div>
            </div>

        </div>);
    }
});