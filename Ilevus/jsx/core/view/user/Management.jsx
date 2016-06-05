
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
            <div className="bg-faded full-height">
                <div className="container p-y-3">
                    <div className="row">
                        <div className="col-xs-2">
                            <ul className="nav nav-pills nav-stacked small">
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
                        <div className="col-sm-10">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
