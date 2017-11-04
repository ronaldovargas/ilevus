var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var LanguageSelect = require("ilevus/jsx/core/widget/LanguageSelect.jsx");
var ServiceForm = require("ilevus/jsx/core/widget/user/ServiceForm.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object,
        professionalData: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired
    },
    getInitialState() {
        return {
            services: this.context.professionalData.Services || [],
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
            Services: this.state.services
        };
        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PROFESSIONAL_SERVICES,
            data: data
        });
    },

    addService(data) {
        if (data) {
            this.state.services.push(data);
            this.setState({
                adding: false
            });
        }
    },
    removeService(index, event) {
        event.preventDefault();
        this.state.services.splice(index, 1);
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
    editService(data) {
        if (data) {
            this.state.services[this.state.editing] = data;
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
				<div className="row justify-content-center">
					<div className="col-6">
                        <div className="text-center my-5">
								<h3>{Messages.get("TextOfferedServices")}</h3>
                        </div>
						<div className="ilv-card">
							
							<div className="ilv-card-body">
								<ul className="ilv-media-list ilv-media-list-bordered">
								    {this.state.services.map((service, index) => {
								        if (index == this.state.editing) {
								            return <ServiceForm onSubmit={this.editService}
                                                onCancel={this.cancelEditing}
                                                service={this.state.services[this.state.editing]} />;
								        }
								        return <li className="ilv-media ilv-media-middle" key={"career-" + index}>
										    <div className="ilv-media-body">
											    <h4 className="m-a-0">
                                                    {service.Name}
                                                </h4>
										    </div>
                                            <div className="ilv-media-right">
											    <button className="ilv-btn ilv-btn-icon ilv-btn-link px-0" onClick={this.startEditing.bind(this,index)}>
                                                    <i className="ilv-icon material-icons md-18">&#xE3C9;</i>
											    </button>
                                                <button className="ilv-btn ilv-btn-icon ilv-btn-clean text-danger px-0 ml-3" onClick={this.removeService.bind(this, index)}>
                                                    <i className="ilv-icon material-icons md-18">&#xE5C9;</i>
                                                </button>
                                            </div>
                                        </li>;
								    })}

								    {!this.state.adding && (this.state.editing < 0) ?
                                        <li className="ilv-media">
                                            <div className="ilv-media-body ilv-text-xs-center">
                                                <button className="ilv-btn ilv-btn-link" onClick={this.tweakAdding}>
                                                    {Messages.get("ActionAddNewOfferedService")}
                                                </button>
                                            </div>
                                        </li>
								    :""}
								</ul>
							    {this.state.adding ?
                                    <ServiceForm onSubmit={this.addService}
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
                                            ref="btn-submit">{Messages.get("LabelSave")}
                                    </button>
                                </div>
						    :""}
						</div>
					</div>
				</div>
        </div>);
        }
});
