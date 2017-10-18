var React = require("react");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var WhiteLogo = require('ilevus/img/logo.png');

module.exports = React.createClass({
    contextTypes: {
        admin: React.PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            user: UserSession.get("user"),
            logged: !!UserSession.get("logged")
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("login", session => {
            me.setState({
                user: session.get("user"),
                logged: true
            });
        }, me);
        UserSession.on("logout", session => {
            me.setState({user: null, logged: false});
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },
    onLogout() {
        endMonitorSessao();
        UserSession.dispatch({action: UserSession.ACTION_LOGOUT});
    },
    render() {
        if (!this.state.logged) {
            return <div style={{
                display: 'none'
            }}/>;
        }
        return (
            <div className='ilevus-app-sidebar'>
                <div className="ilevus-sidebar-brand">
                    <img alt="ilevus Logo" src={WhiteLogo}/>
                </div>
                <ul className="nav nav-stacked">
                    <li>
                        <a href="/users">
                            <span className="ilevus-nav-icon mdi mdi-account-multiple"></span>
                            Usuários
                        </a>
                    </li>
                    <li>
                        <a href="/settings">
                            <span className="ilevus-nav-icon mdi mdi-settings"></span>
                            Configurações
                        </a>
                    </li>
                    <li>
                        <a href="/system">
                            <span className="ilevus-nav-icon mdi mdi-chemical-weapon"></span>
                            Sistema
                        </a>
                    </li>
                </ul>
                <span className="ilevus-fill"/>
            </div>
        );
    }
});
