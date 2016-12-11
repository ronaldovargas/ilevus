
var _ = require("underscore");
var S = require("string");
var moment = require("moment");
var momentRange = require("moment-range");
var React = require("react");
var Link = require("react-router").Link;

var ChatStore = require("ilevus/jsx/core/store/Chat.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var UserIcon = require("ilevus/img/user.png");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var POLL_INTERVAL = 6000;

function isConversationUpdated(old, last) {
    if ((typeof old) != (typeof last)) {
        return true;
    }
    if (!old) {
        return false;
    }
    if (old.Id !== last.Id) {
        return true;
    }
    return old.Messages.length != last.Messages.length;
}

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            contacts: [],
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
                conversation: conversation,
                lastPoll: moment()
            });
            me.pollContacts();
            _.delay(this.pollNewMessages, POLL_INTERVAL);
        }, me);

        ChatStore.on("poll-contacts", (contacts) => {
            if (me.state.destination) {
                me.setState({
                    contacts: contacts
                });
            } else {
                if (contacts && contacts.length > 0)
                    me.context.router.replace("/notifications/messages/" + contacts[0].PartnerId);
            }
        }, me);

        ChatStore.on("poll-new-messages", (conversation) => {
            if (isConversationUpdated(this.state.conversation, conversation)) {
                me.setState({
                    conversation: conversation,
                    lastPoll: moment()
                });
            }
            me.pollContacts();
            _.delay(this.pollNewMessages, POLL_INTERVAL);
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
        } else {
            this.pollContacts();
        }
    },
    componentWillUnmount() {
        ChatStore.off(null, null, this);
    },
    componentWillReceiveProps(newProps, newContext) {
        if (this.props.params.destination != newProps.params.destination) {
            this.setState({
                destination: newProps.params.destination
            });
            if (newProps.params.destination) {
                ChatStore.dispatch({
                    action: ChatStore.ACTION_RETRIEVE_CONVERSATION,
                    data: newProps.params.destination
                });
            }
        }
    },

    pollContacts() {
        ChatStore.dispatch({
            action: ChatStore.ACTION_POLL_CONTACTS,
            data: {
                Since: this.state.lastPoll ? this.state.lastPoll.format("YYYY-MM-DThh:mm:ss") : "1970-01-01T00:00:00"
            }
        });
    },

    pollNewMessages() {
        ChatStore.dispatch({
            action: ChatStore.ACTION_POLL_NEW_MESSAGES,
            data: {
                Destination: this.state.destination,
                Since: this.state.lastPoll.format("YYYY-MM-DThh:mm:ss")
            }
        });
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

    componentDidUpdate() {
        var chatBody = this.refs['chat-body'];
        if (chatBody)
            chatBody.scrollTop = chatBody.scrollHeight;
    },

    renderChat() {
        if (!this.state.conversation) {
            return <div className="ilv-chat-messages">
                <LoadingGauge />
            </div>;
        }
        var conversation = this.state.conversation;
        
        var dest = conversation.Destination;
        var msgs = conversation.Messages;
        var now = moment();
        var lastDay;
        return (<div className="ilv-chat-messages">
            <div className="ilv-chat-messages-header">
                <div className="ilv-media ilv-media-middle">
                    <div className="ilv-media-left">
                        <div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                            <img src={S(dest.Image).isEmpty() ? UserIcon : dest.Image} />
                        </div>
                    </div>
                    <div className="ilv-media-body">
                        <span className="ilv-chat-list-name">{dest.Name} {dest.Surname}</span>
                        <p className="ilv-chat-list-message"></p>
                    </div>
                </div>
            </div>
            <div className="ilv-chat-messages-body" ref="chat-body">
                {!msgs || msgs.length <= 0 ? <div className="ilv-chat-messages-bubble center">
                    <i>{Messages.get("TextNoMessagesYet")}</i>
                </div> : msgs.map((msg, idx) => {
                    var day = moment(conversation.Day);
                    var creation = moment(msg.Creation);
                    var diff = moment.range(creation, now).diff("hours");
                    return <div className={"ilv-chat-messages-bubble " + (msg.AuthorId == UserSession.get("user").Id ? "out" : "in")}
                                key={"chat-msg-" + idx}>
                        <div className="ilv-media">
                            <div className="ilv-media-body">
                                {msg.Content}
                            </div>
                            <div className="ilv-media-right">
                                <small>
                                    {msg.Preview ? "P" : (diff < 24 ? creation.format('HH:mm') : creation.format('D/MM/YYYY HH:mm'))}
                                </small>
                            </div>
                        </div>
                    </div>;
                })}
            </div>
            <form className="ilv-chat-messages-footer" onSubmit={this.sendMessage}>
                <div className="ilv-input-group">
                    <input className="ilv-form-control ilv-form-control-kg"
                           type="text"
                           ref="message-input"
                           spellCheck={false}
                           placeholder="Type a message..."/>
                    <div className="ilv-input-group-btn">
                        <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-neutral" type='submit'>
                            <i className="ilv-icon material-icons md-24">&#xE163;</i>
                        </button>
                    </div>
                </div>
            </form>
        </div>);
    },

    renderChatList() {
        var items;
        var user = UserSession.get("user");
        if (!this.state.contacts || this.state.contacts.length == 0) {
            items = <i className="ilv-chat-list-item">Nenhum contato realizado ainda.</i>;
        } else {
            items = this.state.contacts.map((contact, idx) => {
                var lastMessage = contact.LastMessage;
                var creation = lastMessage ? moment(lastMessage.Creation):null;
                var diff = creation ? moment.range(creation, moment()).diff("hours") : null;
                return <Link to={"/notifications/messages/"+contact.PartnerId} className="ilv-chat-list-item" activeClassName="active" key={"contact-item-"+idx}>
				    <div className="ilv-media anv-media-middle">
						<div className="ilv-media-left">
						    <div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                                <img src={S(contact.PartnerImage).isEmpty() ? UserIcon : contact.PartnerImage} />
                            </div>
						</div>
						<div className="ilv-media-body">
                            <span className="ilv-chat-list-name">{contact.PartnerName} {contact.PartnerSurname}</span>
							<p className="ilv-chat-list-message">{contact.LastMessage ? contact.LastMessage.Content : ""}</p>
						</div>
						<div className="ilv-media-right">
                            <small className="ilv-text-muted">
                                {diff !== null ? (diff < 24 ? creation.format('HH:mm') : creation.format('D/MM/YYYY HH:mm')) : ""}
                            </small>
                        </div>
					</div>
			    </Link>;
            });
        }

        return <div className="ilv-chat-list">
		    <div className="ilv-chat-list-header">
			    <div className="ilv-media ilv-media-middle">
				    <div className="ilv-media-body">
						<div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                            <img src={S(user.Image).isEmpty() ? UserIcon : user.Image} />
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
            {items}
        </div>;
    },

    render() {
        return (
            <div className="ilv-card">
		        <div className="ilv-card-block">
			        <div className="ilv-chat">
				        {this.renderChatList()}
                        {this.renderChat()}
			        </div>
		        </div>
	        </div>
        );
    }
});
