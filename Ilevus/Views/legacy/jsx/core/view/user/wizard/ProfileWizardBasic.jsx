
var S = require("string");
require("ilevus/jsx/vendor/intlTelInput.js");

var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");
var MaskedInput = require('react-maskedinput')

var LanguageSelect = require("ilevus/jsx/core/widget/LanguageSelect.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object,
        professionalData: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired
    },
    state: {
        TaxDocument: '',
        AreaCode: '',
        Number: ''
    },
    getInitialState() {
        var map = LanguageSelect.LanguagesMap, lang,
            langs = this.context.professionalData.SpokenLanguages || [],
            langsMap = {}, code;
        for (var i = 0; i < langs.length; i++) {
            code = langs[i];
            lang = map[code];
            if (lang)
                lang.code = code;
            langs[i] = lang || code;
            langsMap[code] = lang || code;
        }
        return {
            languages: langs,
            languagesMap: langsMap
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("professionalprofile", (data) => {
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            me.context.router.push("/become-a-professional");
        }, me);
        console.log(this.context);
        this.updatePhoneInput();
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    saveInfo(event) {
        if (!this.phoneNumberValidation()) {
            Toastr.error(Messages.get("ValidationPhoneNumberInvalid"));
            return;
        }
        event.preventDefault();
        $(this.refs['btn-submit']).attr("disabled", true);
        var langs = [];
        for (var i = 0; i < this.state.languages.length; i++) {
            langs.push(this.state.languages[i].code);
        }
        var data = {
            Industry: this.refs['field-industry'].value,
            Headline: this.refs['field-headline'].value,
            Specialties: this.refs['field-specialties'].value,
            Summary: this.refs['field-summary'].value,
            BirthDate: $('input[name*=BirthDate')[0].value,
            TaxDocument: $('input[name*=TaxDocument')[0].value,
            Phone: $.trim($("#editProfileFormPhone").val()),
            SpokenLanguages: langs
        };
        console.log("Form submit:\n",data);
        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PROFESSIONAL_BASIC,
            data: data
        });
    },
    addLanguage(event) {
        event.preventDefault();
        var lang = this.refs['field-lang'].getValue();
        if (lang) {
            this.state.languages.push(lang);
            this.refs['field-lang'].reset();
            this.setState({
                languagesMap: this.getLanguagesMap()
            });
        }
    },
    removeLanguage(index) {
        this.state.languages.splice(index, 1);
        this.setState({
            languagesMap: this.getLanguagesMap()
        });
    },
    getLanguagesMap() {
        var data = {}, aux;
        for (var i = 0; i < this.state.languages.length; i++) {
            aux = this.state.languages[i];
            data[aux.code] = aux.name;
        }
        return data;
    },
    filterLanguages(lang) {
        if (this.state.languagesMap[lang.code])
            return false;
        return true;
    },
    phoneFilterRe: /[0-9\-\+ ]/,
    updatePhoneInput() {
        $("#editProfileFormPhone").intlTelInput();
    },
    phoneNumberValidation() {
        if (!$("#editProfileFormPhone").intlTelInput("isValidNumber")) {
            $("#editProfileFormPhone").addClass("ilv-invalid");
            return false;
        } else {
            $("#editProfileFormPhone").removeClass("ilv-invalid");
            return true;
        }
    },
    phoneNumberFilter(event, opts) {
        if (event.key && event.key.match && !event.key.match(this.phoneFilterRe))
            event.preventDefault();
    },
     _onChange(e) {
        var stateChange = {}
        stateChange[e.target.name] = e.target.value
        this.setState(stateChange)
    },
    render() {
        var langs = this.state.languages;
        return (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-6">
                 
                <form onSubmit={this.saveInfo}>
                    <div className="text-center my-5">
                        <h3>{Messages.get("TextWizardHeaderBasic")}</h3>
                    </div>
                    <div className="ilv-card">
                      <div className="ilv-card-body">

                          <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelTaxDocument")}</label>
                             <MaskedInput mask="111.111.111-11"
                                            name="TaxDocument"
                                            ref="field-TaxDocument"
                                            className="ilv-form-control ilv-form-control-lg"
                                            value={this.context.professionalData.TaxDocument}
                                            spellCheck={false}
                                            onChange={this._onChange} />

                          </fieldset>

                        <fieldset className="ilv-form-group">
                                 <div className="ilv-form-group m-b-0">

                                 <label className="ilv-form-label" htmlFor="editProfileFormPhone">
                                 {Messages.get("LabelPhoneNumber")}
                             </label>
                             <input onKeyPress={this.phoneNumberFilter} onKeyUp={this.phoneNumberValidation}
                                     type="tel"
                                     spellCheck={false}
                                     id="editProfileFormPhone"
                                     ref="profile-phonenumber"
                                     defaultValue={this.context.professionalData.Phone} />
                             <span className="ilv-text-small">
                                 {Messages.get("TextPhoneHelp")}
                             </span>



                                </div>
                        </fieldset>

                          <fieldset className="ilv-form-group">
                                        <label className="ilv-form-label">{Messages.get("LabelBirthDate")}</label>
                             <MaskedInput mask="11/11/1111"
                                            name="BirthDate"
                                            ref="field-BirthDate"
                                            className="ilv-form-control ilv-form-control-lg"
                                            value={this.context.professionalData.BirthDate}
                                            spellCheck={false} />

                          </fieldset>

                          <fieldset className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelIndustry")}</label>
                            <input className="ilv-form-control ilv-form-control-lg"
                                   ref="field-industry"
                                   defaultValue={this.context.professionalData.Industry}
                                   spellCheck={false}
                                   type="text" />
                          </fieldset>

                          <fieldset className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelHeadline")}</label>
                            <input className="ilv-form-control ilv-form-control-lg"
                                   ref="field-headline"
                                   defaultValue={this.context.professionalData.Headline}
                                   spellCheck={false}
                                   type="text" />
                          </fieldset>

                          <fieldset className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelSpecialties")}</label>
                            <input className="ilv-form-control ilv-form-control-lg"
                                   ref="field-specialties"
                                   defaultValue={this.context.professionalData.Specialties}
                                   spellCheck={false}
                                   type="text" />
                          </fieldset>

                          <fieldset className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelSummary")}</label>
                            <textarea rows="6"
                                      className="ilv-form-control ilv-form-control-lg"
                                      ref="field-summary"
                                      defaultValue={this.context.professionalData.Summary} />
                          </fieldset>

                          <fieldset className="ilv-form-group">
                            <label className="ilv-form-label">{Messages.get("LabelLanguages")}</label>
                            <div className="ilv-input-group">
                                <LanguageSelect className="ilv-form-control ilv-form-control-lg"
                                                ref="field-lang"
                                                filter={this.filterLanguages}
                                                spellCheck={false} />
                                <div className="ilv-input-group-btn">
                                    <button className="ilv-btn ilv-btn-lg ilv-btn-icon ilv-btn-success" onClick={this.addLanguage}>
                                        <i className="ilv-icon material-icons md-24">&#xE145;</i>
                                    </button>
                                </div>
                            </div>
                          </fieldset>

                          <fieldset className="ilv-form-group">
                            <div className="ilv-tag-input mb-2 ilv-text-xs-center" style={{backgroundColor: '#f5f7f9'}} readonly={true}>
                                {langs.map((lang, index) => {
                                    return <span className="ilv-tag" key={"lang-" + index }>
                                        {lang.nativeName ? lang.nativeName : lang} <a title={Messages.get("ActionRemoveLanguage")}
                                                                                      onClick={this.removeLanguage.bind(this, index)}>&times;</a>
                                    </span>;
                                })}
                            </div>
                          </fieldset>
                      </div>

                      <div className="ilv-card-footer ilv-text-xs-right">
                        <Link className="ilv-btn ilv-btn-clean" to="/become-a-professional">
                          {Messages.get("LabelBack")}
                          </Link>
                        <input className="ilv-btn ilv-btn-primary"
                               type="submit"
                               ref="btn-submit"
                               value={Messages.get("LabelSave")} />
                      </div>

                    </div>
                </form>
              </div>
            </div>
          </div>
        );
    }
});