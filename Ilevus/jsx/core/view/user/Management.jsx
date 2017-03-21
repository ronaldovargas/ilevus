
var React = require("react");
var Link = require("react-router").Link;

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    render() {
        return (
            <div className="container my-5">
                <div className="row mb-5">
                    <div className="col">
                        <ul className="ilv-nav ilv-nav-inline ilv-nav-tabs">
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/dashboard" activeClassName="active">
                                {Messages.get("LabelDashboard")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/schedule" activeClassName="active">
                                {Messages.get("LabelSchedule")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item hidden">
                                <a className="ilv-nav-link" href="#">
                                    {Messages.get("LabelInbox")}
                                </a>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/profile" activeClassName="active">
                                {Messages.get("LabelProfile")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item hidden">
                                <Link className="ilv-nav-link" to="/user/professional-profile" activeClassName="active">
                                {Messages.get("LabelProfessionalProfile")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/account" activeClassName="active">
                                {Messages.get("LabelAccount")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item hidden">
                                <a className="ilv-nav-link" href="#">
                                    {Messages.get("LabelCompany")}
                                </a>
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
