
var S = require("string");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");

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
            $(me.refs['picture-remove']).removeClass("loading").removeAttr("disabled", "disabled");
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

    removePicture(evt) {
        evt.preventDefault();
        Modal.confirm(
            Messages.get("LabelWarning"),
            Messages.get("TextRemovePictureConfirmation"),
            () => {
                Modal.hide();
                $(this.refs['picture-remove']).addClass("loading").attr("disabled", "disabled");
                UserSession.dispatch({
                    action: UserSession.ACTION_REMOVE_PICTURE
                });
            }
        );
    },

    updatePicture() {
        Modal.uploadFile(
            Messages.get("ActionSendPicture"),
            <p>{Messages.get("TextSendPicture")}</p>,
            UserSession.url + "/UpdatePicture",
            (arg1, arg2) => {
                Modal.hide();
                Toastr.success(Messages.get("TextPictureUpdateSuccess"));
                UserSession.dispatch({
                    action: UserSession.ACTION_REFRESH
                });
            },
            (xhr, status) => {
                Modal.hide();
                if (xhr.responseJSON && xhr.responseJSON.Message) {
                    Toastr.error(xhr.responseJSON.Message);
                } else {
                    Toastr.error(Messages.get("TextUnexpectedError"));
                }
            }
        );
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        var pic = S(this.state.picture);
        return (<div>
            <div className="card m-b-2">
                <div className="card-header">
                    {Messages.get("LabelProfilePicture")}
                </div>
                <div className="card-block">
                    <div className="media m-a-0">
					    <div className="media-left">
                            <div className="avatar-fluid avatar-fluid-xl"
                                 style={{backgroundImage: "url("+(pic.isEmpty() ? UserIcon : pic.s)+")"}}
                                 />
                        </div>
					    <div className="media-body small">
                            <label className="font-weight-bold">
                                {Messages.get("LabelSelectPicture")}
                            </label>
						    <p>
                                {Messages.get("TextProfilePictureDescription")}
						    </p>
						    <p className="text-muted">
                                {Messages.get("TextProfilePictureLimitations")}
                            </p>
							<button className="btn btn-neutral" onClick={this.updatePicture}>
                                {Messages.get("ActionSendPicture")}
                            </button>
                            {pic.isEmpty() ? "":
							    <button className="btn btn-clean text-danger" onClick={this.removePicture} ref="picture-remove">
                                    {Messages.get("ActionRemovePicture")}
                                </button>
                            }
					    </div>
                    </div>
                </div>
            </div>
            <div className="card m-b-2">
                <div className="card-header">
                    {Messages.get("LabelBasicInfo")}
                </div>
                <div className="card-block">
                    <form className="small ">
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormFirstName">
                                {Messages.get("LabelName")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element"
                                       type="text"
                                       id="editProfileFormFirstName"
                                       ref="profile-name"
                                       defaultValue={user.Name} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormLastName">
                                {Messages.get("LabelSurname")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element"
                                       type="text"
                                       id="editProfileFormLastName"
                                       ref="profile-surname"
                                       defaultValue={user.Surname} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormGender">
                                {Messages.get("LabelSex")}
                            </label>
                            <div className="col-sm-3">
                                <select className="form-element" id="editProfileFormGender" ref="profile-sex" defaultValue={user.Sex}>
                                    <option value="">-- Sexo --</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormBirth">
                                {Messages.get("LabelBirthdate")}
                            </label>
                            <div className="col-sm-3">
                                <input className="form-element"
                                       type="date"
                                       id="editProfileFormBirth"
                                       ref="profile-birthdate"
                                       defaultValue={user.Birthdate ? user.Birthdate.substr(0, 10):null} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormMail">
                                {Messages.get("LabelEmail")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element"
                                       type="email"
                                       id="editProfileFormMail"
                                       ref="profile-email"
                                       defaultValue={user.Email} />
                                <span className="text-muted">Nós não compartilharemos o seu endereço de email privado com outros usuários.</span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormPhone">
                                {Messages.get("LabelPhoneNumber")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element"
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
                    <button className="btn btn-brand" onClick={this.saveProfile} ref="profile-save">
                        {Messages.get("LabelSave")}
                    </button>
                </div>
            </div>
            <div className="card m-b-2">
                <div className="card-header">
                    {Messages.get("LabelMyAddress")}
                </div>
                <div className="card-block">
                    <form className="small">
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormZipcode">
                                {Messages.get("LabelZipcode")}
                            </label>
                            <div className="col-sm-4">
                                <input className="form-element"
                                       type="text"
                                       id="editProfileFormZipcode"
                                       ref="address-zipcode"
                                       defaultValue={user.Zipcode} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormAddress">
                                {Messages.get("LabelAddress")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element"
                                       type="text"
                                       id="editProfileFormAddress"
                                       ref="address-address"
                                       defaultValue={user.Address} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormAddressApt">
                                {Messages.get("LabelComplement")}
                            </label>
                            <div className="col-sm-4">
                                <input className="form-element"
                                       type="text"
                                       id="editProfileFormAddressApt"
                                       ref="address-complement"
                                       defaultValue={user.Complement} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormDistrict">
                                {Messages.get("LabelDistrict")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element"
                                       type="text"
                                       id="editProfileFormDistrict"
                                       ref="address-district"
                                       defaultValue={user.District} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormCity">
                                {Messages.get("LabelCity")}
                            </label>
                            <div className="col-sm-9">
                                <input className="form-element"
                                       type="text"
                                       id="editProfileFormCity"
                                       ref="address-city"
                                       defaultValue={user.City} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormState">
                                {Messages.get("LabelCounty")}
                            </label>
                            <div className="col-sm-3">
                                <select className="form-element"
                                        id="editProfileFormState"
                                        ref="address-county"
                                        defaultValue={user.County}>
                                    <option value="MG">Minas Gerais</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label text-sm-right" htmlFor="editProfileFormCountry">
                                {Messages.get("LabelCountry")}
                            </label>
                            <div className="col-sm-3">
                                <select className="form-element"
                                        id="editProfileFormCountry"
                                        ref="address-country"
                                        defaultValue={user.Country}>
                                    <option value="Brazil">Brasil</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="card-footer">
                    <button className="btn btn-brand" onClick={this.saveAddress} ref="address-save">
                        {Messages.get("LabelUpdateAddress")}
                    </button>
                </div>
            </div>
        </div>);
    }
});
