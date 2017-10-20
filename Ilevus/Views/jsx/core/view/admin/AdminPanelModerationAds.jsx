var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var AdStore = require("ilevus/jsx/core/store/Ad.jsx");

var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
//var DateUtils = require("ilevus/jsx/core/util/DateUtils.jsx");


var router_test = require("react-router");


module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            ads: null,
            countPreviews: null,
            time: { h: "00", m: "05", s: "00"},
            seconds: 300,
            timer: 0
        };
    },
    componentDidMount() {
        var me = this;
        AdStore.on("retrieve-moderation-ads", (ads) => {
            me.setState({
                ads: ads,
                loading: false
            });

            if (this.state.ads) {
                //Inicia a Contagem
                this.startTimer();
            }

        }, me);
        AdStore.dispatch({
            action: AdStore.ACTION_RETRIEVE_MODERATIONS_ADS,
            data: {}
        });

        SystemStore.on("retrieve-definition-config", (config) => {
            me.setState({
                loading: false,
                config: config
            });

        }, me);
        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_DEFINITIONS
        });

        AdStore.on("count-previews-moderation-ad", (countPreviews) => {
            me.setState({
                loading: false,
                countPreviews: countPreviews
            });
        }, me);
        AdStore.dispatch({
            action: AdStore.ACTION_COUNT_PREVIEWS_MODERATION
        });

        AdStore.on("save-moderation-ad", () => {
            AdStore.dispatch({
                action: AdStore.ACTION_COUNT_PREVIEWS_MODERATION,
                data: {}
            });

            AdStore.dispatch({
                action: AdStore.ACTION_RETRIEVE_MODERATIONS_ADS,
                data: {}
            });
            this.renderAd();
            
        }, me);

        AdStore.on("leave-moderation-ad", () => {
            me.context.router.push("/admin/home");
        }, me);        
    },
    componentWillUnmount() {
        SystemStore.off(null, null, this);
        AdStore.off(null, null, this);
    },

    saveAdModeration(Status) {
        event.preventDefault();

        AdStore.dispatch({
            action: AdStore.ACTION_SAVE_MODERATION,
            data: {
                Id: this.state.ads.Id,
                Status: Status
            }
        });
    },

    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": (hours.toString().length == 1 ? "0" + hours : hours),
            "m": (minutes.toString().length == 1 ? "0" + minutes : minutes),
            "s": (seconds.toString().length == 1 ? "0" + seconds : seconds)
        };
        return obj;
    },

    startTimer() {
        if (this.state.timer == 0) {
            this.state.timer = setInterval(this.countDown, 1000);
        }
    },

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });
    
        // Verifica se acabou
        if (seconds == 0) { 
            clearInterval(this.state.timer);
            this.cancel();
        }
    },

    cancel() {
        AdStore.dispatch({
            action: AdStore.ACTION_LEAVE_MODERATION,
            data: {
                Id: this.state.ads.Id
            }
        });
        
    },
    
    catchModeration(adId) {
        AdStore.dispatch({
            action: AdStore.ACTION_CATCH_MODERATION,
            data: {
                Id: adId,
                Status: "OnAnalysing"
            }
        });
    },

    renderStartModeration() {
        return (
            <div className="row">
                <input className="ilv-btn ilv-btn-lg ilv-btn-success" id="btnStartModeration" type="button" value={Messages.get("LabelStart")} onClick={this.renderAd()} />
            </div>
            );
    },

    renderCountModerations() {
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        
        return (<strong className="pull-right">
                    {Messages.get("LabelDailyDoneModeration").replace("{0}", (this.state.countPreviews ? this.state.countPreviews.dailyCount : 0))} / 
                    {Messages.get("LabelMonthDoneModeration").replace("{0}", (this.state.countPreviews ? this.state.countPreviews.monthCount : 0))} / 
                    {Messages.get("LabelPrevMonthDoneModeration").replace("{0}", this.state.countPreviews ? this.state.countPreviews.prevMonthCount : 0)}
                </strong>);
    },

    renderAd() {
        if (!this.state.ads) {
            return <i>Nenhum anúncio a ser moderado</i>;
        }
        else {

        return (<form onSubmit={this.saveAdModeration}>

                <div className="row">
                    <div className="col-9">
                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelHeadline")}</label>
                            <span >{this.state.ads ? this.state.ads.Headline : "" }</span>
                        </div>

                        <div className="row">
                            <div className="ilv-form-group col-6">
                                <label className="ilv-form-label">{Messages.get("LabelAdImageDesktop")}</label>
                                <labal id="lbl_image_desktop">{this.state.ads ? <img src={(this.state.config ? JSON.parse(this.state.config.definitions).PathAds : "") + this.state.ads.ImageDesktop} style={{ width: "150px" }} /> : ""}</labal>
                            </div>

                            <div className="ilv-form-group col-6">
                                <label className="ilv-form-label">{Messages.get("LabelAdImageMobile")}</label>
                                <labal id="lbl_image_mobile">{this.state.ads ? <img src={(this.state.config ? JSON.parse(this.state.config.definitions).PathAds : "") + this.state.ads.ImageMobile} style={{ width: "150px" }} /> : ""}</labal>

                                <div className="ilv-form-group" style={{ marginTop: "15px"}}>
                                    <label className="ilv-form-label">
                                        {Messages.get("LabelAdUrl")}: <a href={this.state.ads ? this.state.ads.Link : ""} target="_blank" style={{wordWrap: "break-word"}}>{this.state.ads ? this.state.ads.Link : ""}</a>
                                    </label>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-3" style={{borderLeft: "1px solid #cfd7e6", paddingTop: "25px"}}>
                        <h4>Tempo: <br />{this.state.time.m}:{this.state.time.s}</h4>

                        <input className="ilv-btn ilv-btn-lg ilv-btn-success" type="button" value={Messages.get("LabelAdApproved")} onClick={this.saveAdModeration.bind(this, "Approved")} disabled={this.state.saving} style={{ marginBottom: "5px", width: "100%" }} />
                        <input className="ilv-btn ilv-btn-lg ilv-btn-destructive" type="button" value={Messages.get("LabelAdDenied")} onClick={this.saveAdModeration.bind(this, "Denied")} disabled={this.state.saving} style={{ marginLeft: "0px", marginBottom: "5px", width: "100%" }} />
                        <input className="ilv-btn ilv-btn-lg ilv-btn-default" type="button" value={Messages.get("LabelCancel")} onClick={this.cancel} style={{ marginLeft: "0px", width: "100%" }} />

                    </div>
                </div>
            </form>);
        }
    },
    
    render() {
        if (this.state.loading)
            return <LoadingGauge />;
        
        return (<div>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <strong>
                        {Messages.get("LabelModerationAds")}
                    </strong>
                    {this.renderCountModerations()}
                </div>
                <div className="ilv-card-body">
                    {this.renderAd()}
                </div>
            </div>
        </div>);
    }
});

