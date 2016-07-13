var React = require("react");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var Link = require("react-router").Link;

module.exports = React.createClass({
  render() {
    return (
      <div className="container">
				<div className="p-y-3">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="m-y-2"><span className="ilv-progress"><span className="ilv-progress-bar" style={{width: "50%"}}></span></span></div>
						<div className="ilv-card">
							<div className="ilv-card-header">
								<h3>{Messages.get("TextWizardHeaderAddress")}Informe o seu endereço</h3>
							</div>
							<div className="ilv-card-body">
								<form>
  									<fieldset className="ilv-form-group">
    										<label className="ilv-form-label" htmlFor="profile-wizard-address">{Messages.get("LabelAddress")}Endereço postal</label>
    										<input className="ilv-form-control ilv-form-control-lg" id="profile-wizard-address" type="text" />
  									</fieldset>
  									<fieldset className="ilv-form-group">
    										<label className="ilv-form-label" htmlFor="profile-wizard-zipcode">{Messages.get("LabelZipCode")}CEP</label>
    										<input className="ilv-form-control ilv-form-control-lg" id="profile-wizard-zipcode" type="text" />
  									</fieldset>
  									<fieldset className="ilv-form-group">
    										<label className="ilv-form-label" htmlFor="profile-wizard-address-extra">{Messages.get("LabelAddressDetails")}Complemento</label>
    										<input className="ilv-form-control ilv-form-control-lg" id="profile-wizard-address-extra" type="text" />
  									</fieldset>
  									<fieldset className="ilv-form-group">
    										<label className="ilv-form-label" htmlFor="profile-wizard-city">{Messages.get("LabelCity")}Cidade</label>
    										<select className="ilv-form-control ilv-form-control-lg" id="profile-wizard-city">
									         <option selected>Belo Horizonte</option>
    										</select>
  									</fieldset>
  									<fieldset className="ilv-form-group">
    										<label className="ilv-form-label" htmlFor="profile-wizard-country">{Messages.get("LabelCountry")}País</label>
    										<select className="ilv-form-control ilv-form-control-lg" id="profile-wizard-country">
  								         <option selected>Brasil</option>
    										</select>
  									</fieldset>
  									<fieldset className="ilv-form-group">
    										<label className="ilv-form-label" htmlFor="profile-wizard-state">{Messages.get("LabelState")}Estado</label>
    										<select className="ilv-form-control ilv-form-control-lg" id="profile-wizard-state">
					                  <option selected>Minas Gerais</option>
    										</select>
  									</fieldset>
  								</form>
							</div>
							<div className="ilv-card-footer ilv-text-xs-right">
                  <Link className="ilv-btn ilv-btn-clean" to="/become-a-professional/basic">
                      {Messages.get("LabelReturn")}Voltar
                  </Link>
                  <Link className="ilv-btn ilv-btn-success" to="/become-a-professional">
                      {Messages.get("LabelFinish")}Concluir
                  </Link>
              </div>
						</div>
					</div>
				</div>
			</div>

    );
  }
});
