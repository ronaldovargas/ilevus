
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var LanguageSelect = require("ilevus/jsx/core/widget/LanguageSelect.jsx");
var EducationForm = require("ilevus/jsx/core/widget/user/EducationForm.jsx");

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
        return {
            educations: this.context.professionalData.Education || [],
            adding: false,
            editing: -1
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
        var data = {
            Education: this.state.educations
        };
        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PROFESSIONAL_EDUCATION,
            data: data
        });
    },

    addEducation(data) {
        if (data) {
            this.state.educations.push(data);
            this.setState({
                adding: false
            });
        }
    },
    removeEducation(index, event) {
        event.preventDefault();
        this.state.educations.splice(index, 1);
        this.forceUpdate();
    },
    tweakAdding(event) {
        event && event.preventDefault();
        this.setState({
            adding: !this.state.adding,
            editing: -1
        });
    },
    startEditing(index, event) {
        event && event.preventDefault();
        this.setState({
            adding: false,
            editing: index
        });
    },
    editEducation(data) {
        if (data) {
            this.state.educations[this.state.editing] = data;
            this.setState({
                adding: false,
                editing: -1
            });
        }
    },
    cancelEditing() {
        this.setState({
            adding: false,
            editing: -1
        });
    },

    render() {
        return (<div className="container">
				<div className="p-y-3">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="m-y-2">
                            <span className="ilv-progress">
                                <span className="ilv-progress-bar" style={{width: "25%"}} />
                           </span>
                        </div>
						<div className="ilv-card">
							<div className="ilv-card-header">
								<h3>{Messages.get("TextEducation")}</h3>
							</div>
							<div className="ilv-card-body">
								<ul className="ilv-media-list ilv-media-list-bordered">
                                    {this.state.educations.map((education, index) => {
                                        if (index == this.state.editing) {
                                            return <EducationForm onSubmit={this.editEducation}
                                                onCancel={this.cancelEditing}
                                                education={this.state.educations[this.state.editing]}/>;
                                        }
                                        return <li className="ilv-media ilv-media-middle" key={"educ-"+index}>
										    <div className="ilv-media-body">
											    <h4>{education.Institution}</h4>
                                                <span className="ilv-text-large">
                                                    {Messages.get("EducationType" + education.Type)} | {education.Area}
                                                </span>
                                                <div className="ilv-text-large">
                                                    {education.Finished ?
                                                        education.Begin+" "+Messages.get("LabelTo")+" "+education.End
                                                        :
                                                        Messages.get("LabelStartedAt") + " " + education.Begin
                                                    }
                                                </div>
											    <p>{education.Description}</p>
                                            </div>
                                            <div className="ilv-media-right">
											    <button className="ilv-btn ilv-btn-link" onClick={this.startEditing.bind(this,index)}>
                                                    {Messages.get("ActionEdit")}
											    </button><br />
                                                <button className="ilv-btn ilv-btn-clean text-danger" onClick={this.removeEducation.bind(this,index)}>
                                                    {Messages.get("ActionRemove")}
                                                </button>
                                            </div>
									    </li>;
                                    })}
									
                                    {!this.state.adding && (this.state.editing < 0) ?
									    <li className="ilv-media">
										    <div className="ilv-media-body ilv-text-xs-center">
											    <button className="ilv-btn ilv-btn-link" onClick={this.tweakAdding}>
                                                    {Messages.get("ActionAddNewEducation")}
                                                </button>
										    </div>
									    </li>
                                    :""}
								</ul>
                                {this.state.adding ?
								    <EducationForm onSubmit={this.addEducation}
                                                   onCancel={this.tweakAdding} />
                                :""}
							</div>

                            {!this.state.adding && (this.state.editing < 0) ?
							    <div className="ilv-card-footer ilv-text-xs-right">
                                    <Link className="ilv-btn ilv-btn-clean" to="/become-a-professional">
                                        {Messages.get("LabelBack")}
                                    </Link>
                                    <button className="ilv-btn ilv-btn-neutral"
                                       onClick={this.saveInfo}
                                       ref="btn-submit">
                                        {Messages.get("LabelSave")}
                                    </button>
                                </div>
                            :""}
						</div>
					</div>
				</div>
      </div>);
    }
});