
var S = require("string");
var React = require("react");

var Languages = require("ilevus/jsx/core/util/Languages.json");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var LanguagesMap = Languages.Mapped;

module.exports = createClass({
    statics: {
        LanguagesMap: LanguagesMap
    },
    getDefaultProps() {
        return {
            className: 'ilv-form-control',
            filter: this.emptyFilter
        };
    },
    emptyFilter(lang) {
        return true;
    },
    getValue() {
        if (S(this.refs['select'].value).isEmpty())
            return null;
        return Languages.List[this.refs['select'].value];
    },
    reset() {
        this.refs['select'].value = "";
    },
    render() {

        return <select {...this.props} ref='select'>
            <option value="">-- {Messages.get("LabelSelectLanguage")} --</option>
            {Languages.List.map((value, index) => {
                if (this.props.filter(value)) {
                    return <option key={"lang-opt-" + index} value={index }>
                        {value.nativeName}{value.nativeName != value.name ? " ("+value.name+")":""}
                    </option>;
                }
                return null;
            })}
        </select>;
    }
});