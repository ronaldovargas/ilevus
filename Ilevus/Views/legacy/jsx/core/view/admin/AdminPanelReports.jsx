
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");


var ReportStore = require("ilevus/jsx/core/store/Reports.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            dtInit: null,
            dtEnd: null,
            loading: true
        };
    },
    componentDidMount() {
        var me = this;
        me.setState({
            loading: false
        });

        var di = new Date();
        di.setDate(1);
        di.setMonth(di.getMonth() - 1);

        var de = new Date(di.getFullYear(), di.getMonth() + 1, 0);
        
        this.state.dtInit = ("0" + di.getDate()).slice(-2) + "/" + ("0" + (di.getMonth() + 1)).slice(-2) + "/" + di.getFullYear(); //di.getFullYear() + "-" + (di.getMonth() + 1) + "-" + di.getDate();
        this.state.dtEnd = ("0" + de.getDate()).slice(-2) + "/" + ("0" + (de.getMonth() + 1)).slice(-2) + "/" + de.getFullYear(); //de.getFullYear() + "-" + (de.getMonth() + 1) + "-" + de.getDate();
        


        jQuery(document).on("click", "a[id*='lnkExpand']", function () {
            jQuery(this).find("i").toggleClass("fa-plus").toggleClass("fa-minus");


            jQuery('input[id="DtInit"], input[id="DtEnd"]').daterangepicker({
                singleDatePicker: true,
                locale: {
                    format: 'DD/MM/YYYY'
                },
                opens: 'right',
                drops: 'down',
                showDropdowns: true
            });

        });

    },
    componentWillUnmount() {
        ReportStore.off(null, null, this);
    },

    downloadProductivityCSV(event) {
        event.stopPropagation();
        ReportStore.dispatch({
            action: ReportStore.ACTION_DOWNLOAD_PRODUTIVITY_CSV,
            data: {
                DtInit: this.refs['DtInit'].value,
                DtEnd: this.refs['DtEnd'].value,
                SearchTerm: this.refs['SearchTerm'].value
            }
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <div className="ilv-media ilv-media-middle">
                        <div className="ilv-media-body">
                            <a href={"#productivity-container"} id="lnkExpand" data-toggle="collapse"><i className="fa fa-plus"></i></a>&nbsp;&nbsp;
                            <strong>{Messages.get("LabelModeratorsProductivity")}</strong>
                        </div>
                        <div className="ilv-media-right">
                            <button className="ilv-btn ilv-btn-link" onClick={this.downloadProductivityCSV}><i className="fa fa-download"></i></button>
                        </div>
                    </div>
                </div>
                <div className="ilv-card-body collapse" id="productivity-container">
                    
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
                            <div className="col-4">
                                <div className="ilv-form-group">
                                    <label className="ilv-form-label">{Messages.get("LabelSearch")}</label>
                                    <input className="ilv-form-control" type="text" id="SearchTerm" ref="SearchTerm" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        
        </div>);
    }
});