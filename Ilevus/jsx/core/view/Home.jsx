
var React = require("react");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");

var ImgNetworking = require('ilevus/img/lp-networking.jpg');

var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    onSearch(evt) {
        evt.preventDefault();
        var term = this.refs['search-term'].value;
        if (!string(term).isEmpty())
            this.context.router.push("/search/" + encodeURI(term));
    },
    render() {
        return (
          <div>
              <div className="ilv-lp-banner" role="banner">
                  <div className="container">
                      <div className="row">
                          <div className="col-xs-12">
                              <div className="ilv-lp-banner-content">
                                  <form onSubmit={this.onSearch}>
                                      <div className="ilv-text-xs-center">
                                          <h1 className="ilv-lp-banner-slogan">{Messages.get("TextSlogan")}</h1>
                                          <p className="ilv-lp-banner-lead">{Messages.get("TextSloganDescription")}</p>
                                      </div>
                                      <div className="ilv-form-group center-block">
                                          <div className="ilv-input-group">
                                              <input ref="search-term"
                                                     className="ilv-form-control ilv-form-control-lg ilv-lp-banner-form-control"
                                                     type="search" placeholder={Messages.get("TextSearchPlaceholder")} />
                                              <div className="ilv-input-group-btn">
                                                  <button className="ilv-btn ilv-btn-lg ilv-btn-block ilv-btn-success ilv-lp-banner-btn" type="submit">
                                                      {Messages.get("LabelSearch")}
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </form>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="ilv-lp-section">
                  <div className="container">
                      <div className="row">
                          <div className="col-md-8 col-md-offset-2">
                              <div className="ilv-text-xs-center">
                                  <h1 className="ilv-lp-section-heading">
                                      Crescimento profissional é na Ilevus
                                  </h1>
                                  <p className="ilv-lp-section-lead">
                                      Desenvolva sua carreira junto dos melhores profissionais do mercado e acelere o seu caminho até o sucesso.
                                  </p>
                              </div>
                          </div>
                          <div className="row m-b-3">
                  						<div className="col-md-4 ilv-text-xs-center">
                                  <i className="material-icons md-48 m-b-3">&#xE8B6;</i>
                							    <h3>Suporte Profissional</h3>
        							            <p>Encontre profissionais especializados em várias áreas de conhecimento, para te dar suporte na elaboração e execução dos seus projetos pessoais.</p>
                  						</div>
                  						<div className="col-md-4 ilv-text-xs-center">
                                  <i className="material-icons md-48 m-b-3">&#xE84E;</i>
                    							<h3>Networking</h3>
                    							<p>Agende reuniões, envie mensagens e troque conhecimento com pessoas que podem ajudar a mudar seu futuro.</p>
                  						</div>
                  						<div className="col-md-4 ilv-text-xs-center">
                                  <i className="material-icons md-48 m-b-3">&#xE905;</i>
                    							<h3>Crescimento Pessoal</h3>
                    							<p>Torne-se uma pessoa melhor, através de orientações que irão te ajudar a alcançar seus objetivos de forma a ser um destaque.</p>
                  						</div>
                					</div>
                          <div className="row">
                  						<div className="col-xs-12 ilv-text-xs-center">
                                  <button className="ilv-btn ilv-btn-primary ilv-btn-lg">Comece agora</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="ilv-lp-section ilv-lp-section-inverse">
                  <div className="container">
                      <div className="row">
                          <div className="col-md-6">
                              <h2 className="m-t-3 m-b-2">Agende uma reunião hoje mesmo.</h2>
                              <p className="ilv-text-large m-b-2">
                                Escolha entre os melhores profissionais do mundo e envie uma mensagem para agendar sua primeira reunião.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="ilv-lp-section ilv-lp-section-white p-b-0">
                  <div className="container">
                      <div className="row">
                        <div className="col-md-6 p-t-2 pull-md-right">
                            <h2 className="m-t-3 m-b-2">Faça parte da maior rede de profissionais em coaching do mundo.</h2>
                            <p className="ilv-text-large m-b-2">
                                É um profissional especializado em coaching? Crie seu perfil e divulgue seus serviços de
                                coaching e consultoria para clientes do mundo todo.
                            </p>
                            <button className="ilv-btn ilv-btn-lg ilv-btn-destructive">Crie seu perfil profissional</button>
                        </div>
                        <div className="col-md-6">
                            <img className="center-block" style={{"height": "500px"}} src={ImgNetworking} alt="ilevus" />
                        </div>
                      </div>
                  </div>
              </div>

              <div className="ilv-lp-section">
                  <div className="container">
                      <div className="row">
                          <div className="col-md-8 col-md-offset-2 ilv-text-xs-center">
                              <h2 className="m-b-2">Diversas ferramentas a sua disposição.</h2>
                              <p className="ilv-text-large m-b-3">
                                  Na Ilevus você tem acesso a ferramentas de ponta que irão te auxiliar nas tarefas do dia a dia.
                                  Torne seu trabalho mais dinâmico e produtivo, crie seu perfil profissional agora.
                              </p>
                              <br/>
                              <br/>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Roda da vida</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Rota de ação</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Grande jornada</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">S.M.A.R.T</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Dar e receber</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Roda da realização</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Lista de desejos</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Ganhos e perdas</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">DISC</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">Missão e visão</span>
                                  </div>
                              </div>
                          </div>
                          <div className="col-md-3 m-b-3">
                              <div className="ilv-media ilv-media-middle">
                                  <div className="ilv-media-left">
                                      <i className="material-icons md-48">&#xE84E;</i>
                                  </div>
                                  <div className="ilv-media-body">
                                      <span className="ilv-text-large ilv-font-weight-semibold">E muito mais...</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <footer className="ilv-lp-footer">
                  <div className="container">
                      <div className="col-xs-12">
                          <div className="ilv-text-xs-center">
                            <img src={LogoWhite} alt="ilevus" />
                          </div>
                      </div>
                  </div>
              </footer>
          </div>
        );
    }
});
