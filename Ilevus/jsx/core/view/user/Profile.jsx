
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
                                        <a className="nav-link" href="#">Dashboard</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Caixa de Entrada</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#">Perfil Profissional</a>
                                    </li>
                                    <li className="nav-item active">
                                        <Link className="nav-link" to="user/profile">Perfil</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="user/account">Conta</Link>
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
                            <div className="card m-b-2">
                                <div className="card-header">
                                    Informações básicas
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
                                <div className="card-footer text-xs-right">
                                    <button className="btn btn-sm btn-brand">Salvar</button>
                                </div>
                            </div>

                            <div className="card m-b-2">
                                <div className="card-header">
                                    Meu endereço
                                </div>
                                <div className="card-block">
                                    <form className="small">
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormCountry">País</label>
                                            <div className="col-sm-3">
                                                <select className="form-element form-element-sm" id="editProfileFormCountry">
                                                    <option>Brasil</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormZipcode">CEP / Código Postal</label>
                                            <div className="col-sm-4">
                                                <input className="form-element form-element-sm" type="text" id="editProfileFormZipcode" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormAddress">Endereço</label>
                                            <div className="col-sm-9">
                                                <input className="form-element form-element-sm" type="text" id="editProfileFormAddress" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormAddressApt">Complemento</label>
                                            <div className="col-sm-4">
                                                <input className="form-element form-element-sm" type="text" id="editProfileFormAddressApt" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormCity">Cidade</label>
                                            <div className="col-sm-9">
                                                <input className="form-element form-element-sm" type="text" id="editProfileFormCity" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 form-element-label text-sm-right" htmlFor="editProfileFormState">Estado</label>
                                            <div className="col-sm-3">
                                                <select className="form-element form-element-sm" id="editProfileFormState">
                                                    <option>Minas Gerais</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="card-footer text-xs-right">
                                    <button className="btn btn-sm btn-brand">Atualizar endereço</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
