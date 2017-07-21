
var _ = require("underscore");
var S = require("string");
var moment = require("moment");
var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var AdStore = require("ilevus/jsx/core/store/Ad.jsx");

module.exports = React.createClass({
    propTypes: {
        keyword: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            keyword: null
        };
    },
    getInitialState() {
        return {
            loading: true,
            ads: []
        };
    },

    componentDidMount() {
        var me = this;
        AdStore.on("search-ads", (ads) => {
            var three = [];
            for (var i = 0; i < ads.length; i++) {
                if (i >= 3)
                    break;
                three.push(ads[i]);
            }
            me.setState({
                ads: three,
                loading: false
            });
        }, me);

        me.refreshAds(me.props.keyword);
    },
    componentWillUnmount() {
        AdStore.off(null, null, this);
    },

    componentWillReceiveProps(newProps) {
        if (newProps.keyword != this.props.keyword) {
            this.refreshAds(newProps.keyword);
        }
    },

    refreshAds(keyword) {
        AdStore.dispatch({
            action: AdStore.ACTION_SEARCH_ADS,
            data: keyword
        });
    },

    render() {
        if (this.state.loading) {
            return <span />;
        }
        return (<div className="ilv-media-list ilv-media-list-bordered">
            {this.state.ads.map((ad, index) => {
                return (<div className="ilv-media" key={"ad-" + index }>
                    <a className="ilv-media-body" href={"/api/Ad/Click?Id="+ad.Id}>
                        <img src={"/api/Ad/View?Id="+ad.Id} className="w-100" />
                        <span>{ad.Headline}</span>
                    </a>
                </div>);
            })}
        </div>);
    }
});

