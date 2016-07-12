/**
    Este � o arquivo que faz o setup do aplica��o (frontend).
    Aqui s�o definidas as rotas das telas, configura��es de locale,
    entre outras opera��es de inicializa��o da aplica��o.
*/

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
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
var PublicProfile = require("ilevus/jsx/core/view/user/PublicProfile.jsx");
var RecoverPassword = require("ilevus/jsx/core/view/user/RecoverPassword.jsx");
var Register = require("ilevus/jsx/core/view/user/Register.jsx");
var ResetPassword = require("ilevus/jsx/core/view/user/ResetPassword.jsx");

var ProfileWizard = require("ilevus/jsx/core/view/user/ProfileWizard.jsx");
var ProfileWizardBasic = require("ilevus/jsx/core/view/user/ProfileWizardBasic.jsx");
var ProfileWizardAddress = require("ilevus/jsx/core/view/user/ProfileWizardAddress.jsx");
var ProfileWizardCareer = require("ilevus/jsx/core/view/user/ProfileWizardCareer.jsx");
var ProfileWizardEducation = require("ilevus/jsx/core/view/user/ProfileWizardEducation.jsx");

var UserManagement = require("ilevus/jsx/core/view/user/Management.jsx");
var UserProfile = require("ilevus/jsx/core/view/user/Profile.jsx");
var UserProfessionalProfile = require("ilevus/jsx/core/view/user/ProfessionalProfile.jsx");
var UserAccount = require("ilevus/jsx/core/view/user/Account.jsx");

var MarkdownGuide = require("ilevus/jsx/core/view/help/MarkdownGuide.jsx");

// string config
S.TMPL_OPEN = '{';
S.TMPL_CLOSE = '}';

// Numeral configuration
Numeral.language('pt-BR', require("numeral/languages/pt-br.js"));
Numeral.language('es', require("numeral/languages/es.js"));
Numeral.language("pt-BR");

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
        window.fbAsyncInit = function () {
            FB.init({
                appId: Messages.get("FacebookClientId"),
                status: false, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: false,  // parse XFBML
                oauth: true,
                version: 'v2.6'
            });
        };

        if (success)
            Numeral.language(culture);

        ReactDOM.render((
	        <Router history={hashHistory}>
		        <Route path="/" component={Application}>
                    <IndexRedirect to="home" />
                    <Route path="home" component={Home} />
                    <Route path="login" component={Login} />
                    <Route path="auth-callback/:accessToken" component={Login} />
                    <Route path="confirm-email/:email/:token" component={ConfirmEmail} />
                    <Route path="recover-password" component={RecoverPassword} />
                    <Route path="reset-password/:email/:token" component={ResetPassword} />
                    <Route path="signup" component={Register} />

                    <Route path="help">
                        <IndexRoute component={MarkdownGuide} />
                    </Route>

                    <Route path="profile/:id" component={PublicProfile} />
                    <Route path="search/:term" component={Search} />

                    <Route path="user" component={UserManagement}>
                        <Route path="profile" component={UserProfile} />
                        <Route path="professional-profile" component={UserProfessionalProfile} />
                        <Route path="account" component={UserAccount} />
                    </Route>

                    <Route path="become-a-professional">
                      <IndexRoute component={ProfileWizard} />
                      
                      <Route path="basic-information" component={ProfileWizardBasic} />
                      <Route path="address" component={ProfileWizardAddress} />
                      <Route path="career" component={ProfileWizardCareer} />
                      <Route path="education" component={ProfileWizardEducation} />
                    </Route>

                    <Route path="*" component={NotFound } />
                </Route>
            </Router>
  	        ),
  	        document.getElementById('main-body')
        );

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/pt_BR/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')); var auth2 = {};
    } else {
        ReactDOM.render(<Error />, document.getElementById('main-body'));
    }
});

module.exports = true;
