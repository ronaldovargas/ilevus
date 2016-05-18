
var React = require("react");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");

module.exports = React.createClass({
	render() {
		return (<div>
			<div className="ilevus-error-404">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12 text-center">
							<h1>Oops. Um erro inesperado ocorreu.</h1>
							<p>Por favor tente novamente mais tarde. Se o problema persistir entre em contato com o suporte.</p>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
});
