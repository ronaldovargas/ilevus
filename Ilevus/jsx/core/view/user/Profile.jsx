
var React = require("react");

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
            <div>
                <div className="navbar navbar-full navbar-dark bg-inverse">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <ul className="nav navbar-nav small">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Dashboard</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Caixa de Entrada</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Perfil Profissional</a>
                                    </li>
                                    <li className="nav-item active">
                                        <a className="nav-link" href="#">Perfil</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Conta</a>
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
                        <div className="col-sm-9 col-sm-offset-3">
                            <div className="card">
                                <div className="card-header">
                                    Perfil
                                </div>
                                <div className="card-block">
                                    <form className="small ">
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormFirstName">Primeiro Nome</label>
                                            <div className="col-sm-9">
                                                <input className="form-element form-element-sm" type="text" id="editProfileFormFirstName" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormLastName">Sobrenome</label>
                                            <div className="col-sm-9">
                                                <input className="form-element form-element-sm" type="text" id="editProfileFormLastName" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormGender">Gênero</label>
                                            <div className="col-sm-3">
                                                <select className="form-element form-element-sm" id="editProfileFormGender">
                                                    <option>Sexo</option>
                                                    <option>Masculino</option>
                                                    <option>Feminino</option>
                                                    <option>Outros</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormBirth">Data de Nascimento</label>
                                            <div className="col-sm-3">
                                                <select className="form-element form-element-sm" id="editProfileFormBirth">
                                                    <option>Janeiro</option>
                                                    <option>Masculino</option>
                                                    <option>Feminino</option>
                                                    <option>Outros</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-2">
                                                <select className="form-element form-element-sm">
                                                    <option>1</option>
                                                </select>
                                            </div>
                                            <div className="col-sm-2">
                                                <select className="form-element form-element-sm">
                                                    <option>1998</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormMail">Endereço de Email</label>
                                            <div className="col-sm-9">
                                                <input className="form-element form-element-sm" type="email" id="editProfileFormMail" />
                                                <span className="text-muted">Nós não compartilharemos o seu endereço de email privado com outros usuários.</span>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormPhone">Número de Telefone</label>
                                            <div className="col-sm-9">
                                                <input className="form-element form-element-sm" type="tel" id="editProfileFormPhone" />
                                                <span className="text-muted">
                                                    Seu número de telefone adiciona mais segurança à sua conta na Ilevus. Nós não iremos compartilhar essa informação com outros usuários.
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <button className="btn btn-brand">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
