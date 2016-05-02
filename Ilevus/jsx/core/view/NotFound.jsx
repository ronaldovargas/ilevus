
var React = require("react");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");

module.exports = React.createClass({
	render() {
		return (<div>
			<div className="ilevus-error-404">
				<div className="container-fluid">
					<div className="row">
						<div className="col-sm-12 text-center">
							<h1>Oops. Não encontramos a página que você está procurando.</h1>
							<p>Você pode ter digitado algum endereço errado ou a página foi movida deste lugar.</p>
							<a className="btn btn-primary" href="#/">Voltar para a página inicial</a>
						</div>
					</div>
				</div>
			</div>
		</div>);
	}
});
