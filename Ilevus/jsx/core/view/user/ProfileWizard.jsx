var React = require("react");

var Link = require("react-router").Link;

module.exports = React.createClass({
  render() {
    return (
      <div className="container">
        <div className="row p-t-3">

          <div className="col-sm-6">
            <div className="text-xs-center m-b-2">
              <h2>Crie seu perfil profissional na Ilevus.</h2>
            </div>

            <div className="ilv-card">
              <div className="ilv-card-body">
                <ul className="ilv-media-list m-a-0">

                  <li className="ilv-media ilv-media-middle p-b-2">
                    <div className="ilv-media-body">
                      <strong className="ilv-text-small ilv-text-uppercase text-muted">Passo 1</strong>
                      <h3 className="m-a-0">Informações básicas</h3>
                      <p>Lorem ipsum dolor sit amet.</p>
                      <a className="ilv-font-weight-semibold" href="profile-wizard-basic.html">Alterar informações</a>
                    </div>
                    <div className="ilv-media-right">
                      <i className="material-icons md-24 text-success">&#xE86C;</i>
                    </div>
                  </li>

                  <li className="ilv-media ilv-media-middle p-y-2">
                    <div className="ilv-media-body">
                      <strong className="ilv-text-small ilv-text-uppercase text-muted">Passo 2</strong>
                      <h3 className="m-a-0">Carreira profissional e formação</h3>
                      <p>Lorem ipsum dolor sit amet.</p>
                      <a className="ilv-btn ilv-btn-success" href="profile-wizard-career.html">Continuar</a>
                    </div>
                  </li>

                  <li className="ilv-media ilv-media-middle p-t-2 p-b-0">
                    <div className="ilv-media-body">
                      <strong className="ilv-text-small ilv-text-uppercase text-muted">Passo 3</strong>
                      <h3 className="m-a-0">Serviços prestados</h3>
                      <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                  </li>

                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <img className="ilv-img-fluid" src="http://previews.123rf.com/images/serrnovik/serrnovik0908/serrnovik090800149/5414688-Confident-young-business-woman-with-pen-and-amazing-smile-look-at-camera-isolated-on-white-Stock-Photo.jpg"/>
          </div>

        </div>
      </div>
    );
  }
});
