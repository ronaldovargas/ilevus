/**
    Este � o arquivo que faz o setup do aplica��o (frontend).
    Aqui s�o definidas as rotas das telas, configura��es de locale,
    entre outras opera��es de inicializa��o da aplica��o.
*/

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Numeral = require("numeral");
var Toastr = require("toastr");
var S = require("string");

var React = require("react");
var ReactDOM = require("react-dom");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRedirect = require('react-router').IndexRedirect;
var IndexRoute = require('react-router').IndexRoute;
var hashHistory = require('react-router').hashHistory;

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

var UserManagement = require("ilevus/jsx/core/view/user/Management.jsx");
var UserProfile = require("ilevus/jsx/core/view/user/Profile.jsx");
var UserProfessionalProfile = require("ilevus/jsx/core/view/user/ProfessionalProfile.jsx");
var UserAccount = require("ilevus/jsx/core/view/user/Account.jsx");

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

Messages.load(function (success) {
    if (success) {
        Numeral.language(Messages.get("Culture"));
        ReactDOM.render((
	        <Router history={hashHistory}>
		        <Route path="/" component={Application}>
                    <IndexRedirect to="home" />
                    <Route path="home" component={Home} />
                    <Route path="login" component={Login} />
                    <Route path="confirm-email/:email/:token" component={ConfirmEmail} />
                    <Route path="recover-password" component={RecoverPassword} />
                    <Route path="reset-password/:email/:token" component={ResetPassword} />
                    <Route path="signup" component={Register} />

                    <Route path="profile/:id" component={PublicProfile} />
                    <Route path="search/:term" component={Search} />

                    <Route path="user" component={UserManagement}>
                        <Route path="profile" component={UserProfile} />
                        <Route path="professionalprofile" component={UserProfessionalProfile} />
                        <Route path="account" component={UserAccount} />
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
