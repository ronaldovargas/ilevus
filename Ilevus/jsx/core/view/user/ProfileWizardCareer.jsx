var React = require("react");

var Link = require("react-router").Link;

module.exports = React.createClass({
  render() {
    return (
      <div className="container">
				<div className="p-y-3">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="m-y-2"><span className="ilv-progress"><span className="ilv-progress-bar" style="width: 0%"></span></span></div>
						<div className="ilv-card">
							<div className="ilv-card-header">
								<h3>Experiência profissional</h3>
							</div>

							<div className="ilv-card-body">
								<ul className="ilv-media-list ilv-media-list-bordered">
									<li className="ilv-media">
										<div className="ilv-media-body">
											<h4>Consultor de Gestão</h4><span className="ilv-text-large">Biboca e Parafuseta</span>
											<p>
												Responsável pelo suporte em gestão na análise da cadeia
												de distribuição internacional de materiais
												de produção automobilística.
											</p>
										</div>
										<div className="ilv-media-right">
											<button className="ilv-btn ilv-btn-link">Editar</button>
										</div>
									</li>
									<li className="ilv-media">
										<div className="ilv-media-body">
											<h4>Consultor de Gestão</h4><span className="ilv-text-large">Biboca e Parafuseta</span>
											<p>
												Responsável pelo suporte em gestão na análise da cadeia
												de distribuição internacional de materiais
												de produção automobilística.
											</p>
										</div>
										<div className="ilv-media-right">
											<button className="ilv-btn ilv-btn-link">Editar</button>
										</div>
									</li>
									<li className="ilv-media">
										<div className="ilv-media-body ilv-text-xs-center">
											<button className="ilv-btn ilv-btn-link">Adicionar nova experiência</button>
										</div>
									</li>
								</ul>
								<hr />
								<form>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newExperienceCompanyName">Nome da empresa</label>
										<input className="ilv-form-control" type="text" id="newExperienceCompanyName" />
									</fieldset>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newExperienceRole">Cargo / Serviço</label>
										<input className="ilv-form-control" type="text" id="newExperienceRole" />
									</fieldset>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newExperienceLocation">Localidade</label>
										<input className="ilv-form-control" type="text" id="newExperienceLocation" />
									</fieldset>
									<fieldset className="ilv-form-group">
										<legend className="ilv-form-legend">Período</legend>
										<div className="row">
											<div className="col-xs-1">
												<label className="ilv-form-label" htmlFor="newExperienceTimePeriodBegin">De</label>
											</div>
											<div className="col-xs-6">
												<select className="ilv-form-control" id="newExperienceTimePeriodBegin">
													<option>Janeiro</option>
													<option>Fevereiro</option>
													<option>Março</option>
												</select>
											</div>
											<div className="col-xs-5">
												<input className="ilv-form-control" type="number" placeholder="Ano" />
											</div>
										</div>
									</fieldset>
									<fieldset className="ilv-form-group">
										<div className="row">
											<div className="col-xs-1">
												<label className="ilv-form-label" htmlFor="newExperienceTimePeriodEnd">Até</label>
											</div>
											<div className="col-xs-6">
												<select className="ilv-form-control" id="newExperienceTimePeriodEnd">
													<option>Janeiro</option>
													<option>Fevereiro</option>
													<option>Março</option>
												</select>
											</div>
											<div className="col-xs-5">
												<input className="ilv-form-control" type="number" placeholder="Ano" />
											</div>
										</div>
									</fieldset>
									<fieldset className="ilv-form-group">
										<div className="ilv-checkbox">
											<label htmlFor="work-here">
												<input className="ilv-control-input" type="checkbox" id="work-here" /><span className="ilv-control-indicator"></span><span className="ilv-control-label">Até o momento.</span>
											</label>
										</div>
									</fieldset>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newExperienceDescription">Descrição</label>
										<textarea className="ilv-form-control" id="newExperienceDescription"></textarea>
									</fieldset>
									<button className="ilv-btn ilv-btn-block ilv-btn-primary">Adicionar experiência</button>
								</form>
								<hr />
							</div>
							<div className="ilv-card-footer ilv-text-xs-right"><a className="ilv-btn ilv-btn-clean" href="profile-wizard.html">Voltar</a><a className="ilv-btn ilv-btn-neutral" href="profile-wizard-academic.html">Próximo</a></div>
						</div>
					</div>
				</div>
			</div>

    );
  }
});
