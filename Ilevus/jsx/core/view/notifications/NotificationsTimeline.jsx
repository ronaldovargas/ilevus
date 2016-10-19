var React = require("react");
var Link = require("react-router").Link;
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    render() {
        return (
            <div className="ilv-card">
                <div className="ilv-card-body">
                    <div className="row">
                        <div className="col-md-3">

                        </div>
                        <div className="col-md-9">

                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
