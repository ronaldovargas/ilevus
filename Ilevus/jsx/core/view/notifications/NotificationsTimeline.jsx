var S = require("string");

var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var NotificationStore = require("ilevus/jsx/core/store/notifications/Notification.jsx");

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
            notifications: []
        };
    },
    componentDidMount() {
        try{
            var me = this;
            NotificationStore.on("notifications-user", (data) => {
                me.setState({
                    notifications: data,
                    loading: false
                });                
            }, me);

            var user = UserSession.get("user");

            NotificationStore.dispatch({
                action: NotificationStore.ACTION_USER_NOTIFICATIONS+"/"+user.Id,
                data: {}
            });        
        } catch (e) {
            console.log(e)
        }
    },
    componentWillUnmount() {
        NotificationStore.off(null, null, this);
    },
    
    render() {
        this.componentDidMount();
        return (
            <div>
                <div className="ilv-media ilv-media-middle mb-4">
                    <div className="ilv-media-body">
                        <h4>{Messages.get("YourNotifications")} ()</h4>
                    </div>
                    <div className="ilv-media-right">
                        <select className="ilv-form-control">
                            <option>{Messages.get("AllNotifications")}</option>
                            <option>{Messages.get("UnreadNotifications")}</option>
                        </select>
                    </div>
                </div>
                
                <div className="ilv-notification-list">
                    <div className="ilv-notification ilv-notification-unread">
                        <div className="ilv-media ilv-media-middle">
                            <div className="ilv-media-body">
                                <p className="mb-0">Você recebeu uma solicitação de agendamento de <strong>Jon Snow</strong> para o dia <strong>01/01/2016</strong> às <strong>13:00h</strong>.</p>
                                <small className="text-muted">21 hours ago</small>
                            </div>
                            <div className="ilv-media-right">
                                <div className="dropdown">
                                    <button className="ilv-btn ilv-btn-clean" data-toggle="dropdown">
                                        <i className="ilv-btn-icon material-icons md-24">&#xE5D3;</i>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-right">
                                        <a href="#" className="dropdown-item">{Messages.get("MarkAsRead")}</a>
                                        <a href="#" className="dropdown-item">{Messages.get("DeleteNotification")}</a>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-3">
                        <a href="#">{Messages.get("LoadMoreNotifications")}</a>
                    </div>
                </div>
            </div>
        );
    }
});
