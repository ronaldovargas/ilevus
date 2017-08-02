
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var ImgWizard = require('ilevus/img/img-wizard.png');

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    userData: {},
    childContextTypes: {
        professionalData: React.PropTypes.object,
        userId: React.PropTypes.string
    },
    getChildContext() {
        return this.userData;
    },
    getInitialState() {
        return {
            professionalData: null,
            data: null
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserSession.on("professionalprofile", (data) => {
            this.userData.professionalData = data.Professional,
            this.userData.userId = data.Id;
            me.setState({
                professionalData: data.Professional,
                data: data
            });
            console.log(data);
        }, me);

        UserSession.dispatch({
            action: UserSession.ACTION_RETRIEVE_PROFESSIONAL_PROFILE
        });
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    render() {
        if (!this.state.professionalData) {
            return <LoadingGauge />;
        }
        return (
            <div className="container">
                {this.props.children ? this.props.children : <div className="row justify-content-center">

                <div className="col-6">
                    <div className="my-5">
                        <h1 className="ma-0">{Messages.get("TextCreateYourProfessionalProfile")}</h1>
                        {this.state.professionalData.BasicInfo && this.state.professionalData.AddressInfo
                        && this.state.professionalData.EducationInfo && this.state.professionalData.CareerInfo
                        && this.state.professionalData.ServicesInfo ?
                            <li className="ilv-media ilv-media-middle pt-2 pb-0">
                                <div className="ilv-media-body">
                                    <Link className="ilv-btn ilv-btn-block ilv-btn-link ilv-font-weight-semibold"
                                          to={"/profile/"+this.state.data.Id}>{Messages.get("TextSeeMyProfile")}
                                    </Link>
                                </div>
                            </li>
                        :""}
                    </div>
                    <ul className="ilv-media-list ma-0">
                        <li className="ilv-media ilv-media-middle pb-4">
                            <div className="ilv-media-body">
                                <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                    {Messages.get("LabelStep")} 1
                                    {this.state.professionalData.BasicInfo ?
                                        <i className="material-icons md-18 text-success" style={{margin: "-3px 0 0 5px"}}>&#xE86C;</i>
                                    :""}
                                </strong>
                                <h3 className="ma-0">{Messages.get("LabelBasicInformation")}</h3>
                                <p>{Messages.get("TextBasicProfessionalInfo")}</p>
                                {this.state.professionalData.BasicInfo ?
                                <Link className="ilv-font-weight-semibold" to="/become-a-professional/basic">
                                    {Messages.get("LabelChangeInformation")}
                                </Link>
                                :
                                <Link className="ilv-btn ilv-btn-success" to="/become-a-professional/basic">
                                    {Messages.get("LabelContinue")}
                                </Link>
                                }
                            </div>
                        </li>

                        <li className="ilv-media ilv-media-middle pb-4">
                            <div className="ilv-media-body">
                                <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                    {Messages.get("LabelStep")} 2
                                    {this.state.professionalData.AddressInfo ?
                                    <i className="material-icons md-18 text-success" style={{margin: "-3px 0 0 5px"}}>&#xE86C;</i>
                                    :""}
                                </strong>
                                <h3 className="ma-0">{Messages.get("LabelAddress")}</h3>
                                <p>{Messages.get("TextAddressInfo")}</p>
                                {this.state.professionalData.BasicInfo ? (this.state.professionalData.AddressInfo ?
                                    <Link className="ilv-font-weight-semibold" to="/become-a-professional/address">
                                        {Messages.get("LabelChangeInformation")}
                                    </Link>
                                    :
                                    <Link className="ilv-btn ilv-btn-success" to="/become-a-professional/address">
                                        {Messages.get("LabelContinue")}
                                    </Link>
                                ):""}
                            </div>
                        </li>

                        <li className="ilv-media ilv-media-middle pb-4">
                            <div className="ilv-media-body">
                                <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                    {Messages.get("LabelStep")} 3
                                    {this.state.professionalData.EducationInfo ?
                                    <i className="material-icons md-18 text-success" style={{margin: "-3px 0 0 5px"}}>&#xE86C;</i>
                                    :""}
                                </strong>
                                <h3 className="ma-0">{Messages.get("TextEducation")}</h3>
                                <p>{Messages.get("TextEducationProfessionalInfo")}</p>
                                {this.state.professionalData.BasicInfo && this.state.professionalData.AddressInfo ?
                                    (this.state.professionalData.EducationInfo ?
                                        <Link className="ilv-font-weight-semibold" to="/become-a-professional/education">
                                            {Messages.get("LabelChangeInformation")}
                                        </Link>
                                        :
                                        <Link className="ilv-btn ilv-btn-success" to="/become-a-professional/education">
                                            {Messages.get("LabelContinue")}
                                        </Link>
                                ):""}
                            </div>
                        </li>

                        <li className="ilv-media ilv-media-middle pb-4">
                            <div className="ilv-media-body">
                                <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                    {Messages.get("LabelStep")} 4
                                    {this.state.professionalData.CareerInfo ?
                                    <i className="material-icons md-18 text-success" style={{margin: "-3px 0 0 5px"}}>&#xE86C;</i>
                                    :""}
                                </strong>
                                <h3 className="ma-0">{Messages.get("TextCareer")}</h3>
                                <p>{Messages.get("TextCareerProfessionalInfo")}</p>
                                {this.state.professionalData.BasicInfo && this.state.professionalData.AddressInfo
                                && this.state.professionalData.EducationInfo
                                ? (this.state.professionalData.CareerInfo ?
                                    <Link className="ilv-font-weight-semibold" to="/become-a-professional/career">
                                        {Messages.get("LabelChangeInformation")}
                                    </Link>
                                    :
                                    <Link className="ilv-btn ilv-btn-success" to="/become-a-professional/career">
                                        {Messages.get("LabelContinue")}
                                    </Link>
                                ):""}
                            </div>
                        </li>

                        <li className="ilv-media ilv-media-middle pb-0">
                            <div className="ilv-media-body">
                                <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                    {Messages.get("LabelStep")} 5
                                    {this.state.professionalData.ServicesInfo ?
                                    <i className="material-icons md-18 text-success" style={{margin: "-3px 0 0 5px"}}>&#xE86C;</i>
                                    :""}
                                </strong>
                                <h3 className="m-a-0">{Messages.get("TextOfferedServices")}</h3>
                                <p>{Messages.get("TextServicesProfessionalInfo")}</p>
                                {this.state.professionalData.BasicInfo && this.state.professionalData.AddressInfo
                                && this.state.professionalData.EducationInfo && this.state.professionalData.CareerInfo
                                ? (this.state.professionalData.ServicesInfo ?
                                    <Link className="ilv-font-weight-semibold" to="/become-a-professional/services">
                                        {Messages.get("LabelChangeInformation")}
                                    </Link>
                                    :
                                    <Link className="ilv-btn ilv-btn-success" to="/become-a-professional/services">
                                        {Messages.get("LabelContinue")}
                                    </Link>
                                ):""}
                            </div>
                        </li>

                        <li className="ilv-media ilv-media-middle pb-0">
                            <div className="ilv-media-body">
                                <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                    {Messages.get("LabelStep")} 6
                                    {this.state.professionalData.ServicesInfo ?
                                    <i className="material-icons md-18 text-success" style={{margin: "-3px 0 0 5px"}}>&#xE86C;</i>
                                    :""}
                                </strong>
                                <h3 className="m-a-0">{Messages.get("TextTitleBankAccountStep")}</h3>
                                <p>{Messages.get("TextServicesProfessionalBankAccount")}</p>
                                {this.state.professionalData.BasicInfo && this.state.professionalData.AddressInfo
                                && this.state.professionalData.EducationInfo && this.state.professionalData.CareerInfo
                                ? (this.state.professionalData.ServicesInfo ?
                                    <Link className="ilv-font-weight-semibold" to="/become-a-professional/bankAccount">
                                        {Messages.get("LabelChangeInformation")}
                                    </Link>
                                    :
                                    <Link className="ilv-btn ilv-btn-success" to="/become-a-professional/bankAccount">
                                        {Messages.get("LabelContinue")}
                                    </Link>
                                ):""}
                            </div>
                        </li>
                    </ul>
                  
                </div>

            </div>}
        </div>);
    }
});
