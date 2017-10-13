
var Content = require("./markdown-guide.md");
var Marked = require("marked");
var React = require("react");

module.exports = React.createClass({
    render() {
        return <div className="m-y-3">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ilv-markdown" dangerouslySetInnerHTML={{__html: Marked(Content)}} />
                    </div>
                </div>
            </div>
        </div>;
    }
});