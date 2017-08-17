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
            NotificationStore.on("notificationsuser", (data) => {
                setTimeout(() => {
                    if (!this.state.notifications || data.length != this.state.notifications.length) {
                        me.setState({
                            notifications: data,
                            loading: false
                        });
                    }
                }, 10);
                           
            }, me);

            var user = UserSession.get("user");

            NotificationStore.dispatch({
                action: NotificationStore.ACTION_USER_NOTIFICATIONS,
                data: {Id: user.Id}
            });        
        } catch (e) {
            console.log(e)
        }
    },
    componentWillUnmount() {
        NotificationStore.off(null, null, this);
    },

    renderNotification() {
        var items;
        if (!this.state.notifications || this.state.notifications.length == 0) {
            return <div className="ilv-notification ilv-notification-unread">nenhuma notificação</div>
        }

        items = this.state.notifications.map((contact, idx) => {
            var dest = contact.Id;
            return <div className={"ilv-notification " + (!contact.Status ? 'ilv-notification-unread' : '')}>
                            <Link to={"/timeline_detalhe/" + dest} key={"item-" + idx}>
                               <div className="ilv-media ilv-media-middle">
                                   <div className="ilv-media-body">
                                       <p className="mb-0">{contact.Subject}</p>
                                       <small className="text-muted">{contact.DateNotification}</small>
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
                            </Link>
                           </div>
        })
        return <div>{items}</div>
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
                   {this.renderNotification()}
                    <div className="text-center py-3">
                        <a href="#">{Messages.get("LoadMoreNotifications")}</a>
                    </div>
                </div>
            </div>
        );
    }
});
