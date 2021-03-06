﻿
var S = require("string");
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var AddressForm = require("ilevus/jsx/core/widget/user/AddressForm.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Modal = require("ilevus/jsx/core/widget/Modal.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserIcon = require("ilevus/img/user.png");
var Telephone =  require('components').Telephone;


module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },
    getInitialState() {
        return {
            loading: UserSession.get("loading"),
            picture: UserSession.get("loading") ? null : UserSession.get("user").Image,
            telephone:''
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
            PhoneNumber: this.state.telephone,
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
        var data = this.refs['form-address'].getValues();

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
    changeStateTelephone(value){
        this.setState({
            telephone: value
        })
    },
    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        var pic = S(this.state.picture);
        return (
            <div>
                <div className="mb-5">
                    <h4>{Messages.get("LabelProfilePicture")}</h4>
                    <div className="ilv-form-group">
                        <div className="ilv-media ilv-media-middle">
					        <div className="ilv-media-left">
                                <div className="media-left">
                                    <div className="ilv-avatar-fluid ilv-avatar-fluid-lg"
                                         style={{backgroundImage: "url("+(pic.isEmpty() ? UserIcon : pic.s)+")"}} />
                                </div>
					        </div>
					        <div className="ilv-media-body">
                                <span className="ilv-font-weight-semibold">{Messages.get("LabelSelectPicture")}</span>
                                <p className="ilv-text-small text-muted m-a-0">{Messages.get("TextProfilePictureLimitations")}</p>
					        </div>
                        </div>
                    </div>
                    <button className="ilv-btn ilv-btn-neutral" onClick={this.updatePicture}>{Messages.get("ActionSendPicture")}</button>
                    {pic.isEmpty() ? "" :
                        <button className="ilv-btn ilv-btn-link" onClick={this.removePicture} ref="picture-remove">
                            {Messages.get("ActionRemovePicture")}
                        </button>
                    }
                </div>

                <div className="row">
                    <div className="col mb-5">
                        <h4>{Messages.get("LabelBasicInfo")}</h4>
                        <form>
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
                                <Telephone onChange={this.changeStateTelephone} value={user.phonenumber}/>
                                <span className="ilv-text-small">
                                    {Messages.get("TextPhoneHelp")}
                                </span>
                            </div>
                        </form>
                        <button className="ilv-btn ilv-btn-primary" onClick={this.saveProfile} ref="profile-save">{Messages.get("LabelSave")}</button>
                    </div>

                    <div className="col mb-5">
                        <h4>{Messages.get("LabelMyAddress")}</h4>
                        <AddressForm addressData={user.Professional.Professional}
                                        ref="form-address" />
                        <button className="ilv-btn ilv-btn-primary" onClick={this.saveAddress} ref="address-save">{Messages.get("LabelUpdateAddress")}</button>
                    </div>
                </div>
            </div>
        );
    }
});
