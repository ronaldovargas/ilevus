
var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    propTypes: {
        education: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            education: {}
        };
    },
    getInitialState() {
        return {
            edit: !!this.props.education.Institution,
            finished: !!this.props.education.Finished
        };
    },

    onSubmit(event) {
        event.preventDefault();
        var data = {
            Institution: S(this.refs['field-institution'].value).escapeHTML().s,
            Type: S(this.refs['field-type'].value).escapeHTML().s,
            Area: S(this.refs['field-area'].value).escapeHTML().s,
            Begin: this.refs['field-begin'].value,
            End: this.refs['field-end'].value,
            Finished: this.refs['field-finished'].checked,
            Description: S(this.refs['field-description'].value).escapeHTML().s
        };
        this.props.onSubmit(data);
    },
    onCancel(event) {
        event.preventDefault();
        this.props.onCancel();
    },

    finishedChange() {
        this.setState({
            finished: this.refs['field-finished'].checked
        });
    },

    render() {
        return (<form onSubmit={this.onSubmit }>
		    <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="schoolName">
                    {Messages.get("LabelEducationInstitution")}
                </label>
			    <input className="ilv-form-control"
                       type="text"
                       spellCheck={false}
                       id="schoolName"
                       ref="field-institution"
                       defaultValue={this.props.education.Institution} />
		    </fieldset>
            <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="educationArea">
                    {Messages.get("LabelEducationArea")}
			    </label>
			    <input className="ilv-form-control"
                       type="text"
                       spellCheck={false}
                       id="educationArea"
                       ref="field-area"
                       defaultValue={this.props.education.Area} />
            </fieldset>

		    <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="educationType">
                    {Messages.get("LabelEducationType")}
                </label>
			    <select className="ilv-form-control"
                        id="educationType"
                        ref="field-type"
                        defaultValue={this.props.education.Type}>
                    <option value="">-- {Messages.get("LabelSelect")} --</option>
				    <option value="Technical">{Messages.get("EducationTypeTechnical")}</option>
				    <option value="Bachelor">{Messages.get("EducationTypeBachelor")}</option>
				    <option value="Specialization">{Messages.get("EducationTypeSpecialization")}</option>
				    <option value="Masters">{Messages.get("EducationTypeMasters")}</option>
				    <option value="PhD">{Messages.get("EducationTypePhD")}</option>
				    <option value="Other">{Messages.get("EducationTypeOther")}</option>
			    </select>
		    </fieldset>

            <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="educationArea">
                    {Messages.get("LabelPeriod")}
			    </label>
                <div className="row">
				    <div className="col-xs-6">
					    <input className="ilv-form-control"
                               type="number"
                               spellCheck={false}
                               id="educationBegin"
                               ref="field-begin"
                               placeholder={Messages.get("LabelBeginYear")}
                               defaultValue={this.props.education.Begin} />
				    </div>
				    <div className="col-xs-6">
					    <input className="ilv-form-control"
                               type="number"
                               spellCheck={false}
                               id="educationEnd"
                               ref="field-end"
                               disabled={!this.state.finished}
                               placeholder={Messages.get("LabelEndYear")}
                               defaultValue={this.props.education.End} />
				    </div>
                </div>
            </fieldset>

		    <fieldset className="ilv-form-group">
			    <div className="ilv-checkbox">
				    <label htmlFor="educationFinished">
					    <input className="ilv-control-input"
                               type="checkbox"
                               id="educationFinished"
                               ref="field-finished"
                               defaultChecked={this.state.finished}
                               onChange={this.finishedChange} />
                        <span className="ilv-control-indicator"></span>
                        <span className="ilv-control-label">
                            {Messages.get("LabelFinished")}
                        </span>
				    </label>
			    </div>
		    </fieldset>
		    <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="educationDescription">
                    {Messages.get("LabelDescription")}
                </label>
			    <textarea className="ilv-form-control"
                          id="educationDescription"
                          rows="6"
                          ref="field-description"
                          defaultValue={this.props.education.Description} />
		    </fieldset>

		    <input type="submit"
                    className="ilv-btn ilv-btn-block ilv-btn-primary"
                    value={this.state.edit ? Messages.get("ActionSaveEducation") : Messages.get("ActionAddNewEducation")} />
			<button className="ilv-btn ilv-btn-block ilv-btn-clean" onClick={this.onCancel }>
			    {Messages.get("LabelCancel")}
            </button>
		</form>);
    }
});
