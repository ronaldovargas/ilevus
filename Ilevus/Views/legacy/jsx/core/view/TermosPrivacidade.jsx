
var React = require("react");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
	render() {
		return (<div>
			<div className="ilevus-error-404">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12 text-center">
							<h1>{Messages.get("LabelTermsPrivacy")}</h1>
							<p id="conteudoTerms" className="text-left">{Messages.getFile(Messages.get("TextTermsPrivacy"), "conteudoTerms")}</p>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
});