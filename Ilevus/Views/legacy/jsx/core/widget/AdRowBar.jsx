
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
        keyword: React.PropTypes.string,
        limit: React.PropTypes.string,
        isMobile: React.PropTypes.string
    },
    getDefaultProps() {
        return {
            keyword: null,
            limit: 1,
            isMobile: true
        };
    },
    getInitialState() {
        return {
            loading: true,
            adsMobile: []
        };
    },

    componentDidMount() {
        var me = this;
        AdStore.on("search-mobile-ads", (adsMobile) => {
            var three = [];
            for (var i = 0; i < adsMobile.length; i++) {
                if (i >= 1)
                    break;
                three.push(adsMobile[i]);
            }
            me.setState({
                adsMobile: three,
                loading: false
            });
        }, me);

        me.refreshMobileAds(me.props.keyword, me.props.limit, me.props.isMobile);
    },
    componentWillUnmount() {
        AdStore.off(null, null, this);
    },

    componentWillReceiveProps(newProps) {
        if (newProps.keyword != this.props.keyword) {
            this.refreshMobileAds(newProps.keyword, this.props.limit, this.props.isMobile);
        }
    },

    refreshMobileAds(keyword, limit, isMobile) {
        AdStore.dispatch({
            action: AdStore.ACTION_SEARCH_MOBILE_ADS,
            data: { keyword: keyword, limit: limit, isMobile: isMobile }
        });
    },

    render() {
        if (this.state.loading) {
            return <span />;
        }
        
        return (<div className="pb-3 pt-0" style={{ borderBottom: "1px solid #eee" }}>
            {this.state.adsMobile.map((ad, index) => {
                return (<div className="ilv-media" key={"ad-" + index }>
                    <a className="ilv-media-body" href={"/api/Ad/Click?Id="+ad.Id}>
                        <img src={"/api/Ad/View?Id=" + ad.Id + "&Position=mobile"} className="w-100" />
                    </a>
                </div>);
            })}
        </div>);
    }
});

