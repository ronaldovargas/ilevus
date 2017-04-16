
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
        return this.props.children;
    }
});