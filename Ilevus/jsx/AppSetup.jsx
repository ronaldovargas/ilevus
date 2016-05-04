/**
    Este é o arquivo que faz o setup do aplicação (frontend).
    Aqui são definidas as rotas das telas, configurações de locale,
    entre outras operações de inicialização da aplicação.
*/

var Numeral = require("numeral");
var React = require("react");
var ReactDOM = require("react-dom");
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRedirect = require('react-router').IndexRedirect;

var Application = require("ilevus/jsx/Application.jsx");
var NotFound = require("ilevus/jsx/core/view/NotFound.jsx");

var Login = require("ilevus/jsx/core/view/user/Login.jsx");
var RecoverPassword = require("ilevus/jsx/core/view/user/RecoverPassword.jsx");
var ResetPassword = require("ilevus/jsx/core/view/user/ResetPassword.jsx");

Numeral.language('pt-br', require("numeral/languages/pt-br.js"));
Numeral.language("pt-br");

ReactDOM.render((
	<Router>
		<Route path="/" component={Application}>
            <IndexRedirect to="login" />
            <Route path="login" component={Login} />

            <Route path="*" component={NotFound} />
        </Route>
    </Router>
  	),
  	document.getElementById('main-body')
);

module.exports = true;
