/**
    Este componente define a estrutura geral da aplicação. Ele é renderizado pela
    rota raiz e renderiza os componentes aninhados da forma necessária.
    Ele é análogo ao _Layout.cshtml em uma aplicação ASP.NET convencional.
*/

var React = require("react");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require("react-router").Link;

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var MainMenu = require("ilevus/jsx/core/widget/MainMenu.jsx");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Logo = require('ilevus/img/ilevus-logo-20px.png');

//var ConteudoRodape = require("ilevus/jsx/core/view/FooterContent.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },
    childContextTypes: {
        admin: PropTypes.bool,
        messages: PropTypes.object
    },
    getChildContext() {
        return {
            admin: !UserSession.get("loading") && this.isAdminLogged(),
            messages: Messages
        };
    },
    getInitialState() {
        return {
            loading: UserSession.get("loading")
        };
    },
    componentWillMount() {
        this.context.router.listen(this.onRouteChange);
    },
    componentDidMount() {
        var me = this;
        UserSession.on("loaded", () => {
            me.setState({ loading: false });
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    onRouteChange(route) {
        if (typeof ga == 'function') {
            ga('send', 'pageview', route.pathname);
        }
    },

    isAdminLogged() {
        var perms = UserSession.get("permissions");
        if (UserSession.get("logged") && perms && perms.length > 0 && perms.indexOf("All") >= 0) {
            return true;
        }
        return false;
    },

    render: function () {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
			<TopBar />
            <main className="page-content" role="main">
                {this.props.children}
                <footer className="ilv-lp-footer">
                    <div className="footer-top padd-top padd-bottom">
                        <div className="container" id="FooterContent">
                            {Messages.getFile(Messages.get("TextFooterContent"), "FooterContent")}
                        </div>
                    </div>
                </footer>
		    </main>
  	    </div>);
    }
});
