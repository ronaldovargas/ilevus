var S = require("string");
var $ = require("jquery");
var _ = require("underscore");
var moment = require("moment");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var AdStore = require("ilevus/jsx/core/store/Ad.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
//var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var AdForm = require("ilevus/jsx/core/widget/admin/AdForm.jsx");

//var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            ads_balance: null,
            ads: null,
            adding: false,
            editing: null
        };
    },
    componentDidMount() {
        var me = this;
        AdStore.on("retrieve-ads-balance", (ads_balance) => {
            me.setState({
                ads_balance: ads_balance,
                loading: false
            });
        }, me);

        AdStore.on("retrieve-ads", (ads) => {
            me.setState({
                ads: ads,
                loading: false
            });
        }, me);

        AdStore.dispatch({
            action: AdStore.ACTION_RETRIEVE_ADS,
            data: {}
        });

        AdStore.dispatch({
            action: AdStore.ACTION_RETRIEVE_ADS_BALANCE,
            data: {}
        });
        /*AdStore.dispatch({
            action: AdStore.ACTION_RETRIEVE_ADS,
            data: {}
        });*/

        /*AdStore.dispatch({
            action: AdStore.ACTION_RETRIEVE_ADS,
            data: {}
        });*/
    },
    componentWillUnmount() {
        AdStore.off(null, null, this);
    },

    onNewAd(event) {
        event && event.preventDefault();
        this.setState({
            adding: true,
            editing: null
        });
    },

    onAddCredit(event) {
        event && event.preventDefault();
        /*this.setState({
            adding: true,
            editing: null
        });*/
        alert('adicionar crédito!');
    },


    onEditingAd(ad, event) {
        event && event.preventDefault();
        this.setState({
            adding: false,
            editing: ad
        });
    },

    adCancel() {
        this.setState({
            adding: false,
            editing: null
        });
    },
    adSaved(ad) {
        Toastr.remove();
        Toastr.success(Messages.get("TextAdSavedSuccessfully"));
        this.setState({
            loading: false,
            adding: false,
            editing: null
        });
        AdStore.dispatch({
            action: AdStore.ACTION_RETRIEVE_ADS,
            data: {}
        });
    },


    renderAds() {
        if (this.state.ads) {
            return <i>Carregando anúncios.</i>;
        }
        if (this.state.ads.length == 0) {
            return <i>Nenhum anúncio cadastrado ainda.</i>;
        }
        return (<table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
            <thead>
                <tr>
                    <th>{Messages.get("LabelHeadline")}</th>
                    <th>{Messages.get("LabelStatus")}</th>
                    <th>{Messages.get("LabelViews")}</th>
                    <th>{Messages.get("LabelClicks")}</th>
                </tr>
            </thead>
            <tbody>
                {this.state.ads.map((ad, index) =>
                    <tr key={"ad-list-"+index}>
                        <td>
                            <a onClick={this.onEditingAd.bind(this, ad)}>{ad.Headline}
                            </a>
                        </td>
                        <td>
                            {(ad.Active ? <i className='fa fa-thumbs-o-up'> </i> : <i className='fa fa-thumbs-o-down'> </i>)}
                        </td>
                        <td>{ad.Views}</td>
                        <td>{ad.Hits}</td>
                    </tr>
                )}
            </tbody>
        </table>);
    },
    renderAdsCredit() {
        if (!this.state.ads_balance || this.state.ads_balance.length == 0) {
            return <i>{Messages.get("LabelNoCreditBalance")}</i>;
        }        
        return (<table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
            <thead>
                <tr>
                    <th>{Messages.get("LabelHeadlineCredit")}</th>
                </tr>
            </thead>
            <tbody>
                {this.state.ads_balance.map((adsBalance, index) =>
                    <tr key={"ad-list-"+index}>
                        <td>{parseFloat(adsBalance.Balance).toFixed(2)}</td>
                    </tr>
                )}
            </tbody>
        </table>);
    },
    render () {
        if (this.state.loading)
            return <LoadingGauge />;
        if (this.state.adding)
            return <AdForm onSubmit={this.adSaved} onCancel={this.adCancel} />;
        if (this.state.editing)
            return <AdForm onSubmit={this.adSaved} onCancel={this.adCancel } ad={this.state.editing} />;

        return (
            <div>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <strong>{Messages.get("LabelAdsCredit")}
                        <button className="float-right ilv-btn ilv-btn-sm ilv-btn-primary" onClick={this.onAddCredit}>{Messages.get("LabelAddMoreCredit")}
                        </button>
                    </strong>
                </div>
                <div className="ilv-card-body">{this.renderAdsCredit()}
                </div>
            </div>
            <div className="ilv-card">
                <div className="ilv-card-header">
                    <strong>{Messages.get("LabelAds")}
                        <button className="float-right ilv-btn ilv-btn-sm ilv-btn-primary" onClick={this.onNewAd}>{Messages.get("LabelNewAd")}
                        </button>
                    </strong>
                </div>
                <div className="ilv-card-body">{this.renderAds()}
                </div>
            </div>
            </div>
            );
    }
});
