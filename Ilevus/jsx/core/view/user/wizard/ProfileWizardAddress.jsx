
var React = require("react");

var AddressForm = require("ilevus/jsx/core/widget/user/AddressForm.jsx");
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var Link = require("react-router").Link;

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object,
        professionalData: React.PropTypes.object.isRequired,
        userId: React.PropTypes.string.isRequired
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
        var data = this.refs["form-address"].getValues();
        console.log("Form submit:\n", data);
        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_ADDRESS,
            data: data
        });
    },

    render() {
    return (<div className="container">
		<div className="p-y-3">
			<div className="col-sm-6 col-sm-offset-3">
				<div className="m-y-2">
                    <span className="ilv-progress">
                        <span className="ilv-progress-bar" style={{width: "20%"}} />
                    </span>
                </div>

				<div className="ilv-card">
					<div className="ilv-card-header">
						<h3>{Messages.get("TextWizardHeaderAddress")}</h3>
					</div>
					<div className="ilv-card-body">
						<AddressForm addressData={this.context.professionalData} ref="form-address" />
					</div>

                    <div className="ilv-card-footer ilv-text-xs-right">
                        <Link className="ilv-btn ilv-btn-clean" to="/become-a-professional">
                            {Messages.get("LabelBack")}
                        </Link>
                        <button className="ilv-btn ilv-btn-primary" ref="btn-submit" onClick={this.saveInfo}>
                            {Messages.get("LabelSave")}
                        </button>
                    </div>
				</div>
			</div>
		</div>
	</div>);
    }
});
