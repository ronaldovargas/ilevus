
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
                    <div className="col-xs-2">
                        <ul className="nav nav-pills nav-stacked small">
                            <li className="nav-item hidden">
                                <Link className="nav-link" to="/user/dashboard">
                                    {Messages.get("LabelDashboard")}
                                </Link>
                            </li>
                            <li className="nav-item hidden">
                                <a className="nav-link" href="#">
                                    {Messages.get("LabelInbox")}
                                </a>
                            </li>
                            <li className="nav-item hidden">
                                <a className="nav-link" href="#">
                                    {Messages.get("LabelProfessionalProfile")}
                                </a>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/user/profile">
                                    {Messages.get("LabelProfile")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/user/account">
                                    {Messages.get("LabelAccount")}
                                </Link>
                            </li>
                            <li className="nav-item hidden">
                                <a className="nav-link" href="#">
                                    {Messages.get("LabelCompany")}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-10">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
