
var Backbone = require("backbone");
var Numeral = require("numeral");
var React = require("react");
var ReactDOM = require("react-dom");
var Router = require('react-router').Router;
var Route = require('react-router').Route;

var MainMenu = require("ilevus/jsx/core/widget/MainMenu.jsx");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");
var NotFound = require("ilevus/jsx/core/view/NotFound.jsx");

var Login = require("ilevus/jsx/core/view/user/Login.jsx");
var RecoverPassword = require("ilevus/jsx/core/view/user/RecoverPassword.jsx");
var ResetPassword = require("ilevus/jsx/core/view/user/ResetPassword.jsx");

Numeral.language('pt-br', require("numeral/languages/pt-br.js"));
Numeral.language("pt-br");

ReactDOM.render((
	<main className="ilevus-app-container">
		<MainMenu />
        <div className="ilevus-app-content">
			<TopBar />
            <Router>
				<Route name="login" path="/" component={Login}>
                    <Route name="login" path="login" component={Login} />
                </Route>
				<Route name="notfound" path="*" component={NotFound} />
			</Router>
		</div>
  	</main>
  	),
  	document.getElementById('main-body')
);

module.exports = true;
