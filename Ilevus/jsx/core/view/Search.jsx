
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
            models: null,
            term: null
        };
    },
    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("search", (data) => {
            me.setState({
                models: data,
                term: me.props.params.term
            });
        }, me);

        UserStore.dispatch({
            action: UserStore.ACTION_SEARCH,
            data: {
                keywords: me.props.params.term
            }
        });
    },
    componentWillUnmount() {
        UserStore.off(null, null, this);
    },
    componentWillReceiveProps(newProps) {
        UserStore.dispatch({
            action: UserStore.ACTION_SEARCH,
            data: {
                keywords: newProps.params.term
            }
        });
    },

    renderModels() {
        if (!(this.state.models.length > 0)) {
            return <i>Nenhum usuário encontrado.</i>;
        }

        return <div>
            {this.state.models.map((model, index) => {
                return <div className="card" key={"search-result-"+index}>
                    <div className="card-block" key={"result-"+index}>
                        <div className="media m-a-0">
                          <div className="media-left text-xs-center">
                            <span className="avatar avatar-xl">
                              <img className="img-fluid" src={model.Image} alt={model.Name} />
                            </span>
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
                    </div>
                </div>;
            })}
        </div>;
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
          <div className="m-t-2" role="banner">
            <div className="container">
              <div className="row">
                <div className="col-xs-12">
                    <div className="card">
                        <div className="card-block">
                            <h1 className="h3 m-a-0">{this.state.term}</h1>
                            <span className="small">500 resultados para "{this.state.term}"</span>
                        </div>
                        <div className="card-footer bg-faded">
                            <form className="row">
                                <div className="col-sm-3">
                                    <select className="form-element form-element-sm">
                                        <option>Localização</option>
                                    </select>
                                </div>
                                <div className="col-sm-3">
                                    <select className="form-element form-element-sm">
                                        <option>Especialidade</option>
                                    </select>
                                </div>
                                <div className="checkbox col-sm-2">
                                    <label htmlFor="filter-online">
                                        <input type="checkbox" id="filter-online" /> Atendem online
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div>
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
              </div>
            </div>
          </div>
        </div>);
    }
});
