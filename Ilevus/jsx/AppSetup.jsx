/**
    Este � o arquivo que faz o setup do aplica��o (frontend).
    Aqui s�o definidas as rotas das telas, configura��es de locale,
    entre outras opera��es de inicializa��o da aplica��o.
*/

var _ = require("underscore");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var moment = require("moment");
var moment_pt_br = require("moment/locale/pt-br.js");
var moment_es = require("moment/locale/es.js");
var Numeral = require("numeral");
var Toastr = require("toastr");
var S = require("string");
var Marked = require("marked");

var React = require("react");
var ReactDOM = require("react-dom");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRedirect = ReactRouter.IndexRedirect;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;
var hashHistory = ReactRouter.hashHistory;

var Application = require("ilevus/jsx/Application.jsx");
var Error = require("ilevus/jsx/core/view/Error.jsx");
var Home = require("ilevus/jsx/core/view/Home.jsx");
var NotFound = require("ilevus/jsx/core/view/NotFound.jsx");
var Search = require("ilevus/jsx/core/view/Search.jsx");

var Login = require("ilevus/jsx/core/view/user/Login.jsx");
var ConfirmEmail = require("ilevus/jsx/core/view/user/ConfirmEmail.jsx");
var ConfirmEmailChange = require("ilevus/jsx/core/view/user/ConfirmEmailChange.jsx");
var PublicProfile = require("ilevus/jsx/core/view/user/PublicProfile.jsx");
var RecoverPassword = require("ilevus/jsx/core/view/user/RecoverPassword.jsx");
var Register = require("ilevus/jsx/core/view/user/Register.jsx");
var ResetPassword = require("ilevus/jsx/core/view/user/ResetPassword.jsx");

var ProfileWizard = require("ilevus/jsx/core/view/user/wizard/ProfileWizard.jsx");
var ProfileWizardBasic = require("ilevus/jsx/core/view/user/wizard/ProfileWizardBasic.jsx");
var ProfileWizardAddress = require("ilevus/jsx/core/view/user/wizard/ProfileWizardAddress.jsx");
var ProfileWizardEducation = require("ilevus/jsx/core/view/user/wizard/ProfileWizardEducation.jsx");
var ProfileWizardCareer = require("ilevus/jsx/core/view/user/wizard/ProfileWizardCareer.jsx");
var ProfileWizardServices = require("ilevus/jsx/core/view/user/wizard/ProfileWizardServices.jsx");

var UserAccount = require("ilevus/jsx/core/view/user/Account.jsx");
var UserDashboard = require("ilevus/jsx/core/view/user/Dashboard.jsx");
var UserManagement = require("ilevus/jsx/core/view/user/Management.jsx");
var UserProfessionalProfile = require("ilevus/jsx/core/view/user/ProfessionalProfile.jsx");
var UserProfile = require("ilevus/jsx/core/view/user/Profile.jsx");
var UserSchedule = require("ilevus/jsx/core/view/user/Schedule.jsx");
var UserViewSchedule = require("ilevus/jsx/core/view/user/ViewSchedule.jsx");

var ProcessDefinition = require("ilevus/jsx/core/view/user/coaching/CoachingProcessesDefinition.jsx");
var CoachingProcesses = require("ilevus/jsx/core/view/user/coaching/CoachingProcesses.jsx");
var HireProfessional = require("ilevus/jsx/core/view/user/coaching/HireProfessional.jsx");
var SessionDetails = require("ilevus/jsx/core/view/user/coaching/SessionDetails.jsx");

var CoachingToolsContainer = require("ilevus/jsx/core/view/user/coaching/tools/CoachingToolsContainer.jsx");
var WheelOfLife = require("ilevus/jsx/core/view/user/coaching/tools/wheeloflife/WheelOfLife.jsx");

var AdminPanel = require("ilevus/jsx/core/view/admin/AdminPanel.jsx");
var AdminPanelAds = require("ilevus/jsx/core/view/admin/AdminPanelAds.jsx");
var AdminPanelUsers = require("ilevus/jsx/core/view/admin/AdminPanelUsers.jsx");
var AdminPanelEmails = require("ilevus/jsx/core/view/admin/AdminPanelEmails.jsx");
var AdminPanelTranslate = require("ilevus/jsx/core/view/admin/AdminPanelTranslate.jsx");

var Notifications = require("ilevus/jsx/core/view/notifications/Notifications.jsx");
var NotificationsMessages = require("ilevus/jsx/core/view/notifications/NotificationsMessages.jsx");
var NotificationsTimeline = require("ilevus/jsx/core/view/notifications/NotificationsTimeline.jsx");

var MarkdownGuide = require("ilevus/jsx/core/view/help/MarkdownGuide.jsx");

// string config
S.TMPL_OPEN = '{';
S.TMPL_CLOSE = '}';

// Numeral configuration
Numeral.locale('pt-BR', require("numeral/locales/pt-br.js"));
Numeral.locale('es', require("numeral/locales/es.js"));
Numeral.locale("pt-BR");

//Toastr.options.positionClass = "toast-top-center";
Toastr.options.positionClass = "toast-top-full-width";
Toastr.options.timeOut = 4000;
Toastr.options.extendedTimeOut = 10000;

// Marked configuration
Marked.setOptions({
    renderer: new Marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

Messages.load(function (success) {
    // FIXME Pog pro fiorini
    if (success || !success) {
        var culture = Messages.get("Culture");

        // Facebook API config.
        if (typeof FB == 'undefined') {
            window.fbAsyncInit = function () {
                _.defer(() => {
                    FB.init({
                        appId: Messages.get("FacebookClientId"),
                        cookie: false, // enable cookies to allow the server to access the session
                        oauth: false,
                        status: false,
                        version: 'v2.6'
                    });
                });
            };
        } else {
            _.defer(() => {
                FB.init({
                    appId: Messages.get("FacebookClientId"),
                    cookie: false, // enable cookies to allow the server to access the session
                    oauth: false,
                    status: false,
                    version: 'v2.6'
                });
            });
        }

        if (success) {
            Numeral.locale(culture);
            moment.locale(S(culture).toLowerCase());
        }

        ReactDOM.render((
	        <Router history={hashHistory}>
		        <Route path="/" component={Application}>
                    <IndexRedirect to="home" />
                    <Route path="home" component={Home} />
                    <Route path="login" component={Login} />
                    <Route path="auth-callback/:accessToken" component={Login} />
                    <Route path="confirm-email/:email/:token" component={ConfirmEmail} />
                    <Route path="confirm-email-change/:email/:token" component={ConfirmEmailChange} />
                    <Route path="recover-password" component={RecoverPassword} />
                    <Route path="reset-password/:email/:token" component={ResetPassword} />
                    <Route path="signup" component={Register} />

                    <Route path="help">
                        <IndexRoute component={MarkdownGuide} />
                    </Route>

                    <Route path="profile/:id" component={PublicProfile} />
                    <Route path="search/:term" component={Search} />

                    <Route path="user" component={UserManagement}>
                        <Route path="account" component={UserAccount} />
                        <Route path="dashboard" component={CoachingProcesses} />
                        <Route path="processes" component={ProcessDefinition} />
                        <Route path="professional-profile" component={UserProfessionalProfile} />
                        <Route path="profile" component={UserProfile} />
                        <Route path="schedule" component={UserViewSchedule} />
                        <Route path="schedule/configure" component={UserSchedule} />
                    </Route>

                    <Route path="coaching/process/:id">
                        <IndexRoute component={SessionDetails} />
                        <Route path=":session"  component={SessionDetails}>
                            <Route path="tools/wheeloflife" component={WheelOfLife} />
                        </Route>
                    </Route>
                    <Route path="coaching/hire/:id" component={HireProfessional} />

                    <Route path="admin" component={AdminPanel}>
                        <Route path="ads" component={AdminPanelAds} />
                        <Route path="emails" component={AdminPanelEmails} />
                        <Route path="users" component={AdminPanelUsers} />
                        <Route path="translate" component={AdminPanelTranslate} />
                    </Route>

                    <Route path="notifications" component={Notifications}>
                        <Route path="messages" component={NotificationsMessages} />
                        <Route path="messages/:destination" component={NotificationsMessages} />
                        <Route path="timeline" component={NotificationsTimeline} />
                    </Route>

                    <Route path="become-a-professional" component={ProfileWizard}>
                      <Route path="basic" component={ProfileWizardBasic} />
                      <Route path="address" component={ProfileWizardAddress} />
                      <Route path="education" component={ProfileWizardEducation} />
                      <Route path="career" component={ProfileWizardCareer} />
                      <Route path="services" component={ProfileWizardServices} />
                    </Route>

                    <Route path="*" component={NotFound } />
                </Route>
            </Router>
  	        ),
  	        document.getElementById('main-body')
        );

    } else {
        ReactDOM.render(<Error />, document.getElementById('main-body'));
    }
});

module.exports = true;
