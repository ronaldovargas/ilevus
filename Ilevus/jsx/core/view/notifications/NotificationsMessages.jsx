var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
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

				        <div className="ilv-chat-messages">
					        <div className="ilv-chat-messages-header">
						        <div className="ilv-media ilv-media-middle">
							        <div className="ilv-media-left">
								        <div className="ilv-avatar ilv-avatar-circle ilv-avatar-md">
                                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2_copy.jpg"/>
                                        </div>
							        </div>
							        <div className="ilv-media-body">
                                        <span className="ilv-chat-list-name">Name Surname</span>
								        <p className="ilv-chat-list-message">Online</p>
							        </div>
						        </div>
					        </div>
					        <div className="ilv-chat-messages-body">
						        <div className="ilv-chat-messages-bubble in">
							        <div className="ilv-media">
								        <div className="ilv-media-body">This is a received message</div>
								        <div className="ilv-media-right">
                                            <small>10:58</small>
                                        </div>
							        </div>
						        </div>
						        <div className="ilv-chat-messages-bubble out">
							        <div className="ilv-media">
								        <div className="ilv-media-body">This is a message sent by me</div>
								        <div className="ilv-media-right">
                                            <small>10:59</small>
                                        </div>
							        </div>
						        </div>
						        <div className="ilv-chat-messages-bubble out">
							        <div className="ilv-media">
								        <div className="ilv-media-body">
									        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									        Curabitur pulvinar sagittis libero ut feugiat. Nam est ipsum,
									        maximus id interdum id, venenatis quis leo.
								        </div>
								        <div className="ilv-media-right">
                                            <small>11:00</small>
                                        </div>
							        </div>
						        </div>
					        </div>
					        <div className="ilv-chat-messages-footer">
						        <div className="ilv-input-group">
							        <input className="ilv-form-control ilv-form-control-kg" type="search" placeholder="Type a message..."/>
							        <div className="ilv-input-group-btn">
								        <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-neutral">
                                            <i className="ilv-icon material-icons md-24">&#xE163;</i>
                                        </button>
							        </div>
						        </div>
					        </div>
				        </div>
			        </div>
		        </div>
	        </div>
        );
    }
});
