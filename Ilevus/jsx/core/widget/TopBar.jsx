
var React = require("react");
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
    	location.assign("#/search/"+encodeURI(this.refs['search-term'].value));
    },

	render() {
	    return (<nav className="navbar navbar-fixed-top navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="#/">
              <img src={LogoWhite} />
            </a>
            <button className="navbar-toggler hidden-sm-up pull-right-xs" type="button" data-toggle="collapse" data-target="#js-navbar-collapse">&#9776;</button>
            <div className="collapse navbar-toggleable-xs" id="js-navbar-collapse">
                <form className="form-inline" onSubmit={this.onSearch}>
                  <input ref="search-term" className="form-element form-element-sm" type="text" />
                  <button className="btn btn-sm btn-neutral" type="submit">Buscar</button>
                </form>
                {this.state.logged ? (
                <div className="navbar-nav">
                    <span className="nav-item" style={{
			                marginRight: '5px',
			                height: '50px',
			                width: '50px',
			                borderRadius: '100%',
			                backgroundPosition: 'center',
                            backgroundSize: 'auto 100%',
			                backgroundImage: "url(" + this.state.user.Image+")"
			            }} />
			        <span className="nav-item">{this.state.user.Name}</span>
			        <span className="nav-item" title="Notificações">Notificações</span>
			        <a className="nav-item" onClick={this.onLogout}>
				        <span title="Sair">Logout</span>
			        </a>
                </div>
                ):""}
            </div>
          </div>
        </nav>);
        /*<div className="ilevus-top-bar">
			    <span className="ilevus-fill" />
			    <span style={{
			            marginRight: '5px',
			            height: '50px',
			            width: '50px',
			            borderRadius: '100%',
			            backgroundPosition: 'center',
                        backgroundSize: 'auto 100%',
			            backgroundImage: "url(" + this.state.user.Image+")"
			        }} />
			    <span>{this.state.user.Name}</span>
			    <span title="Notificações" className="mdi mdi-bell" />
			    <a onClick={this.onLogout}>
				    <span title="Sair" className="mdi mdi-logout" />
			    </a>
		</div>);*/
	  }
	});
