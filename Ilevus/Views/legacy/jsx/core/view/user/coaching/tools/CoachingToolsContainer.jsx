
var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var CoachingTools = require("ilevus/jsx/core/store/coaching/Tools.json");

module.exports = React.createClass({
    componentDidMount() {
        console.log(CoachingTools);
    },
    componentWillUnmount() {
    },
    render() {
        if (this.props.children)
            return this.props.children;
        return (<div className="row">
            {CoachingTools.tools.map((tool, index) => {
                return (<Link to={"/user/coaching-tools/"+tool.toolPath} className="col col-md-3 ilv-card" key={"tool-"+index}>
                    <div className="ilv-card-body text-center">
                        <h2>{Messages.get(tool.labelKey)}</h2>
                    </div>
                </Link>);
            })}
        </div>);
            }
});