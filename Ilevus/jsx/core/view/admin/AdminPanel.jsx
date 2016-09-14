
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
                    <div className="col-xs-2 m-b-1">
                        <ul className="ilv-nav ilv-nav-stacked ilv-nav-menu">
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/users">
                                    {Messages.get("LabelUsers")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/emails">
                                    {Messages.get("LabelEmails")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/translate">
                                    {Messages.get("LabelTranslations")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xs-10">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
