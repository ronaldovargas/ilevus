/**
    Este componente define a estrutura geral da aplicação. Ele é renderizado pela
    rota raiz e renderiza os componentes aninhados da forma necessária.
    Ele é análogo ao _Layout.cshtml em uma aplicação ASP.NET convencional.
*/

var React = require("react");
var Router = require('react-router').Router;
var Route = require('react-router').Route;

var MainMenu = require("ilevus/jsx/core/widget/MainMenu.jsx");
var TopBar = require("ilevus/jsx/core/widget/TopBar.jsx");

module.exports = React.createClass({
    render: function () {
        return (<div className="ilevus-app-container">
		    <MainMenu />
            <main className="ilevus-app-content">
			    <TopBar />
                {this.props.children}
		    </main>
  	    </div>);
    }
});
