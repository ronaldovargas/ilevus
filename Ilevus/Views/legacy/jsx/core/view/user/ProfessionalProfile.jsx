
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    contextTypes: {
        router: PropTypes.object
    },
    getInitialState() {
        return {
            loading: UserSession.get("loading")
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("fail", (msg) => {
            $(me.refs["setpwd-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.error(msg);
        }, me);
        UserSession.on("loaded", () => {
            me.setState({
                loading: false
            });
        }, me);
        UserSession.on("updatepassword", () => {
            $(me.refs["setpwd-save"]).removeClass("loading").removeAttr("disabled");
            Toastr.success(Messages.get("TextPasswordSetSuccess"));
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },

    updatePassword(event) {
        $(this.refs["setpwd-save"]).addClass("loading").attr("disabled", "disabled");
        var data = {
            OldPassword: this.refs['setpwd-oldpassword'].value,
            NewPassword: this.refs['setpwd-password'].value,
            ConfirmPassword: this.refs['setpwd-passwordconfirm'].value
        };

        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PASSWORD,
            data: data
        });
    },

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        var user = UserSession.get("user");
        return (
            <div>
                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>
                            Experiência profissional
                        </strong>
                    </div>
                    <div className="ilv-card-body">
                        <ul className="ilv-media-list ilv-media-list-bordered">
                            <li className="ilv-media">
                                <div className="ilv-media-body">
                                    <h4>Consultor de Gestão</h4>
                                    <span className="ilv-text-large">Biboca e Parafuseta</span>
                                    <p className="ilv-text-small">Fevereiro de 2015 - Dezembro de 2015 (12 meses)</p>
                                    <p>
                                        Responsável pelo suporte em gestão na análise da cadeia de distribuição internacional de materiais
                                        de produção automobilística.
                                    </p>
                                </div>
                                <div className="ilv-media-right">
                                    <button className="ilv-btn ilv-btn-link">Editar</button>
                                </div>
                            </li>
                        </ul>

                        <div className="ilv-form-group">
                            <button className="ilv-btn ilv-btn-link">Adicionar nova experiência</button>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <form className="ilv-card">
                                    <div className="ilv-card-body">
                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newExperienceCompanyName">Nome da empresa</label>
                                            <input className="ilv-form-control" type="password" id="newExperienceCompanyName" ref="setpwd-oldpassword" />
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newExperienceRole">Cargo / Serviço</label>
                                            <input className="ilv-form-control" type="password" id="newExperienceRole" ref="setpwd-password" />
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newExperienceLocation">Localidade</label>
                                            <input className="ilv-form-control" type="password" id="newExperienceLocation" ref="setpwd-passwordconfirm" />
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <legend className="ilv-form-legend">Período</legend>
                                            <div className="row">
                                                <div className="col-xs-1">
                                                    <label className="ilv-form-label" htmlFor="newExperienceTimePeriodBegin">
                                                        De
                                                    </label>
                                                </div>
                                                <div className="col-xs-6">
                                                    <select className="ilv-form-control" id="newExperienceTimePeriodBegin">
                                                        <option>Janeiro</option>
                                                        <option>Fevereiro</option>
                                                        <option>Março</option>
                                                    </select>
                                                </div>
                                                <div className="col-xs-5">
                                                    <input className="ilv-form-control" type="number" placeholder="Ano" />
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <div className="row">
                                                <div className="col-xs-1">
                                                    <label className="ilv-form-label" htmlFor="newExperienceTimePeriodEnd">
                                                        Até
                                                    </label>
                                                </div>
                                                <div className="col-xs-6">
                                                    <select className="ilv-form-control" id="newExperienceTimePeriodEnd">
                                                        <option>Janeiro</option>
                                                        <option>Fevereiro</option>
                                                        <option>Março</option>
                                                    </select>
                                                </div>
                                                <div className="col-xs-5">
                                                    <input className="ilv-form-control" type="number" placeholder="Ano" />
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <div className="ilv-checkbox">
                                                <label htmlFor="work-here">
                                                    <input className="ilv-control-input" type="checkbox" id="work-here" />
                                                    <span className="ilv-control-indicator"></span>
                                                    <span className="ilv-control-label">Até o momento.</span>
                                                </label>
                                            </div>
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newExperienceDescription">Descrição</label>
                                            <textarea className="ilv-form-control" id="newExperienceDescription" />
                                        </fieldset>
                                        <button className="ilv-btn ilv-btn-primary">Adicionar</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="ilv-card">
                    <div className="ilv-card-header">
                        <strong>Formação acadêmica</strong>
                    </div>
                    <div className="ilv-card-body">
                        <ul className="ilv-media-list ilv-media-list-bordered">
                            <li className="ilv-media">
                                <div className="ilv-media-body">
                                    <h4>Universidade Federal de Minas Gerais</h4>
                                    <span className="ilv-text-large">Bacharel em Administração e Economia</span>
                                    <p className="ilv-text-small">2010 - 2014</p>
                                    <p>
                                        Descrição sobre atividades realizadas durante o período de graduação.
                                    </p>
                                </div>
                                <div className="ilv-media-right">
                                    <button className="ilv-btn ilv-btn-link">Editar</button>
                                </div>
                            </li>
                        </ul>

                        <div className="ilv-form-group">
                            <button className="ilv-btn ilv-btn-link">Adicionar nova formação</button>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <form className="ilv-card">
                                    <div className="ilv-card-body">
                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newFormationSchoolName">Instituição de ensino</label>
                                            <input className="ilv-form-control" type="password" id="newFormationSchoolName"/>
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newFormationArea">Área de atuação</label>
                                            <input className="ilv-form-control" type="password" id="newFormationArea"/>
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newFormationDegree">Formação</label>
                                            <select className="ilv-form-control" id="newFormationDegree">
                                                <option>Bacharel</option>
                                                <option>Mestrado</option>
                                                <option>Doutorado</option>
                                            </select>
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newFormationTimePeriod">Período</label>
                                            <div className="row">
                                                <div className="col-xs-6">
                                                    <input className="ilv-form-control" type="number" id="newFormationTimePeriod" placeholder="Ano" />
                                                </div>
                                                <div className="col-xs-6">
                                                    <input className="ilv-form-control" type="number" placeholder="Ano" />
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset className="ilv-form-group">
                                            <label className="ilv-form-label" htmlFor="newFormationDescription">Descrição</label>
                                            <textarea className="ilv-form-control" id="newFormationDescription" />
                                        </fieldset>
                                        <button className="ilv-btn ilv-btn-primary">Adicionar</button>
                                    </div>
                                </form>
                            </div>
                        </div>


                    </div>
                </div>

            </div>
        );
    }
});
