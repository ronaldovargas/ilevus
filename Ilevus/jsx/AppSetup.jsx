/**
    Este é o arquivo que faz o setup do aplicação (frontend).
    Aqui são definidas as rotas das telas, configurações de locale,
    entre outras operações de inicialização da aplicação.
*/

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Numeral = require("numeral");
var React = require("react");
var ReactDOM = require("react-dom");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRedirect = require('react-router').IndexRedirect;

var Application = require("ilevus/jsx/Application.jsx");
var Error = require("ilevus/jsx/core/view/Error.jsx");
var NotFound = require("ilevus/jsx/core/view/NotFound.jsx");

var Login = require("ilevus/jsx/core/view/user/Login.jsx");
var RecoverPassword = require("ilevus/jsx/core/view/user/RecoverPassword.jsx");
var Register = require("ilevus/jsx/core/view/user/Register.jsx");
var ResetPassword = require("ilevus/jsx/core/view/user/ResetPassword.jsx");

Numeral.language('pt-br', require("numeral/languages/pt-br.js"));
Numeral.language("pt-br");

Messages.load(function (success) {
    if (success) {
        ReactDOM.render((
	        <Router>
		        <Route path="/" component={Application }>
                    <IndexRedirect to="login" />
                    <Route path="login" component={Login } />
                    <Route path="signup" component={Register} />

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
