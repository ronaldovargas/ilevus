
var S = require("string");
var React = require("react");
var MaskedInput = require("react-maskedinput");
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
            Name: this.refs['profile-name'].value,
            PhoneNumber: this.refs['profile-phonenumber'].mask.getRawValue().trim(),
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
        return (
            <div>
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>{Messages.get("LabelProfilePicture")}</strong>
                    </div>
                    <div className="ilv-card-body">
                        <div className="ilv-media">
					        <div className="ilv-media-left">
                                <div className="media-left">
                                    <div className="avatar-fluid avatar-fluid-xl"
                                        style={{backgroundImage: "url("+(pic.isEmpty() ? UserIcon : pic.s)+")"}}
                                    />
                                </div>
                            </div>
					        <div className="ilv-media-body">
                                <span className="ilv-font-weight-semibold">{Messages.get("LabelSelectPicture")}</span>
                                <p className="ilv-text-small text-muted m-a-0">{Messages.get("TextProfilePictureLimitations")}</p>						        
					        </div>
                        </div>
                    </div>
                    <div className="ilv-card-footer">
                        <button className="ilv-btn ilv-btn-neutral" onClick={this.updatePicture}>{Messages.get("ActionSendPicture")}</button>
						{pic.isEmpty() ? "":
                            <button className="ilv-btn ilv-btn-link" onClick={this.removePicture} ref="picture-remove">
                                {Messages.get("ActionRemovePicture")}
                            </button>
					    }
                    </div>
                </div>

                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>{Messages.get("LabelBasicInfo")}</strong>
                    </div>
                    <div className="ilv-card-body">
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormFirstName">
                                            {Messages.get("LabelName")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editProfileFormFirstName"
                                               ref="profile-name"
                                               defaultValue={user.Name} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormLastName">
                                            {Messages.get("LabelSurname")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editProfileFormLastName"
                                               ref="profile-surname"
                                               defaultValue={user.Surname} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormGender">
                                            {Messages.get("LabelSex")}
                                        </label>
                                        <select className="ilv-form-control" id="editProfileFormGender" ref="profile-sex" defaultValue={user.Sex}>
                                            <option value="">-- {Messages.get("LabelSex")} --</option>
                                            <option value="M">{Messages.get("SexMale")}</option>
                                            <option value="F">{Messages.get("SexFemale")}</option>
                                        </select>
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormBirth">
                                            {Messages.get("LabelBirthdate")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="date"
                                               id="editProfileFormBirth"
                                               ref="profile-birthdate"
                                               defaultValue={user.Birthdate ? user.Birthdate.substr(0, 10):null} />
                                    </div>

                                    <div className="ilv-form-group m-b-0">
                                        <label className="ilv-form-label" htmlFor="editProfileFormPhone">
                                            {Messages.get("LabelPhoneNumber")}
                                        </label>
                                        <MaskedInput className="ilv-form-control"
                                                     type="tel"
                                                     spellCheck={false}
                                                     id="editProfileFormPhone"
                                                     ref="profile-phonenumber"
                                                     placeholderChar=" "
                                                     mask="111 111111111"
                                                     value={user.PhoneNumber} />
                                        <span className="ilv-text-small">
                                            {Messages.get("TextPhoneHelp")}
                                        </span>
                                    </div>
                                </div>
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
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormZipcode">
                                            {Messages.get("LabelZipcode")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editProfileFormZipcode"
                                               ref="address-zipcode"
                                               defaultValue={user.Zipcode} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormAddress">
                                            {Messages.get("LabelAddress")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editProfileFormAddress"
                                               ref="address-address"
                                               defaultValue={user.Address} />
                                    </div>

                                    <div className="ilv-form-group ">
                                        <label className="ilv-form-label" htmlFor="editProfileFormAddressApt">
                                            {Messages.get("LabelComplement")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editProfileFormAddressApt"
                                               ref="address-complement"
                                               defaultValue={user.Complement} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormDistrict">
                                            {Messages.get("LabelDistrict")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editProfileFormDistrict"
                                               ref="address-district"
                                               defaultValue={user.District} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormCity">
                                            {Messages.get("LabelCity")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editProfileFormCity"
                                               ref="address-city"
                                               defaultValue={user.City} />
                                    </div>

                                    <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editProfileFormState">
                                            {Messages.get("LabelCounty")}
                                        </label>
                                        <select className="ilv-form-control" id="editProfileFormState" ref="address-county" defaultValue={user.County}>
                                            <option value="MG">Minas Gerais</option>
                                        </select>
                                    </div>

                                    <div className="ilv-form-group  m-b-0">
                                        <label className="ilv-form-label" htmlFor="editProfileFormCountry">
                                            {Messages.get("LabelCountry")}
                                        </label>
                                        <select className="ilv-form-control" id="editProfileFormCountry" ref="address-country" defaultValue={user.Country}>
                                            <option value="Brazil">Brasil</option>
                                        </select>
                                    </div>
                                </div>
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
