
var React = require("react");
var Link = require("react-router").Link;
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var ErrorAlert = require("ilevus/jsx/core/widget/ErrorAlert.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
		return {
			loaded: !UserSession.get("loading")
		};
	},
	onSubmit(evt) {
	    evt.preventDefault();
	    var data = {
	        email: this.refs['email'].value,
	        password: this.refs['password'].value,
	        stayconnected: this.refs['stayconnected'].checked
	    };
	    console.log(data);
		UserSession.dispatch({
			action: UserSession.ACTION_LOGIN,
			data: data
		});
	},
	componentDidMount() {
		var me = this;
		UserSession.on("login", model => {
			me.context.router.push("/home");
		}, me);
		UserSession.on("loaded", () => {
			me.setState({loaded: true});
		}, me);
		if (!!UserSession.get("logged")) {
		    me.context.router.push("/home");
		}
	},
	componentWillUnmount() {
		UserSession.off(null, null, this);
	},
	render() {
		if (!this.state.loaded) {
			return <LoadingGauge />;
		}
	    return (<div className="container">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-xl-6 col-xl-offset-3">
                    
                    <form className="p-t-3" onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                        <input className="form-element" id="email" name="email" type="email"  ref="email" />
                      </div>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="password">{Messages.get("LabelPassword")}</label>
                        <input className="form-element" id="password" name="password" type="password"  ref="password" />
                      </div>
                    
                      <ErrorAlert store={UserSession} />
                      
                      <div className="form-group row">
                        <div className="col-xs-12 col-sm-6 pull-sm-right">
                          <div className="checkbox btn btn-block">
                            <label htmlFor="stay-connected">
                              <input type="checkbox" id="stay-connected" ref="stayconnected" />
                                Permanecer conectado
                            </label>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                          <input type="submit" value="Entrar" className="btn btn-brand btn-block" />
                        </div>
                      </div>
                    </form>

                    <div className="text-xs-center">
                      <ul className="list-unstyled list-inline">
                        <li>
                            <Link to="/signup">Criar uma conta</Link>
                        </li>
                        <li> · </li>
                        <li>
                            <Link to="/recover-password">Recuperar senha</Link>
                        </li>
                      </ul>
                      <p className="text-muted small p-t-2">
                          ©2016 Ilevus. Todos os direitos reservados.
                      </p>
                    </div>
                  </div>
            </div>
        </div>);
	}
});
