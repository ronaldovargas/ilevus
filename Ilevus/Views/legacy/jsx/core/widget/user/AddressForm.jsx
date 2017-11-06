
var S = require("string");
var React = require("react");
var MaskedInput = require("react-maskedinput");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var Countries = require("ilevus/jsx/core/util/Countries.json");

module.exports = createClass({
    propTypes: {
        addressData: PropTypes.object.isRequired
    },

    getValues() {
        return {
            Address: this.refs['address-address'].value,
            StreetNumber: this.refs['address-StreetNumber'].value,
            Complement: this.refs['address-complement'].value,
            District: this.refs['address-district'].value,
            Zipcode: $('input[name*=zipcode')[0].value ,
            City: this.refs['address-city'].value,
            County: this.refs['address-county'].value,
            Country: this.refs['address-country'].value
        };
    },

    render() {
        var user = this.props.addressData;
        return <form>
            <fieldset className="ilv-form-group">
                <label className="ilv-form-label" htmlFor="editProfileFormZipcode">
                    {Messages.get("LabelZipcode")}
                </label>
                     <MaskedInput mask="11.111-111"
                        name="zipcode"
                        id="editProfileFormZipcode"
                        ref="address-zipcode"
                        className="ilv-form-control ilv-form-control-lg"
                        value={user.Zipcode}/>
            </fieldset>

            <fieldset className="ilv-form-group">
                <label className="ilv-form-label" htmlFor="editProfileFormAddress">
                    {Messages.get("LabelAddress")}
                </label>
                <input className="ilv-form-control"
                    type="text"
                    spellCheck={false}
                    id="editProfileFormAddress"
                    ref="address-address"
                    defaultValue={user.Address} />
            </fieldset>

            <fieldset className="ilv-form-group ">
                <label className="ilv-form-label" htmlFor="editProfileFormStreetNumber">
                    {Messages.get("LabelStreetNumber")}
                </label>
                <input className="ilv-form-control"
                    type="text"
                    spellCheck={false}
                    id="editProfileFormStreetNumber"
                    ref="address-StreetNumber"
                    defaultValue={user.StreetNumber} />
            </fieldset>

            <fieldset className="ilv-form-group ">
                <label className="ilv-form-label" htmlFor="editProfileFormAddressApt">
                    {Messages.get("LabelComplement")}
                </label>
                <input className="ilv-form-control"
                    type="text"
                    spellCheck={false}
                    id="editProfileFormAddressApt"
                    ref="address-complement"
                    defaultValue={user.Complement} />
            </fieldset>

            <fieldset className="ilv-form-group">
                <label className="ilv-form-label" htmlFor="editProfileFormDistrict">
                    {Messages.get("LabelDistrict")}
                </label>
                <input className="ilv-form-control"
                    type="text"
                    spellCheck={false}
                    id="editProfileFormDistrict"
                    ref="address-district"
                    defaultValue={user.District} />
            </fieldset>

            <fieldset className="ilv-form-group">
                <label className="ilv-form-label" htmlFor="editProfileFormCountry">
                    {Messages.get("LabelCountry")}
                </label>
                <select className="ilv-form-control" id="editProfileFormCountry" ref="address-country" defaultValue={user.Country}>
                    <option value="">-- {Messages.get("TextSelectYourCountry")} --</option>
                    {Countries.map((country, index) => {
                        return <option key={"country-"+index} value={country.name}>
                            {country.name == country.native ? country.name : country.native + " (" + country.name + ")"}
                        </option>;
                    })}
                </select>
            </fieldset>

            <fieldset className="ilv-form-group">
                <label className="ilv-form-label" htmlFor="editProfileFormState">
                    {Messages.get("LabelState")}
                </label>
                <input className="ilv-form-control"
                        type="text"
                        spellCheck={false}
                        id="editProfileFormState"
                        ref="address-county"
                        defaultValue={user.County} />
            </fieldset>

            <fieldset className="ilv-form-group">
                <label className="ilv-form-label" htmlFor="editProfileFormCity">
                    {Messages.get("LabelCity")}
                </label>
                <input className="ilv-form-control"
                       type="text"
                       spellCheck={false}
                       id="editProfileFormCity"
                       ref="address-city"
                       defaultValue={user.City} />
            </fieldset>

        </form>;
    }
});
