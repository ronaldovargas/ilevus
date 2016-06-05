
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

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
        UserSession.on("fail", (msg) => {
            $(this.refs["profile-save"]).removeClass("loading").removeAttr("disabled");
            $(this.refs["address-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.error(msg);
        }, me);
        UserSession.on("loaded", () => {
            me.setState({
                loading: false
            });
        }, me);
        UserSession.on("updateprofile", () => {
            $(this.refs["profile-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.success(Messages.get("TextProfileUpdateSuccess"));
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    saveAddress() {
        //console
    },
    saveProfile(event) {
        $(this.refs["profile-save"]).addClass("loading").attr("disabled", "disabled");
        var data = {
            Birthdate: this.refs['profile-birthdate'].value,
            Email: this.refs['profile-email'].value,
            Name: this.refs['profile-name'].value,
            PhoneNumber: this.refs['profile-phonenumber'].value,
            Sex: this.refs['profile-sex'].value,
            Surname: this.refs['profile-surname'].value
        };

        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PROFILE,
            data: data
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        return (<div>
            <div className="card m-b-2">
                <div className="card-header">
                    Foto do perfil
                </div>
                <div className="card-block">
                    <div className="media m-a-0">
					    <div className="media-left">
                            <span className="avatar avatar-xl">
                                <img className="img-fluid" src="http://static2.blastingnews.com/media/photogallery/2016/4/26/290x290/b_290x290/tudo-pode-mudar-para-jon-snow-no-episodio-3_687287.jpg"/>
                            </span>
                        </div>
					    <div className="media-body small">
                            <label className="font-weight-bold">Selecione uma foto</label>
						    <p>
							    Fotos claras e frontais do rosto são uma forma eficiente
							    de ilustrar seu perfil.
						    </p>
						    <p className="text-muted">Envie um arquivo de imagem no formato JPG, GIF ou PNG de no máximo 512kb.</p>
							<button className="btn btn-sm btn-neutral">Anexar foto</button>
							<button className="btn btn-sm btn-clean text-danger">Remover foto</button>
					    </div>
                    </div>
                </div>
            </div>
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
                                <input className="form-element form-element-sm"
                                       type="text"
                                       id="editProfileFormFirstName"
                                       ref="profile-name"
                                       defaultValue={user.Name} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormLastName">
                                {Messages.get("LabelSurname")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm"
                                       type="text"
                                       id="editProfileFormLastName"
                                       ref="profile-surname"
                                       defaultValue={user.Surname} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormGender">
                                {Messages.get("LabelSex")}
                            </label>
                            <div className="col-sm-3">
                                <select className="form-element form-element-sm" id="editProfileFormGender" ref="profile-sex" defaultValue={user.Sex}>
                                    <option value="">-- Sexo --</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormBirth">
                                {Messages.get("LabelBirthdate")}
                            </label>
                            <div className="col-sm-3">
                                <input className="form-element form-element-sm"
                                       type="date"
                                       id="editProfileFormBirth"
                                       ref="profile-birthdate"
                                       defaultValue={user.Birthdate ? user.Birthdate.substr(0, 10):null} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormMail">
                                {Messages.get("LabelEmail")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm"
                                       type="email"
                                       id="editProfileFormMail"
                                       ref="profile-email"
                                       defaultValue={user.Email} />
                                <span className="text-muted">Nós não compartilharemos o seu endereço de email privado com outros usuários.</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormPhone">
                                {Messages.get("LabelPhoneNumber")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element form-element-sm"
                                       type="tel"
                                       id="editProfileFormPhone"
                                       ref="profile-phonenumber"
                                       defaultValue={user.PhoneNumber} />
                                <span className="text-muted">
                                    Seu número de telefone adiciona mais segurança à sua conta na Ilevus. Nós não iremos compartilhar essa informação com outros usuários.
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <button className="btn btn-sm btn-brand" onClick={this.saveProfile} ref="profile-save">Salvar</button>
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
                <div className="card-footer">
                    <button className="btn btn-sm btn-brand" onClick={this.saveAddress} ref="address-save">Atualizar endereço</button>
                </div>
            </div>
        </div>);
    }
});
