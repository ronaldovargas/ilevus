var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    render() {
        return (
            <div className="container p-y-3">
                <div className="row">
                    <div className="col-xs-12 m-b-0">
                        <ul className="ilv-nav ilv-nav-inline ilv-nav-tabs ilv-text-sm">
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/notifications/messages">
                                    {Messages.get("LabelMessages")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/notifications/timeline">
                                    {Messages.get("LabelNotifications")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
