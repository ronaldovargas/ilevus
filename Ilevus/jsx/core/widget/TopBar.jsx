
var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var LogoWhite = require('ilevus/img/ilevus-logo-white-20px.png');

module.exports = React.createClass({
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
        location.assign("#/search/" + encodeURI(this.refs['search-term'].value));
    },

    render() {
        return (<nav className="navbar navbar-fixed-top navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="#/">
              <img src={LogoWhite} />
            </a>
            <button className="navbar-toggler hidden-sm-up pull-xs-right" type="button" data-toggle="collapse" data-target="#js-navbar-collapse">&#9776;</button>
            <div className="collapse navbar-toggleable-xs" id="js-navbar-collapse">
                <form className="form-inline pull-sm-left" onSubmit={this.onSearch}>
                  <input ref="search-term" className="form-element form-element-sm" style={{borderColor: '#393973'}} type="text" />
                  <button className="btn btn-brand btn-sm" type="submit">Pesquisar</button>
                </form>
                {this.state.logged ? (
                <ul className="nav navbar-nav pull-sm-right">
                    <li className="nav-item">
                        <div className="dropdown">
                            <a id="js-profile-dropdown" href="javascript:void(0)" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="avatar avatar-navbar m-r-1">
                                    <img className="img-fluid" src="http://static2.blastingnews.com/media/photogallery/2016/4/26/290x290/b_290x290/tudo-pode-mudar-para-jon-snow-no-episodio-3_687287.jpg" alt={this.state.user.Name} />
                                </span>
                                <span style={{color: '#fff', fontSize: '13px', fontWeight: '600'}}>{this.state.user.Name}</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="js-profile-dropdown">
                                <a className="dropdown-item" href="#">Notificações</a>
                                <a className="dropdown-item" onClick={this.onLogout}>Logout</a>
                            </div>
                        </div>
                    </li>
                </ul>
                ) : (
                <ul className="nav navbar-nav pull-sm-right">
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
