
var React = require("react");
var Link = require("react-router").Link;
var Form = require("ilevus/jsx/core/widget/form/Form.jsx");
var UserStore = require("ilevus/jsx/core/store/User.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var AppLogo = require("ilevus/img/logo.png");

var VerticalForm = Form.VerticalForm;

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {};
	},
	onSubmit(data) {
	    UserStore.dispatch({
	        action: UserStore.ACTION_SIGNUP,
			data: data
		});
	},
	componentDidMount() {
		var me = this;
		UserStore.on("sync", model => {
		    router.push("/login");
		}, me);

	},
	componentWillUnmount() {
	    UserStore.off(null, null, this);
	},
	render() {
		return (<div className="container">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-xl-6 col-xl-offset-3">
                    <div className="p-y-3 text-xs-center">
                      <img src={AppLogo} />
                    </div>
                    <form className="p-t-3">
                      <div className="m-b-3 text-sm-center">
                        <h2>Crie sua conta agora</h2>
                        <p className="m-y-0">Faça seu cadastro em segundos, não precisa de cartão.</p>
                        <p>Já tem um cadastro na Ilevus? <Link to="/login">Faça seu login</Link></p>
                      </div>
                      <div className="form-group row">
                          <div className="col-xs-12 col-sm-6">
                            <label className="form-element-label" htmlFor="name">{Messages.get("LabelName")}</label>
                            <input className="form-element" id="name" name="name" type="text" />
                          </div>
                          <div className="col-xs-12 col-sm-6">
                            <label className="form-element-label" htmlFor="surname">{Messages.get("LabelSurname")}</label>
                            <input className="form-element" id="surname" name="surname" type="text" />
                          </div>
                      </div>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="email">{Messages.get("LabelEmail")}</label>
                        <input className="form-element" id="email" name="email" type="text" />
                      </div>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="phoneNumber">{Messages.get("LabelPhone")}</label>
                        <input className="form-element" id="phoneNumber" name="phoneNumber" type="tel" />
                      </div>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="sex">{Messages.get("LabelSex")}</label>
                        <input className="form-element" id="sex" name="sex" type="text" />
                      </div>
                      <div className="form-group">
                        <label className="form-element-label" htmlFor="address">{Messages.get("LabelAddress")}</label>
                        <input className="form-element" id="address" name="address" type="text" />
                      </div>
                      <div className="form-group row">
                          <div className="col-xs-12 col-sm-6">
                              <label className="form-element-label" htmlFor="password">{Messages.get("LabelPassword")}</label>
                              <input className="form-element" id="password" name="password" type="password" />
                          </div>
                          <div className="col-xs-12 col-sm-6">
                              <label className="form-element-label" htmlFor="passwordconfirm">{Messages.get("LabelPasswordConfirm")}</label>
                              <input className="form-element" id="passwordconfirm" name="passwordconfirm" type="text" />
                          </div>
                      </div>
                      <p className="small">
                          Ao clicar em "Criar minha conta", você está de acordo com nossa
                          Política de Privacidade e Termos de Uso.
                      </p>
                      <div className="form-group row">
                        <div className="col-xs-12 col-sm-6">
                          <input type="submit" value="Criar minha conta" className="btn btn-brand btn-block" />
                        </div>
                      </div>
                    </form>

                    <div className="text-xs-center">
                      <p className="text-muted small p-t-2">
                          ©2016 Ilevus. Todos os direitos reservados.
                      </p>
                    </div>
                  </div>
              </div>
		</div>);
	}
});
