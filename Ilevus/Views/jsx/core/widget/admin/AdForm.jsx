
var _ = require("underscore");
var S = require("string");
var moment = require("moment");
var React = require("react");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var ModalAd = require("ilevus/jsx/core/widget/admin/AdModal.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var AdStore = require("ilevus/jsx/core/store/Ad.jsx");
var SystemStore = require("ilevus/jsx/core/store/System.jsx");

module.exports = React.createClass({
    propTypes: {
        ad: React.PropTypes.object,
        onSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            ad: null,
            onSubmit: null,
            onCancel: null
        };
    },
    getInitialState() {
        return {
            saving: false,
            activated: this.props.ad ? this.props.ad.Active : false,
            keywords: this.props.ad ? this.props.ad.Keywords : []
        };
    },

    componentDidMount() {
        var me = this;
        AdStore.on("save-ad", (ad) => {
            me.setState({
                saving: false
            });
            me.props.onSubmit(ad);
        }, me);
        AdStore.on("fail", (meeting) => {
            me.setState({
                saving: false
            });
        }, me);
        SystemStore.on("retrieve-definition-config", (config) => {
            me.setState({
                loading: false,
                config: config
            });
        }, me);
        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_DEFINITIONS
        });

        jQuery("#txtbxDailyBudgetCap").maskMoney({ thousands: ".", decimal: ",", prefix: "R$ ", allowZero: true });
        jQuery("#txtbxDailyBudgetCap").trigger('mask.maskMoney');
    },
    componentWillUnmount() {
        AdStore.off(null, null, this);
    },

    alertAdInfoSize(dimensao, event) {
        event && event.preventDefault();
        ModalAd.alert(Messages.get("ActionAdImageMaxSize"), <p>{Messages.get("TextAdImageMaxSize").replace("{0}", dimensao)}</p>,
        "image_desktop");
    },

    cancel(event) {
        event && event.preventDefault();
        this.props.onCancel();
    },
    saveAd(event) {
        event && event.preventDefault();
        this.setState({
            saving: true
        });
        AdStore.dispatch({
            action: AdStore.ACTION_SAVE,
            data: {
                Id: this.props.ad ? this.props.ad.Id : undefined,
                Headline: this.refs['headline'].value.substring(0, 100),
                //Image: this.refs['image'].value,
                Image_Desktop: this.refs['image_desktop'].value,
                Image_Mobile: this.refs['image_mobile'].value,
                Image_Desktop_old: this.refs['image_desktop_old'].value,
                Image_Mobile_old: this.refs['image_mobile_old'].value,
                Link: this.refs['link'].value,
                DailyBudgetCap: this.refs['DailyBudgetCap'].value,
                Active: this.state.activated,
                Keywords: this.state.keywords
            }
        });
    },

    addKeyword(event) {
        event && event.preventDefault();
        var keyword = S(this.refs['keyword'].value);
        if (!keyword.isEmpty()) {
            this.state.keywords.push(keyword.s);
            this.refs['keyword'].value = "";
            this.forceUpdate();
        }
    },
    removeKeyword(index, event) {
        event && event.preventDefault();
        this.state.keywords.splice(index, 1);
        this.forceUpdate();
    },
    activatedChange() {
        this.setState({
            activated: !this.state.activated
        });
    },
    
    uploadDesktopImage(imageLimitSize, event) {
        event && event.preventDefault();
        ModalAd.mostrar(imageLimitSize, Messages.get("ActionSendImageDesktop"), <p>{Messages.get("TextSendImageDesktop")}</p>, "image_desktop", false);
    },
    uploadMobileImage(imageLimitSize, event) {
        event && event.preventDefault();
        ModalAd.mostrar(imageLimitSize, Messages.get("ActionSendImageMobile"), <p>{Messages.get("TextSendImageMobile")}</p>, "image_mobile", true);
    },

    render() {

        if (!this.state.config)
            return <LoadingGauge />;
        

        var limitSize = (this.state.config ? JSON.parse(this.state.config.definitions).AdsMaxSize : 0);
        var pathImage = (this.state.config ? JSON.parse(this.state.config.definitions).UrlRetriviedAds : "");
        
        return (
            <div className="row">
            <div className="col">
                <h4>{!this.props.ad ? Messages.get("LabelNewAd") : Messages.get("LabelEditAd")}</h4>
                <form onSubmit={this.saveAd }>
                    <div className="ilv-form-group">
                        <label className="ilv-form-label">{Messages.get("LabelHeadline")}</label>
                        <input className="ilv-form-control" type="text" spellCheck={false} ref="headline" maxLength="100" defaultValue={this.props.ad ? this.props.ad.Headline : "" } />
                    </div>
                    <div className="ilv-form-group">
                        <label className="ilv-form-label">{Messages.get("LabelAdImageDesktop")}</label>

                            <labal id="lbl_image_desktop">{this.props.ad ? <img src={(this.state.config ? JSON.parse(this.state.config.definitions).UrlRetriviedAds : "") + this.props.ad.ImageDesktop} style={{ width: "150px" } } /> : ""}</labal><br />
                            <button className="ilv-btn ilv-btn-neutral" onClick={this.uploadDesktopImage.bind(this, limitSize) }>{Messages.get("ActionSendImageDesktop")}</button>
                            &nbsp;&nbsp;<a href="javascript:;" onClick={this.alertAdInfoSize.bind(this, "240px X 475px")}><i className="fa fa-2x fa-info-circle"> </i></a>

                        <input type="hidden" id="image_desktop_old" ref="image_desktop_old" defaultValue={this.props.ad ? this.props.ad.ImageDesktop : "" } />
                        <input type="hidden" ref="image_desktop" id="image_desktop" />
                    </div>

                    <div className="ilv-form-group">
                        <label className="ilv-form-label">{Messages.get("LabelAdImageMobile")}</label>

                            <labal id="lbl_image_mobile">{this.props.ad ? <img src={(this.state.config ? JSON.parse(this.state.config.definitions).UrlRetriviedAds : "") + this.props.ad.ImageMobile} style={{ width: "150px" } } /> : ""}</labal><br />
                            <button className="ilv-btn ilv-btn-neutral" onClick={this.uploadMobileImage.bind(this, limitSize) }>{Messages.get("ActionSendImageMobile")}</button>
                            &nbsp;&nbsp;<a href="javascript:;" onClick={this.alertAdInfoSize.bind(this, "280px X 115px")}><i className="fa fa-2x fa-info-circle"> </i></a>

                        <input type="hidden" id="image_mobile_old" ref="image_mobile_old" defaultValue={this.props.ad ? this.props.ad.ImageMobile : ""} />
                        <input type="hidden" ref="image_mobile" id="image_mobile" />
                    </div>

                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelAdUrl")}</label>
                            <input className="ilv-form-control" type="url" spellCheck={false} ref="link" defaultValue={this.props.ad ? this.props.ad.Link:""} />
                        </div>

                        <div className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelAdDailyBudgetCap")}</label>
                            <input className="ilv-form-control" type="text" spellCheck={false} id="txtbxDailyBudgetCap" ref="DailyBudgetCap" defaultValue={this.props.ad ? parseFloat(this.props.ad.DailyBudgetCap).toFixed(2) : parseFloat(0).toFixed(2)} />
                        </div>                        

                    <fieldset className="ilv-form-group">
                        <label className="ilv-form-label">{Messages.get("LabelKeywords")}</label>
                        <div className="ilv-input-group">
                            <input className="ilv-form-control" type="text" spellCheck={false} ref="keyword" />
                            <div className="ilv-input-group-btn">
                                <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-success" onClick={this.addKeyword }>
                                    <i className="ilv-icon material-icons md-24">&#xE145;</i>
                                </button>
                            </div>
                        </div>
                        <div className="ilv-tag-input m-b-1 ilv-text-xs-center" style={{ backgroundColor: '#f5f7f9' }} readOnly={true }>
                            {this.state.keywords.length == 0 ?
                                    <i>{Messages.get("TextNoKeywordsAddedYet")}</i>
                                    :
                                    this.state.keywords.map((keyword, index) => {
                                        return <span className="ilv-tag" key={"keyword-" + index }>
                                        {keyword}<a title={Messages.get("ActionRemove")} onClick={this.removeKeyword.bind(this, index) }>&times;</a>
                                    </span>;
                                    })
}
                        </div>
                    </fieldset>

                    <div className="ilv-form-group">
                            <div className="ilv-checkbox">
								<label htmlFor="ad-activated">
									<input className="ilv-control-input" type="checkbox" id="ad-activated" name="ad-activated" onChange={this.activatedChange} checked={this.state.activated } />
                                    <span className="ilv-control-indicator"></span>
                                    <span className="ilv-control-label">{Messages.get("LabelAdActivated")}</span>
								</label>
                            </div>
                    </div>

                    <input className="ilv-btn ilv-btn-lg ilv-btn-primary" type="submit" value={Messages.get("LabelSave")} disabled={this.state.saving } />
                    <input className="ilv-btn ilv-btn-lg ilv-btn-clean" type="button" value={Messages.get("LabelCancel")} onClick={this.cancel } />
                </form>
            </div>
        </div>
        )
    }
});

