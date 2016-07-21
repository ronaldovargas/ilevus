
var S = require("string");
var React = require("react");
var MaskedInput = require("react-maskedinput");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        addressData: React.PropTypes.object.isRequired
    },

    getValues() {
        return {
            Address: this.refs['address-address'].value,
            Complement: this.refs['address-complement'].value,
            District: this.refs['address-district'].value,
            Zipcode: this.refs['address-zipcode'].value,
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
                <input className="ilv-form-control"
                    type="text"
                    spellCheck={false}
                    id="editProfileFormZipcode"
                    ref="address-zipcode"
                    defaultValue={user.Zipcode} />
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

            <fieldset className="ilv-form-group  m-b-0">
                <label className="ilv-form-label" htmlFor="editProfileFormCountry">
                    {Messages.get("LabelCountry")}
                </label>
                <select className="ilv-form-control" id="editProfileFormCountry" ref="address-country" defaultValue={user.Country}>
                    <option value="Brazil">Brasil</option>
                </select>
            </fieldset>

            <fieldset className="ilv-form-group">
                <label className="ilv-form-label" htmlFor="editProfileFormState">
                    {Messages.get("LabelCounty")}
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
