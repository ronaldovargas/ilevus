
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: UserSession.get("loading"),
            picture: UserSession.get("loading") ? null : UserSession.get("user").Image
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("fail", (msg) => {
            $(me.refs["profile-save"]).removeClass("loading").removeAttr("disabled");
            $(me.refs["address-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.error(msg);
        }, me);
        UserSession.on("loaded", () => {
            me.setState({
                loading: false,
                picture: UserSession.get("user").Image
            });
        }, me);
        UserSession.on("update", () => {
            me.setState({
                picture: UserSession.get("user").Image
            });
        }, me);
        UserSession.on("updateprofile", () => {
            $(me.refs["profile-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.success(Messages.get("TextProfileUpdateSuccess"));
        }, me);
        UserSession.on("updateaddress", () => {
            $(me.refs["address-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.success(Messages.get("TextAddressUpdateSuccess"));
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
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
    saveAddress() {
        $(this.refs["address-save"]).addClass("loading").attr("disabled", "disabled");
        var data = {
            Address: this.refs['address-address'].value,
            Complement: this.refs['address-complement'].value,
            District: this.refs['address-district'].value,
            Zipcode: this.refs['address-zipcode'].value,
            City: this.refs['address-city'].value,
            County: this.refs['address-county'].value,
            Country: this.refs['address-country'].value
        };

        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_ADDRESS,
            data: data
        });
    },

    updatePicture() {
        Modal.uploadFile(
            "Enviar um foto",
            <p>Selecione a foto que você deseja enviar:</p>,
            UserSession.url + "/UpdatePicture",
            (arg1, arg2) => {
                Modal.hide();
                Toastr.success(Messages.get("TextPictureUpdateSuccess"));
                UserSession.dispatch({
                    action: UserSession.ACTION_REFRESH
                });
            },
            (arg1, arg2) => {
                console.error("Picture upload failed:\n",arg1,"\n",arg2);
                Modal.hide();
                Toastr.error(Messages.get("TextUnexpectedError"));
            }
        );
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        return (
            <div>
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>{Messages.get("LabelProfilePicture")}</strong>
                    </div>
                    <div className="ilv-card-body">
                        <div className="ilv-media">
					        <div className="ilv-media-left">
                                <span className="ilv-avatar ilv-avatar-xl">
                                    <img src={this.state.picture} />
                                </span>
                            </div>
					        <div className="ilv-media-body">
                                <strong>{Messages.get("LabelSelectPicture")}</strong>
						        <p>{Messages.get("TextProfilePictureDescription")}</p>
						        <p className="text-muted">{Messages.get("TextProfilePictureLimitations")}</p>
							    <button className="ilv-btn ilv-btn-neutral" onClick={this.updatePicture}>{Messages.get("ActionSendPicture")}</button>
							    <button className="ilv-btn ilv-btn-clean text-danger">{Messages.get("ActionRemovePicture")}</button>
					        </div>
                        </div>
                    </div>
                </div>

                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>{Messages.get("LabelBasicInfo")}</strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormFirstName">{Messages.get("LabelName")}</label>
                                <input className="ilv-form-control" type="text" id="editProfileFormFirstName" ref="profile-name" defaultValue={user.Name} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormLastName">{Messages.get("LabelSurname")}</label>
                                <input className="ilv-form-control" type="text" id="editProfileFormLastName" ref="profile-surname" defaultValue={user.Surname} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormGender">{Messages.get("LabelSex")}</label>
                                <select className="ilv-form-control" id="editProfileFormGender" ref="profile-sex" defaultValue={user.Sex}>
                                    <option value="">-- Sexo --</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormBirth">{Messages.get("LabelBirthdate")}</label>
                                <input className="ilv-form-control" type="date" id="editProfileFormBirth" ref="profile-birthdate" defaultValue={user.Birthdate ? user.Birthdate.substr(0, 10):null} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormMail">{Messages.get("LabelEmail")}</label>
                                <input className="ilv-form-control" type="email" id="editProfileFormMail" ref="profile-email" defaultValue={user.Email} />
                                <span>Nós não compartilharemos o seu endereço de email privado com outros usuários.</span>
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormPhone">{Messages.get("LabelPhoneNumber")}</label>
                                <input className="ilv-form-control" type="tel" id="editProfileFormPhone" ref="profile-phonenumber" defaultValue={user.PhoneNumber} />
                                <span className="text-muted">
                                    Seu número de telefone adiciona mais segurança à sua conta na Ilevus. Nós não iremos compartilhar essa informação com outros usuários.
                                </span>
                            </div>
                        </form>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-primary" onClick={this.saveProfile} ref="profile-save">{Messages.get("LabelSave")}</button>
                    </div>
                </div>

                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>{Messages.get("LabelMyAddress")}</strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormZipcode">{Messages.get("LabelZipcode")}</label>
                                <input className="ilv-form-control" type="text" id="editProfileFormZipcode" ref="address-zipcode" defaultValue={user.Zipcode} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormAddress">{Messages.get("LabelAddress")}</label>
                                <input className="ilv-form-control" type="text" id="editProfileFormAddress" ref="address-address" defaultValue={user.Address} />
                            </div>

                            <div className="ilv-form-group ">
                                <label className="ilv-form-label" htmlFor="editProfileFormAddressApt">{Messages.get("LabelComplement")}</label>
                                <input className="ilv-form-control" type="text" id="editProfileFormAddressApt" ref="address-complement" defaultValue={user.Complement} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormDistrict">{Messages.get("LabelDistrict")}</label>
                                <input className="ilv-form-control" type="text" id="editProfileFormDistrict" ref="address-district" defaultValue={user.District} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormCity">{Messages.get("LabelCity")}</label>
                                <input className="ilv-form-control" type="text" id="editProfileFormCity" ref="address-city" defaultValue={user.City} />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormState">{Messages.get("LabelCounty")}</label>
                                <select className="ilv-form-control" id="editProfileFormState" ref="address-county" defaultValue={user.County}>
                                    <option value="MG">Minas Gerais</option>
                                </select>
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="editProfileFormCountry">{Messages.get("LabelCountry")}</label>
                                <select className="ilv-form-control" id="editProfileFormCountry" ref="address-country" defaultValue={user.Country}>
                                    <option value="Brazil">Brasil</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-primary" onClick={this.saveAddress} ref="address-save">{Messages.get("LabelUpdateAddress")}</button>
                    </div>
                </div>
            </div>
        );
    }
});
