var _ = require("underscore");
var S = require("string");
var moment = require("moment");
var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var AdStore = require("ilevus/jsx/core/store/Ad.jsx");

module.exports = createClass({
    propTypes: {
        keyword: PropTypes.string,
        limit: PropTypes.string,
        isMobile: PropTypes.string
    },
    getDefaultProps() {
        return {
            keyword: null,
            limit: 1,
            isMobile: false
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
                if (i >= 1)
                    break;
                three.push(ads[i]);
            }
            me.setState({
                ads: three,
                loading: false
            });
        }, me);

        me.refreshAds(me.props.keyword, me.props.limit, me.props.isMobile);
    },
    componentWillUnmount() {
        AdStore.off(null, null, this);
    },

    componentWillReceiveProps(newProps) {
        if (newProps.keyword != this.props.keyword) {
            this.refreshAds(newProps.keyword, me.props.limit, me.props.isMobile);
        }
    },

    refreshAds(keyword, limit, isMobile) {
        AdStore.dispatch({
            action: AdStore.ACTION_SEARCH_ADS,
            data: { keyword: keyword, limit: limit, isMobile: isMobile }
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
                        <img src={"/api/Ad/View?Id=" + ad.Id + "&Position=desktop"} className="w-100" />
                    </a>
                </div>);
            })}
        </div>);
    }
});

