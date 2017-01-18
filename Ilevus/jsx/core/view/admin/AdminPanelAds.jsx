
var S = require("string");
var $ = require("jquery");
var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var AdStore = require("ilevus/jsx/core/store/Ad.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            ads: null,
            adding: false,
            editing: null
        };
    },
    componentDidMount() {
        var me = this;
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
    onEditingAd(event, ad) {
        event && event.preventDefault();
        this.setState({
            adding: false,
            editing: ad
        });
    },


    renderAds() {
        if (this.state.ads.length == 0) {
            return <i>Nenhum anúncio cadastrado ainda.</i>;
        }
        return (<table className="ilv-table ilv-table-sm ilv-table-middle ilv-text-sm">
            <thead>
                <tr>
                    <th>{Messages.get("LabelHeadline")}</th>
                    <th>{Messages.get("LabelCreatedAt")}</th>
                </tr>
            </thead>
            <tbody>
                {this.state.ads.map((ad, index) => {
                    return <tr key={"ad-list-"+index}>
                        <td>{ad.Headline}</td>
                        <td>{ad.Creation}</td>
                    </tr>;
                })}
            </tbody>
        </table>);
    },
    render () {
        if (this.state.loading)
            return <LoadingGauge />;
        return (<div className="ilv-card">
            <div className="ilv-card-header">
                <strong>
                    {Messages.get("LabelAds")}
                    <button className="float-right ilv-btn ilv-btn-sm ilv-btn-primary" onClick={this.onNewAd}>
                        {Messages.get("LabelNewAd")}
                    </button>
                </strong>
            </div>
            <div className="ilv-card-body">
                {this.renderAds()}
            </div>
        </div>);
    }
});
