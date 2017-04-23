
var _ = require("underscore");
var S = require("string");
var React = require('react');
var Link = require('react-router').Link;

var CoachingTools = require("ilevus/jsx/core/store/coaching/Tools.json");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        isCoach: React.PropTypes.bool.isRequired,
        processId: React.PropTypes.string.isRequired,
        session: React.PropTypes.object.isRequired,
        sessionIndex: React.PropTypes.number.isRequired,
    },
    getDefaultProps() {
        return {
            processId: null,
            session: null,
            sessionIndex: null
        };
    },

    renderActiveTools(tools) {
        var toolsPath = CoachingTools.path.replace(":process", this.props.processId).replace(":session", this.props.sessionIndex);
        return <table className="ilv-table ilv-table-sm">
            <thead>
                <tr>
                    <th>{Messages.get("LabelTool")}</th>
                    <th className="text-right">{Messages.get("LabelActions")}</th>
                </tr>
            </thead>
            <tbody>
                {tools.map((tool, index) => {
                    return ( <tr key={"active-tool-"+index}>
                        <td>{Messages.get(tool.labelKey)}</td>
                        <td className="text-right">
                            <Link to={toolsPath.replace(":tool", tool.toolPath)} className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                <i className="ilv-icon material-icons md-18">&#xE89E;</i>
                            </Link>
                            {/*<button className="ilv-btn ilv-btn-sm ilv-btn-clean mx-0">
                                <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                            </button>*/}
                        </td>
                    </tr>);
                })}
            </tbody>
        </table>;
    },

    render() {
        var tools = CoachingTools.tools;
        var activeTools = [];
        var unactiveTools = [];
        for (var i = 0; i < tools.length; i++) {
            if (tools[i].enabled && this.props.session[tools[i].sessionField]) {
                activeTools.push(tools[i]);
            } else {
                unactiveTools.push(tools[i]);
            }
        }
        var toolsPath = CoachingTools.path.replace(":process", this.props.processId).replace(":session", this.props.sessionIndex);
        return (<div className={this.props.className}>
            <h4>{Messages.get("SessionTools")}</h4>
            <div className="ilv-card">
                <div className="ilv-card-body">
                    {activeTools.length > 0 ? this.renderActiveTools(activeTools):(
                        <i className="my-1">{Messages.get("TextNoToolApplied")}</i>
                    )}
                </div>
                {this.props.isCoach && (this.props.session.Status < 10) && (this.props.session.Status > 0) && (unactiveTools.length > 0) ? <div className="ilv-card-footer">
                    <div className="dropdown">
                        <a className="font-weight-bold" data-toggle="dropdown" href="#">
                            {Messages.get('LabelApplyTool')} <i className="material-icons">&#xE313;</i>
                        </a>
                        <ul className="dropdown-menu">
                            {unactiveTools.map((tool, index) => {
                                return <li className="dropdown-item" key={"apply-tool-"+index}>
                                    <Link to={toolsPath.replace(":tool", tool.toolPath)}>{Messages.get(tool.labelKey)}</Link>
                                </li>;
                            })}
                        </ul>
                    </div>
                </div>:""}
             </div>
        </div>);
    }
});
