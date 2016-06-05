
var _ = require("underscore");
var $ = require("jquery");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Collapse = require("ilevus/jsx/vendor/anvil.js").collapse;

module.exports = React.createClass({
    getInitialState() {
        return {
            models: null
        };
    },
    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("search", (data) => {
            me.setState({
                models: data
            });
        }, me);

        UserStore.dispatch({
            action: UserStore.ACTION_SEARCH,
            data: {}
        });
    },
    componentWillUnmount() {
        UserStore.off(null, null, this);
    },

    renderModels() {
        if (!(this.state.models.length > 0)) {
            return <i>Nenhum usuário encontrado.</i>;
        }

        return <ul className="list-unstyled list-divided">
            {this.state.models.map((model, index) => {
                return <li key={"result-"+index}>
                    <div className="media">
                      <div className="media-left text-xs-center">
                        <p className="avatar avatar-xl">
                          <img className="img-fluid" src={model.Image} alt={model.Name} />
                        </p>
                      </div>
                      <div className="media-body">
                        <div>
                          <Link to={"/profile/"+model.Id}><strong>{model.Name} {model.Surname}</strong></Link>
                        </div>
                        <p>
                          <span className="label label-warning-o">Premium</span>
                          <small>Desenvolvimento Profissional</small>
                        </p>
                        <div>
                          <div className="btn-group">
                            <button className="btn btn-sm" data-toggle="tooltip" title="Agendar reunião">R</button>
                            <button className="btn btn-sm" data-toggle="tooltip" title="Enviar mensagem">M</button>
                            <button className="btn btn-sm" data-toggle="tooltip" title="Solicitar telefone">T</button>
                          </div>
                          <div className="btn-group">
                            <button className="btn btn-sm btn-clean">Salvar</button>
                            <button className="btn btn-sm btn-clean">Compartilhar</button>
                          </div>
                        </div>
                      </div>
                      <div className="media-right text-xs-center">
                        <h3>
                          <span className="label label-success font-weight-bold">4.9 <sup>/ 5.0</sup></span>
                        </h3>
                        <a className="small" href="">32 avaliações</a>
                      </div>
                    </div>
                </li>;
            })}
        </ul>;
    },

    render() {
        if (!this.state.models) {
            return <LoadingGauge />;
        }

        _.defer(() => {
            $('[data-toggle="tooltip"]').tooltip({
                animation: true
            });
        });

        return (<div>
          <div className="m-y-3" role="banner">
            <div className="container">
              <div className="row">
                <div className="col-xs-12">
                  <h1 className="h2 m-a-0">{this.props.params.term}</h1>
                  <p className="small">500 resultados para "{this.props.params.term}"</p>
                  <form className="form-inline">
                    <label className="form-element-label small font-weight-bold">Filtrar</label>
                    <select className="form-element form-element-sm">
                      <option>Especialidade</option>
                    </select>
                    <select className="form-element form-element-sm">
                      <option>Localização</option>
                    </select>
                    <div className="checkbox">
                      <label className="checkbox-inline" htmlFor="filter-online">
                        <input type="checkbox" id="filter-online" />
                          Atendem online
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-9">
                  {this.renderModels()}
                  <div>
                    <div style={{width: '100%', padding: '50px 0', textAlign: 'center', backgroundColor: '#eee', borderRadius: '2px', marginBottom: '1rem'}}>
                      <h2 className="font-weight-bold">Anúncio</h2>
                    </div>
                  </div>
              </div>
              <div className="col-xs-12 col-md-3">
                <div style={{width: '100%', height: '400px', backgroundColor: '#eee', borderRadius: '2px', marginBottom: '1rem'}}></div>
                <div style={{width: '100%', height: '400px', backgroundColor: '#eee', borderRadius: '2px', marginBottom: '1rem'}}></div>
                <div style={{width: '100%', height: '400px', backgroundColor: '#eee', borderRadius: '2px', marginBottom: '1rem'}}></div>
              </div>
            </div>
          </div>
        </div>);
    }
});
