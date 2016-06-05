
var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var string = require("string");

var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            user: UserSession.get("user"),
            logged: !!UserSession.get("logged")
        };
    },
    componentWillMount() {
        var me = this;
        UserSession.on("login", session => {
            me.setState({
                user: session.get("user"),
                logged: true
            });
        }, me);
        UserSession.on("logout", session => {
            me.setState({
                user: null,
                logged: false
            });
        }, me);

        UserSession.on("confirmationemail", code => {
            console.log(encodeURIComponent(code));
            Modal.alert("Sucesso", "Um e-mail de confirmação foi enviado para o endereço cadastrado.");
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },
    onLogout(evt) {
        evt.preventDefault();
        UserSession.dispatch({
            action: UserSession.ACTION_LOGOUT
        });
    },
    onSearch(evt) {
        evt.preventDefault();
        var term = this.refs['search-term'].value;
        if (!string(term).isEmpty())
            this.context.router.push("/search/" + encodeURI(term));
    },
    confirmEmail(evt) {
        evt.preventDefault();
        UserSession.dispatch({
            action: UserSession.ACTION_CONFIRMATION_EMAIL
        });
    },

    render() {
        return (<nav className="navbar navbar-full navbar-dark bg-primary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#/">
              <img src={LogoWhite} />
            </a>
            <button className="navbar-toggler hidden-sm-up pull-xs-right" type="button" data-toggle="collapse" data-target="#js-navbar-collapse">&#9776;</button>
            <div className="collapse navbar-toggleable-xs" id="js-navbar-collapse">
                <form className="form-inline pull-sm-left" onSubmit={this.onSearch}>
                  <input ref="search-term" className="form-element form-element-sm" style={{borderColor: '#393973'}} type="search" />
                  <button className="btn btn-sm btn-brand" type="submit">Pesquisar</button>
                </form>
                {this.state.logged ? (
                <ul className="nav navbar-nav small pull-sm-right">
                    <li className="nav-item">
                        <a className="btn btn-sm btn-warning-o" href="#">Perfil profissional</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Mensagens</a>
                    </li>
                    <li className="nav-item">
                        <div className="dropdown">
                            <a id="js-profile-dropdown" href="javascript:void(0)" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="avatar avatar-navbar">
                                    <img className="img-fluid" src="http://static2.blastingnews.com/media/photogallery/2016/4/26/290x290/b_290x290/tudo-pode-mudar-para-jon-snow-no-episodio-3_687287.jpg" alt={this.state.user.Name} />
                                </span>
                                <span className="hidden-sm-up m-l-1" style={{color: '#fff', fontWeight: '600'}}>{this.state.user.Name}</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="js-profile-dropdown">
                                <Link className="dropdown-item" to="user/profile">Editar Perfil</Link>
                                <Link className="dropdown-item" to="user/account">Configurações da Conta</Link>
                                <a className="dropdown-item" onClick={this.confirmEmail}>Confirmar e-mail</a>
                                <a className="dropdown-item" onClick={this.onLogout}>Sair</a>
                            </div>
                        </div>
                    </li>
                </ul>
                ) : (
                <ul className="nav navbar-nav small pull-sm-right">
			        <li className="nav-item">
                        <Link className="nav-link" to="/signup">Cadastrar</Link>
                    </li>
			        <li className="nav-item">
				        <Link className="nav-link" to="/login">Entrar</Link>
			        </li>
                </ul>
                )}
            </div>
          </div>
        </nav>);
    }
});
