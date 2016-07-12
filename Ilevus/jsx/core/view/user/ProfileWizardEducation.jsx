var React = require("react");

var Link = require("react-router").Link;

module.exports = React.createClass({
  render() {
    return (
      <div className="container">
				<div className="p-y-3">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="m-y-2"><span className="ilv-progress"><span className="ilv-progress-bar" style="width: 50%"></span></span></div>
						<div className="ilv-card">
							<div className="ilv-card-header">
								<h3>Formação acadêmica</h3>
							</div>
							<div className="ilv-card-body">
								<ul className="ilv-media-list ilv-media-list-bordered">
									<li className="ilv-media">
										<div className="ilv-media-body">
											<h4>Universidade Federal de Minas Gerais</h4><span className="ilv-text-large">Bacharel em Administração e Economia</span>
											<p>
												Descrição sobre atividades realizadas durante o
												período de graduação.
											</p>
										</div>
										<div className="ilv-media-right">
											<button className="ilv-btn ilv-btn-link">Editar</button>
										</div>
									</li>
									<li className="ilv-media">
										<div className="ilv-media-body">
											<h4>Universidade Federal de Minas Gerais</h4><span className="ilv-text-large">Bacharel em Administração e Economia</span>
											<p>
												Descrição sobre atividades realizadas durante o
												período de graduação.
											</p>
										</div>
										<div className="ilv-media-right">
											<button className="ilv-btn ilv-btn-link">Editar</button>
										</div>
									</li>
									<li className="ilv-media">
										<div className="ilv-media-body ilv-text-xs-center">
											<button className="ilv-btn ilv-btn-link">Adicionar nova formação</button>
										</div>
									</li>
								</ul>
								<hr/>
								<form>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newFormationSchoolName">Instituição de ensino</label>
										<input className="ilv-form-control" type="text" id="newFormationSchoolName"/>
									</fieldset>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newFormationArea">Área de atuação</label>
										<input className="ilv-form-control" type="text" id="newFormationArea"/>
									</fieldset>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newFormationDegree">Formação</label>
										<select className="ilv-form-control" id="newFormationDegree">
											<option>Bacharel</option>
											<option>Mestrado</option>
											<option>Doutorado</option>
										</select>
									</fieldset>
									<fieldset className="ilv-form-group">
										<label className="ilv-form-label" htmlFor="newFormationTimePeriod">Período</label>
										<div className="row">
											<div className="col-xs-6">
												<input className="ilv-form-control" type="number" placeholder="Ano"/>
											</div>
											<div className="col-xs-6">
												<input className="ilv-form-control" type="number" placeholder="Ano"/>
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
										<label className="ilv-form-label" htmlFor="newFormationDescription">Descrição</label>
										<textarea className="ilv-form-control" id="newFormationDescription"></textarea>
									</fieldset>
									<button className="ilv-btn ilv-btn-block ilv-btn-primary">Adicionar formação</button>
								</form>
								<hr/>
							</div>
							<div className="ilv-card-footer ilv-text-xs-right"><a className="ilv-btn ilv-btn-clean" href="profile-wizard-career.html">Voltar</a><a className="ilv-btn ilv-btn-success" href="profile-wizard.html">Concluir</a></div>
						</div>
					</div>
				</div>
			</div>

    );
  }
});
