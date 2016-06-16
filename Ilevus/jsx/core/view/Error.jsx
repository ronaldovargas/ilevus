
var React = require("react");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
	render() {
		return (<div>
			<div className="ilevus-error-404">
				<div className="container-fluid text-center">
					<div className="row">
						<div className="col-sm-12 text-center">
							<h1>{Messages.get("TextUnexpectedErrorOops")}</h1>
							<p>{Messages.get("TextUnexpectedError")}</p>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
});
