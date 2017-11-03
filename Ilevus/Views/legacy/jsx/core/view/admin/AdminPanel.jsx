
var React = require("react");
var Link = require("react-router").Link;

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },

    render() {
        return (
            <div className="container py-3">
                <div className="row">
                    <div className="col mb-1">
                        <ul className="ilv-nav ilv-nav-stacked ilv-nav-menu">
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/home" activeClassName="active">
                                    Home
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/apis" activeClassName="active">
                                    APIs
                                </Link>
                            </li>

                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/definitions" activeClassName="active">
                                    {Messages.get("LabelDefinitions")}
                                </Link>
                            </li>

                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/moderationads" activeClassName="active">
                                    {Messages.get("LabelModerationAds")}
                                </Link>
                            </li>

                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/subscriptions" activeClassName="active">
                                    {Messages.get("LabelSubscriptions")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/emails" activeClassName="active">
                                {Messages.get("LabelEmails")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/ads" activeClassName="active">
                                    {Messages.get("LabelAds")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/users" activeClassName="active">
                                    {Messages.get("LabelUsers")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/translate" activeClassName="active">
                                    {Messages.get("LabelTranslations")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/mensagens" activeClassName="active">{Messages.get("EnviarMensagemSistema")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/reports" activeClassName="active">{Messages.get("LabelReports")}
                                </Link>
                            </li>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/admin/sitemap" activeClassName="active">{Messages.get("LabelSiteMap")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-9">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
