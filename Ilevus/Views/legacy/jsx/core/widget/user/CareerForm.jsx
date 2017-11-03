
var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    propTypes: {
        career: React.PropTypes.object.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {
            career: {}
        };
    },
    getInitialState() {
        return {
            edit: !!this.props.career.Role,
            finished: !!this.props.career.Finished
        };
    },

    onSubmit(event) {
        event.preventDefault();
        var data = {
            Institution: S(this.refs['field-institution'].value).escapeHTML().s,
            Role: S(this.refs['field-role'].value).escapeHTML().s,
            Location: S(this.refs['field-location'].value).escapeHTML().s,
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
                    {Messages.get("LabelCareerInstitution")}
                </label>
			    <input className="ilv-form-control"
                       type="text"
                       spellCheck={false}
                       id="schoolName"
                       ref="field-institution"
                       defaultValue={this.props.career.Institution} />
		    </fieldset>
            <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="educationArea">
                    {Messages.get("LabelCareerRole")}
			    </label>
			    <input className="ilv-form-control"
                       type="text"
                       spellCheck={false}
                       id="educationArea"
                       ref="field-role"
                       defaultValue={this.props.career.Role} />
            </fieldset>

		    <fieldset className="ilv-form-group">
			    <label className="ilv-form-label" htmlFor="careerLocation">
                    {Messages.get("LabelCareerLocation")}
                </label>
			    <input className="ilv-form-control"
                       type="text"
                       spellCheck={false}
                       id="careerLocation"
                       ref="field-location"
                       defaultValue={this.props.career.Location} />
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
                               defaultValue={this.props.career.Begin} />
				    </div>
				    <div className="col-xs-6">
					    <input className="ilv-form-control"
                               type="number"
                               spellCheck={false}
                               id="educationEnd"
                               ref="field-end"
                               disabled={this.state.finished}
                               placeholder={Messages.get("LabelEndYear")}
                               defaultValue={this.props.career.End} />
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
                            {Messages.get("LabelWorkHere")}
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
                          defaultValue={this.props.career.Description} />
		    </fieldset>

		    <input type="submit"
                    className="ilv-btn ilv-btn-block ilv-btn-primary"
                    value={this.state.edit ? Messages.get("ActionSaveCareerExperience") : Messages.get("ActionAddNewCareerExperience")} />
			<button className="ilv-btn ilv-btn-block ilv-btn-clean" onClick={this.onCancel }>
			    {Messages.get("LabelCancel")}
            </button>
		</form>);
    }
});
