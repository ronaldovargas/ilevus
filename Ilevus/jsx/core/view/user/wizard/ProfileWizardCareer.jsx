
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var LanguageSelect = require("ilevus/jsx/core/widget/LanguageSelect.jsx");
var CareerForm = require("ilevus/jsx/core/widget/user/CareerForm.jsx");

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
            careers: this.context.professionalData.Career || [],
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
            Career: this.state.careers
        };
        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PROFESSIONAL_CAREER,
            data: data
        });
    },

    addCareer(data) {
        if (data) {
            this.state.careers.push(data);
            this.setState({
                adding: false
            });
        }
    },
    removeCareer(index, event) {
        event.preventDefault();
        this.state.careers.splice(index, 1);
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
    editCareer(data) {
        if (data) {
            this.state.careers[this.state.editing] = data;
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
					<div className="col-sm-6 offset-sm-3">

						<div className="ilv-card">
							<div className="ilv-card-header">
								<h3>{Messages.get("TextCareer")}</h3>
							</div>
							<div className="ilv-card-body">
								<ul className="ilv-media-list ilv-media-list-bordered">
                                    {this.state.careers.map((career, index) => {
                                        if (index == this.state.editing) {
                                            return <CareerForm onSubmit={this.editCareer}
                                                onCancel={this.cancelEditing}
                                                career={this.state.careers[this.state.editing]}
                                            />;
                                        }
                                        return <li className="ilv-media ilv-media-middle" key={"career-" + index}>
										    <div className="ilv-media-body">
											    <h4 className="m-a-0">{career.Role}</h4>
                                                <span>
                                                    {career.Institution} | {career.Location}
                                                </span>
                                                <div className="ilv-text-small text-muted">
                                                    {!career.Begin ? "":(career.Finished ?
                                                        career.Begin + " " + Messages.get("LabelTo") + " " + career.End
                                                        :
                                                        Messages.get("LabelStartedAt") + " " + career.Begin
                                                    )}
                                                </div>
											    <p>{career.Description}</p>
                                            </div>
                                            <div className="ilv-media-right">
											    <button className="ilv-btn ilv-btn-icon ilv-btn-link p-x-0" onClick={this.startEditing.bind(this,index)}>
                                                    <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
											    </button>
                                                <button className="ilv-btn ilv-btn-icon ilv-btn-clean text-danger p-x-0 m-l-1" onClick={this.removeCareer.bind(this, index)}>
                                                    <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                                </button>
                                            </div>
									    </li>;
                                    })}
									
                                    {!this.state.adding && (this.state.editing < 0) ?
                                        <li className="ilv-media">
                                            <div className="ilv-media-body ilv-text-xs-center">
                                                <button className="ilv-btn ilv-btn-link" onClick={this.tweakAdding}>
                                                    {Messages.get("ActionAddNewCareerExperience")}
                                                </button>
                                            </div>
                                        </li>
                                    :""}
                                </ul>
                                {this.state.adding ?
                                    <CareerForm onSubmit={this.addCareer}
                                        onCancel={this.tweakAdding} />
                                :""}
                            </div>

                            {!this.state.adding && (this.state.editing < 0) ?
                                <div className="ilv-card-footer ilv-text-xs-right">
                                    <Link className="ilv-btn ilv-btn-clean" to="/become-a-professional">
                                        {Messages.get("LabelBack")}
                                    </Link>
                                    <button className="ilv-btn ilv-btn-primary"
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
