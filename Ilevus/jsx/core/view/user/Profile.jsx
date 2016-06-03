
var React = require("react");
var Link = require("react-router").Link;

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: UserSession.get("loading")
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("loaded", () => {
            me.setState({
                loading: false
            });
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },
    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        return (<div>
            <div className="card m-b-2">
                <div className="card-header">
                    Informações básicas
                </div>
                <div className="card-block">
                    <form className="small ">
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormFirstName">
                                {Messages.get("LabelName")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm" type="text" id="editProfileFormFirstName" defaultValue={user.Name} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormLastName">
                                {Messages.get("LabelSurname")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm" type="text" id="editProfileFormLastName" defaultValue={user.Surname} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormGender">
                                {Messages.get("LabelSex")}
                            </label>
                            <div className="col-sm-3">
                                <select className="form-element form-element-sm" id="editProfileFormGender">
                                    <option>Sexo</option>
                                    <option>Masculino</option>
                                    <option>Feminino</option>
                                    <option>Outros</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormBirth">
                                {Messages.get("LabelBirthdate")}
                            </label>
                            <div className="col-sm-3">
                                <input className="form-element form-element-sm" type="date" id="editProfileFormBirth" defaultValue={new Date(user.Birthdate)} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormMail">
                                {Messages.get("LabelEmail")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm" type="email" id="editProfileFormMail" defaultValue={user.Email} />
                                <span className="text-muted">Nós não compartilharemos o seu endereço de email privado com outros usuários.</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormPhone">
                                {Messages.get("LabelPhoneNumber")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm" type="tel" id="editProfileFormPhone" defaultValue={user.PhoneNumber} />
                                <span className="text-muted">
                                    Seu número de telefone adiciona mais segurança à sua conta na Ilevus. Nós não iremos compartilhar essa informação com outros usuários.
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer text-xs-right">
                    <button className="btn btn-sm btn-brand">Salvar</button>
                </div>
            </div>
            <div className="card m-b-2">
                <div className="card-header">
                    Meu endereço
                </div>
                <div className="card-block">
                    <form className="small">
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormCountry">País</label>
                            <div className="col-sm-3">
                                <select className="form-element form-element-sm" id="editProfileFormCountry">
                                    <option>Brasil</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormZipcode">CEP / Código Postal</label>
                            <div className="col-sm-4">
                                <input className="form-element form-element-sm" type="text" id="editProfileFormZipcode" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormAddress">Endereço</label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm" type="text" id="editProfileFormAddress" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormAddressApt">Complemento</label>
                            <div className="col-sm-4">
                                <input className="form-element form-element-sm" type="text" id="editProfileFormAddressApt" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormCity">Cidade</label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm" type="text" id="editProfileFormCity" />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormState">Estado</label>
                            <div className="col-sm-3">
                                <select className="form-element form-element-sm" id="editProfileFormState">
                                    <option>Minas Gerais</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer text-xs-right">
                    <button className="btn btn-sm btn-brand">Atualizar endereço</button>
                </div>
            </div>
        </div>);
    }
});
