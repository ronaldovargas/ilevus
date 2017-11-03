
var React = require("react");
var Link = require("react-router").Link;
var ErrorAlert = require("ilevus/jsx/core/widget/ErrorAlert.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var AppLogo = require("ilevus/img/logo.png");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
	getInitialState() {
		return {
			loading: true,
			valid: false
		};
	},
	componentDidMount() {
		var me = this;
		UserSession.on("emailconfirmed", resp => {
			me.setState({
				valid: true,
				loading: false
			});
		}, me);
		UserSession.on("fail", () => {
		    me.setState({
		        valid: false,
		        loading: false
		    });
		}, me);

		UserSession.dispatch({
		    action: UserSession.ACTION_CONFIRM_EMAIL_CHANGE,
		    data: {
		        Email: this.props.params.email,
		        Code: this.props.params.token
		    }
		});
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		if (this.state.loading) {
			return <LoadingGauge />;
		}
		return (
			<div className="my-3" role="banner">
                <div className="container">
                    <div className="row">
                        <div className="offset-sm-2 col-sm-8 col-xs-12 text-xs-center">
				            {this.state.valid ?
                                <div className="alert alert-success">
                                    {Messages.get("TextEmailConfirmSuccess")}
                                </div>
                            :
                                <div className="alert alert-danger">
                                    {Messages.get("TextEmailConfirmFailure")}
                                </div>
                            }
                            <Link to="/home" className="btn btn-brand" style={{margin: 'auto'}}>
                                {Messages.get("ActionBackToMainPage")}
                            </Link>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
});
