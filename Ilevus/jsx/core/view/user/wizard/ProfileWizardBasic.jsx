
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var LanguageSelect = require("ilevus/jsx/core/widget/LanguageSelect.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object,
        professionalData: React.PropTypes.object.isRequired,
        userId: React.PropTypes.string.isRequired
    },
    getInitialState() {
        var map = LanguageSelect.LanguagesMap, lang,
            langs = this.context.professionalData.SpokenLanguages || [],
            langsMap = {};
        for (var i = 0; i < langs.length; i++) {
            lang = map[langs[i]];
            langs[i] = lang;
            langsMap[lang.code] = lang;
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
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    saveInfo(event) {
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

    render() {
        var langs = this.state.languages;
        return (
          <div className="container">
            <div className="p-y-3">
              <div className="col-sm-6 col-sm-offset-3">

                <div className="m-y-2">
                  <span className="ilv-progress">
                    <span className="ilv-progress-bar" style={{width: "0%"}}></span>
                  </span>
                </div>
                  
                <form onSubmit={this.saveInfo}>
                    <div className="ilv-card">
                      <div className="ilv-card-header">
                        <h3>{Messages.get("TextWizardHeaderBasic")}</h3>
                      </div>

                      <div className="ilv-card-body">

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
                            <div className="ilv-tag-input m-b-1" readonly={true}>
                                {langs.map((lang, index) => {
                                    return <span className="ilv-tag" key={"lang-"+index}>
                                        {lang.name} <a title={Messages.get("ActionRemoveLanguage")} onClick={this.removeLanguage.bind(this, index)}>&times;</a>
                                    </span>;
                                })}
                            </div>
                            <LanguageSelect className="ilv-form-control ilv-form-control-lg"
                                ref="field-lang"
                                filter={this.filterLanguages}
                                spellCheck={false} />
                            <a className="ilv-font-weight-semibold" onClick={this.addLanguage}>{Messages.get("ActionAddLanguage")}</a>
                          </fieldset>
                      </div>

                      <div className="ilv-card-footer ilv-text-xs-right">
                        <Link className="ilv-btn ilv-btn-clean" to="/become-a-professional">
                          {Messages.get("LabelBack")}
                        </Link>
                        <input
                               className="ilv-btn ilv-btn-primary"
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
