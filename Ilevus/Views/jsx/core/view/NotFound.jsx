var React = require("react");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
				render() {
								return (
												<div>
																<div className="ilevus-error-404">
																				<div className="container-fluid">
																								<div className="row">
																												<div className="col-sm-12 text-center">
																																<h1>{Messages.get("TextNotFoundOops")}</h1>
																																<p>{Messages.get("TextNotFound")}</p>
																																<a className="btn btn-primary" href="/">{Messages.get("ActionBackToMainPage")}</a>
																												</div>
																								</div>
																				</div>
																</div>
												</div>
								);
				}
});
