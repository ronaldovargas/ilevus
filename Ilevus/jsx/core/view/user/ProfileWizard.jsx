
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

var Link = require("react-router").Link;

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            professionalData: null
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("fail", (msg) => {
            Toastr.error(msg);
        }, me);
        UserSession.on("professionalprofile", (data) => {
            me.setState({
                professionalData: data
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
        /*if (!this.state.professionalData) {
            return <LoadingGauge />;
        }*/
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
                              <strong className="ilv-text-small ilv-text-uppercase text-muted">Passo 1</strong>
                              <h3 className="m-a-0">Informações básicas</h3>
                              <p>Lorem ipsum dolor sit amet.</p>
                              <Link className="ilv-font-weight-semibold" to="/become-a-professional/career">
                                  Alterar informações
                              </Link>
                            </div>
                            <div className="ilv-media-right">
                              <i className="material-icons md-24 text-success">&#xE86C;</i>
                            </div>
                          </li>

                          <li className="ilv-media ilv-media-middle p-y-2">
                            <div className="ilv-media-body">
                              <strong className="ilv-text-small ilv-text-uppercase text-muted">Passo 2</strong>
                              <h3 className="m-a-0">Carreira profissional e formação</h3>
                              <p>Lorem ipsum dolor sit amet.</p>
                              <Link className="ilv-btn ilv-btn-success" to="/become-a-professional/career">
                                  Continuar
                              </Link>
                            </div>
                          </li>

                          <li className="ilv-media ilv-media-middle p-t-2 p-b-0">
                            <div className="ilv-media-body">
                              <strong className="ilv-text-small ilv-text-uppercase text-muted">Passo 3</strong>
                              <h3 className="m-a-0">Serviços prestados</h3>
                              <p>Lorem ipsum dolor sit amet.</p>
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
