var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },

    render() {
        return (
            <div className="container my-5">
                <div className="row mb-5">
                    <div className="col">
                        <ul className="ilv-nav ilv-nav-inline ilv-nav-tabs">
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/notifications/timeline">{Messages.get("LabelNotifications")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/notifications/messages">
                                    {Messages.get("LabelMessages")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
