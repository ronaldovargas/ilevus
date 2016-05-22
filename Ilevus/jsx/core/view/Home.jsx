var React = require("react");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

module.exports = React.createClass({
    render() {
        return (<div className="page-banner page-banner-lg" role="banner">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <h1 className="display-3 font-weight-bold">Transforme sua carreira</h1>
                <p className="lead">
                  Encontre os melhores profissionais de consultoria e coaching para
                  auxiliá-lo em sua carreira.
                </p>
                <form className="row p-y-1">
                  <div className="form-group col-xs-12 col-sm-8 col-md-9">
                    <input className="form-element form-element-lg" type="text" placeholder="Pesquise por nome, especialidade ou localização..." />
                  </div>
                  <div className="form-group col-xs-12 col-sm-4 col-md-3">
                    <button className="btn btn-lg btn-block btn-warning" type="submit">Pesquisar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>);
    }
});
