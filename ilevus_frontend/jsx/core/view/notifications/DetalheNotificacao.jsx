
var React = require("react");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var NotificationStore = require("ilevus/jsx/core/store/notifications/Notification.jsx");

module.exports = React.createClass({
getInitialState() {
        return {
            destination: this.props.params.destination,
            notification: {}
        };
    },

 componentDidMount() {
        try{
            var me = this;
            NotificationStore.on("notificationget", (data) => {
                setTimeout(() => {                   
                        me.setState({
                            notification: data,
                            loading: false
                        });                    
                }, 10);
            }, me);
        } catch (e) {
            console.log(e)
        }

            NotificationStore.dispatch({
                    action: NotificationStore.ACTION_GET_NOTIFICATION,
                    data: this.state.destination
                });
    },
    componentWillUnmount() {
        NotificationStore.off(null, null, this);
    },

 componentWillReceiveProps(newProps, newContext) {
        if (this.props.params.destination != newProps.params.destination) {
            this.setState({
                destination: newProps.params.destination
            });  

            if (newProps.params.destination) {
                NotificationStore.dispatch({
                    action: NotificationStore.ACTION_GET_NOTIFICATION,
                    data: newProps.params.destination
                });
            }          
        }
    },
	render() {
        var notif = this.state.notification;
		return (<div style={{padding: "15px"}}>
			<div className="ilevus-error-404">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12">
                            <div>
                                <h4>Detalhes da notificação</h4>
                            </div>
                            <div className="hora-notificacao">
                                {Messages.get("LabelDataNotificacao")}: {notif.DateNotification}<br/>
                                {Messages.get("LabelEnviadoPor")}: {notif.From}
                            </div>                            
                            <br/>
                            <div>
                                {notif.InfoNotification}
                            </div>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
});