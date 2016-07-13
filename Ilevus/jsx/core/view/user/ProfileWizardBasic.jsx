var React = require("react");

var Link = require("react-router").Link;

module.exports = React.createClass({
  render() {
    return (
      <div className="container">
        <div className="p-y-3">
          <div className="col-sm-6 col-sm-offset-3">

            <div className="m-y-2">
              <span className="ilv-progress">
                <span className="ilv-progress-bar" style={{width: "0%"}}></span>
              </span>
            </div>

            <div className="ilv-card">
              <div className="ilv-card-header">
                <h3>Comece por suas informações básicas</h3>
              </div>

              <div className="ilv-card-body">
                <form>

                  <fieldset className="ilv-form-group">
                    <label className="ilv-form-label">Nome</label>
                    <input className="ilv-form-control ilv-form-control-lg" type="text" />
                  </fieldset>

                  <fieldset className="ilv-form-group">
                    <label className="ilv-form-label">Sobrenome</label>
                    <input className="ilv-form-control ilv-form-control-lg" type="text" />
                  </fieldset>

                  <fieldset className="ilv-form-group">
                    <label className="ilv-form-label">Telefone</label>
                    <input className="ilv-form-control ilv-form-control-lg" type="phone" />
                  </fieldset>

                  <fieldset className="ilv-form-group">
                    <label className="ilv-form-label">Idiomas</label>
                    <select className="ilv-form-control ilv-form-control-lg m-b-1">
                      <option selected>Português</option>
                      <option>English</option>
                      <option>Español</option>
                    </select>
                    <a className="ilv-font-weight-semibold" href="">Adicionar idioma</a>
                  </fieldset>

                </form>
              </div>

              <div className="ilv-card-footer ilv-text-xs-right">
                <a className="ilv-btn ilv-btn-clean" href="profile-wizard.html">Voltar</a>
                <a className="ilv-btn ilv-btn-neutral" href="profile-wizard-address.html">Próximo</a>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
});
