
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

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
                  {this.props.children ? this.props.children:<div className="row p-t-3">

                  <div className="col-sm-6">
                    <div className="text-xs-center m-b-2">
                      <h2>{Messages.get("TextCreateYourProfessionalProfile")}</h2>
                    </div>

                    <div className="ilv-card">
                      <div className="ilv-card-body">
                        <ul className="ilv-media-list m-a-0">

                          <li className="ilv-media ilv-media-middle p-b-2">
                            <div className="ilv-media-body">
                              <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                    {Messages.get("LabelStep")} 1
                              </strong>
                              <h3 className="m-a-0">{Messages.get("LabelBasicInformation")}</h3>
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
                            <div className="ilv-media-right">
                              {this.state.professionalData.BasicInfo ?
                                <i className="material-icons md-24 text-success">&#xE86C;</i>
                               :""}
                            </div>
                          </li>

                          <li className="ilv-media ilv-media-middle p-y-2">
                            <div className="ilv-media-body">
                              <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                  {Messages.get("LabelStep")} 2
                              </strong>
                              <h3 className="m-a-0">{Messages.get("TextCareerEducation")}</h3>
                              <p>{Messages.get("TextCareerProfessionalInfo")}</p>
                              {this.state.professionalData.BasicInfo ? (this.state.professionalData.CareerInfo ?
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

                          <li className="ilv-media ilv-media-middle p-t-2 p-b-0">
                            <div className="ilv-media-body">
                              <strong className="ilv-text-small ilv-text-uppercase text-muted">
                                  {Messages.get("LabelStep")} 3
                              </strong>
                              <h3 className="m-a-0">{Messages.get("TextOfferedServices")}</h3>
                              <p>{Messages.get("TextServicesProfessionalInfo")}</p>
                              {this.state.professionalData.BasicInfo && this.state.professionalData.CareerInfo ? (this.state.professionalData.ServicesInfo ?
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

                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <img className="ilv-img-fluid" src="http://previews.123rf.com/images/serrnovik/serrnovik0908/serrnovik090800149/5414688-Confident-young-business-woman-with-pen-and-amazing-smile-look-at-camera-isolated-on-white-Stock-Photo.jpg"/>
                  </div>

                </div>}
              </div>
        );
    }
});
