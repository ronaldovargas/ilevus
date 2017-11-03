var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

//var AdStore = require("ilevus/jsx/core/store/Ad.jsx");

//var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },
    getInitialState() {
        return {
            
        };
    },
    componentDidMount() {
        var me = this;
    },
    componentWillUnmount() {
        //SystemStore.off(null, null, this);
        //AdStore.off(null, null, this);
    },
    
    render() {
        if (this.state.loading)
            return <LoadingGauge />;
        
        return (<div>
            <img src={"/img/home-logo-admin.png"} style={{ margin: "0px auto" }} />
        </div>);
    }
});

