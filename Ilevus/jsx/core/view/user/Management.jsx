
var React = require("react");
var Link = require("react-router").Link;

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    onSearch(evt) {
        evt.preventDefault();
        var term = this.refs['search-term'].value;
        if (!string(term).isEmpty())
            this.context.router.push("/search/" + encodeURI(term));
    },
    render() {
        return (
            <div className="bg-faded">
                <div className="navbar navbar-full navbar-dark bg-inverse">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <ul className="nav navbar-nav small">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/user/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Caixa de Entrada</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Perfil Profissional</a>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/user/profile">Perfil</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/user/account">Conta</Link>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Empresa</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container p-y-3">
                    <div className="row">
                        <div className="col-sm-3">
                            Possível menu
                        </div>
                        <div className="col-sm-9">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
