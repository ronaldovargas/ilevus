
var _ = require("underscore");
var $ = require("jquery");
var S = require("string");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Collapse = require("ilevus/jsx/vendor/anvil.js").collapse;

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

module.exports = React.createClass({
    getInitialState() {
        return {
            models: null,
            term: null,
            total: 0
        };
    },
    componentDidMount() {
        var me = this;
        UserStore.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserStore.on("search", (response) => {
            me.setState({
                models: response.data,
                term: me.props.params.term,
                total: response.total
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
    componentDidUpdate() {
        $('[data-toggle="tooltip"]').tooltip({
            animation: true
        });
    },

    renderModels() {
        if (!(this.state.models.length > 0)) {
            return <i>{Messages.get("LabelUserNotFound")}</i>;
        }

        return <div>
            {this.state.models.map((model, index) => {
                return <div className="card" key={"search-result-"+index}>
                    <div className="card-block" key={"result-"+index}>
                        <div className="media m-a-0">
                          <div className="media-left text-xs-center">
                            <div className="avatar-fluid avatar-fluid-xl"
                                style={{ backgroundImage: "url(" + (S(model.Image).isEmpty() ? UserIcon : model.Image) + ")" }}
                            />
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
                                <button className="btn btn-sm btn-clean">{Messages.get("LabelSave")}</button>
                                <button className="btn btn-sm btn-clean">{Messages.get("LabelShare")}</button>
                              </div>
                            </div>
                          </div>
                          <div className="media-right text-xs-center">
                            <h3>
                              <span className="label label-success font-weight-bold">4.9 <sup>/ 5.0</sup></span>
                            </h3>
                            <a className="small" href="">{Messages.format("TextEvaluations", [32])}</a>
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

        return (<div>
          <div className="m-t-2" role="banner">
            <div className="container">
              <div className="row">
                <div className="col-xs-12">
                    <div className="card">
                        <div className="card-block">
                            <h1 className="h3 m-a-0">{this.state.term}</h1>
                            <span className="small">{Messages.format("TextSearchNumberOfResults", [this.state.total, this.state.term])}</span>
                        </div>
                        <div className="card-footer bg-faded">
                            <form className="row">
                                <div className="col-sm-3">
                                    <select className="form-element form-element-sm">
                                        <option>{Messages.get("LabelLocalization")}</option>
                                    </select>
                                </div>
                                <div className="col-sm-3">
                                    <select className="form-element form-element-sm">
                                        <option>{Messages.get("LabelExpertise")}</option>
                                    </select>
                                </div>
                                <div className="checkbox col-sm-2">
                                    <label htmlFor="filter-online">
                                        <input type="checkbox" id="filter-online" /> {Messages.get("LabelMeetsOnline")}
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
                      <h2 className="font-weight-bold">{Messages.get("LabelAd")}</h2>
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
