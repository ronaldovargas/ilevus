
var S = require("string");
var moment = require("moment");
var React = require("react");
var Link = require("react-router").Link;

var ChatStore = require("ilevus/jsx/core/store/Chat.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            conversation: null,
            destination: this.props.params.destination
        };
    },
    componentDidMount() {
        var me = this;
        if (!UserSession.get("logged")) {
            this.context.router.replace("/home");
        }

        ChatStore.on("retrieve-conversation", (conversation) => {
            me.setState({
                conversation: conversation
            });
        }, me);
        ChatStore.on("send-message", (msg) => {
            var pos = this.state.conversation.Messages.length - 1;
            this.state.conversation.Messages[pos] = msg;
            me.forceUpdate();
        }, me);

        if (me.state.destination) {
            ChatStore.dispatch({
                action: ChatStore.ACTION_RETRIEVE_CONVERSATION,
                data: me.state.destination
            });
        }
    },
    componentWillUnmount() {
        ChatStore.off(null, null, this);
    },

    sendMessage(event) {
        event.preventDefault();
        var msg = S(this.refs['message-input'].value);
        if (msg.isEmpty()) {
            return;
        }
        this.state.conversation.Messages.push({
            AuthorId: UserSession.get("user").Id,
            Content: msg.s,
            Preview: true
        });
        this.refs['message-input'].value = "";
        this.forceUpdate();
        ChatStore.dispatch({
            action: ChatStore.ACTION_SEND_MESSAGE,
            data: {
                Content: msg.s,
                Destination: this.state.conversation.Destination.Id
            }
        });
    },

    renderChat() {
        if (!this.state.conversation) {
            return <div className="ilv-chat-messages">
                <LoadingGauge />
            </div>;
        }
        var conversation = this.state.conversation;
        console.log(conversation);
        var dest = conversation.Destination;
        var msgs = conversation.Messages;
        return (<div className="ilv-chat-messages">
            <div className="ilv-chat-messages-header">
                <div className="ilv-media ilv-media-middle">
                    <div className="ilv-media-left">
                        <div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                            <img src={dest.Image} />
                        </div>
                    </div>
                    <div className="ilv-media-body">
                        <span className="ilv-chat-list-name">{dest.Name} {dest.Surname}</span>
                        <p className="ilv-chat-list-message"></p>
                    </div>
                </div>
            </div>
            <div className="ilv-chat-messages-body">
                {!msgs || msgs.length <= 0 ? <div className="ilv-chat-messages-bubble center">
                    <i>{Messages.get("TextNoMessagesYet")}</i>
                </div> : msgs.map((msg, idx) => {
                    return <div className={"ilv-chat-messages-bubble " + (msg.AuthorId == UserSession.get("user").Id ? "out" : "in")}
                                key={"chat-msg-" + idx}>
                        <div className="ilv-media">
                            <div className="ilv-media-body">
                                {msg.Content}
                            </div>
                            <div className="ilv-media-right">
                                <small>{msg.Preview ? "P" : moment(msg.Creation).fromNow()}</small>
                            </div>
                        </div>
                    </div>;
                })}
            </div>
            <div className="ilv-chat-messages-footer">
                <div className="ilv-input-group">
                    <input className="ilv-form-control ilv-form-control-kg"
                           type="text"
                           ref="message-input"
                           spellCheck={false}
                           placeholder="Type a message..."/>
                    <div className="ilv-input-group-btn">
                        <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-neutral" onClick={this.sendMessage}>
                            <i className="ilv-icon material-icons md-24">&#xE163;</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>);
    },
    render() {
        return (
            <div className="ilv-card">
		        <div className="ilv-card-block">
			        <div className="ilv-chat">
				        <div className="ilv-chat-list">
					        <div className="ilv-chat-list-header">
						        <div className="ilv-media ilv-media-middle">
							        <div className="ilv-media-body">
								        <div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg"/>
                                        </div>
							        </div>
							        <div className="ilv-media-right">
								        <button className="ilv-btn ilv-btn-icon ilv-btn-clean">
                                            <i className="ilv-icon material-icons md-24">&#xE0CA;</i>
                                        </button>
							        </div>
						        </div>
					        </div>
					        <div className="ilv-chat-list-search">
						        <div className="ilv-input-group">
							        <input className="ilv-form-control" type="search" placeholder="Search or start a new chat..."/>
							        <div className="ilv-input-group-btn">
								        <button className="ilv-btn ilv-btn-icon ilv-btn-neutral">
                                            <i className="ilv-icon material-icons md-18">&#xE8B6;</i>
                                        </button>
							        </div>
						        </div>
					        </div>
					        <div className="ilv-chat-list-item">
						        <div className="ilv-media ilv-media-middle">
							        <div className="ilv-media-left">
								        <div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg"/>
                                        </div>
							        </div>
							        <div className="ilv-media-body">
                                        <span className="ilv-chat-list-name">Name Surname</span>
								        <p className="ilv-chat-list-message">The last received or sent message truncated...</p>
							        </div>
							        <div className="ilv-media-right">
                                        <small className="ilv-text-muted">17:00</small>
                                    </div>
						        </div>
					        </div>
					        <div className="ilv-chat-list-item active">
						        <div className="ilv-media anv-media-middle">
							        <div className="ilv-media-left">
								        <div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg"/>
                                        </div>
							        </div>
							        <div className="ilv-media-body">
                                        <span className="ilv-chat-list-name">Name Surname</span>
								        <p className="ilv-chat-list-message">The last received or sent message truncated...</p>
							        </div>
							        <div className="ilv-media-right">
                                        <small className="ilv-text-muted">17:00</small>
                                    </div>
						        </div>
					        </div>
				        </div>

                        {this.renderChat()}
			        </div>
		        </div>
	        </div>
        );
    }
});
