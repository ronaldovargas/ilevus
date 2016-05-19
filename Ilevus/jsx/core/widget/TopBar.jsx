
var React = require("react");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Logo = require('ilevus/img/logo.png');

module.exports = React.createClass({
	getInitialState() {
		return {
			user: UserSession.get("user"),
			logged: !!UserSession.get("logged")
		};
	},
	componentWillMount() {
		var me = this;
		UserSession.on("login", session => {
			me.setState({
				user: session.get("user"),
				logged: true
			});
		}, me);
		UserSession.on("logout", session => {
			me.setState({
				user: null,
				logged: false
			});
		}, me);
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
    onLogout(evt) {
        evt.preventDefault();
        UserSession.dispatch({
            action: UserSession.ACTION_LOGOUT
        });
    },
    onSearch(evt, id) {
    	evt.preventDefault();
    	console.log("Searching:",this.refs['search'].value);
    },

    openFeedback(evt) {
    	evt.preventDefault();
    	Modal.feedbackPost();
    },
    openReportProblem(evt) {
    	evt.preventDefault();
    	Modal.reportProblem();
    },

	render() {
		if (!this.state.logged) {
			return <div style={{display: 'none'}} />;
		}
		return (<div className="ilevus-top-bar">
			    <span className="ilevus-fill" />
			    <span style={{
			            marginRight: '5px',
			            height: '50px',
			            width: '50px',
			            borderRadius: '100%',
			            backgroundPosition: 'center',
                        backgroundSize: 'auto 100%',
			            backgroundImage: "url(" + this.state.user.Image+")"
			        }} />
			    <span>{this.state.user.Name}</span>
			    <span title="Notificações" className="mdi mdi-bell" />
			    <a onClick={this.onLogout}>
				    <span title="Sair" className="mdi mdi-logout" />
			    </a>
		</div>);
	  }
	});
