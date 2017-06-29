var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");
var S = require("string");

var LanguageSelect = require("ilevus/jsx/core/widget/LanguageSelect.jsx");
var BankAccountForm = require("ilevus/jsx/core/widget/user/BankAccountForm.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object,
        professionalData: React.PropTypes.object.isRequired,
        userId: React.PropTypes.string.isRequired
    },
    getInitialState() {
        return {
            bankAccount: this.context.professionalData.BankAccount || []
        };
    },
    componentDidMount() {
        var me = this;
        UserSession.on("professionalprofile", (data) => {
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            me
                .context
                .router
                .push("/become-a-professional");
        }, me);
    },
    componentWillUnmount() {
        UserSession.off(null, null, this);
    },
    saveInfo() {
         event.preventDefault();
        var data = {
            BankNumber: S(this.refs['field-bankNumber'].value).escapeHTML().s,
            AgencyNumber: S(this.refs['field-agencyNumber'].value).escapeHTML().s,
            AgencyCheckNumber: S(this.refs['field-agencyCheckNumber'].value).escapeHTML().s,
            AccountNumber: S(this.refs['field-accountNumber'].value).escapeHTML().s,
            AccountCheckNumber: S(this.refs['field-accountCheckNumber'].value).escapeHTML().s
        };
        $(this.refs['btn-submit']).attr("disabled", true);
        UserSession.dispatch({
            action: UserSession.ACTION_UPDATE_PROFESSIONAL_EDUCATION,
            data: data
        });
        console.log(data);
    },

    render() {
    return (<div className="container">
		<div className="row justify-content-center">
			<div className="col-6">
                <div className="text-center my-5">
						<h3>{Messages.get("TextWizardHeaderAddress")}</h3>
                </div>
				<div className="ilv-card">
					<div className="ilv-card-body">
						  <form onSubmit={this.onSubmit}>
                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label">Banco</label>
                    <select id="bank_number" 
                            ref="field-bankNumber"
                            className="ilv-form-control"
                            defaultValue={this.state.bankAccount.BankNumber}>
                        <option value="">Selecione o banco</option>
                        <optgroup label="Principais bancos">
                            <option value="001">BANCO DO BRASIL S.A.</option>
                            <option value="237">BANCO BRADESCO S.A.</option>
                            <option value="341">BANCO ITAÚ S.A.</option>
                            <option value="104">CAIXA ECONOMICA FEDERAL</option>
                            <option value="033">BANCO SANTANDER BANESPA S.A.</option>
                            <option value="399">HSBC BANK BRASIL S.A.</option>
                            <option value="745">BANCO CITIBANK S.A.</option>
                        </optgroup>
                        <optgroup label="Outros bancos">
                            <option value="356">BANCO ABN AMRO REAL S.A.</option>
                            <option value="409">UNIBANCO-UNIAO DE BANCOS BRASILEIROS S.A.</option>
                            <option value="041">BANCO DO ESTADO DO RIO GRANDE DO SUL S.A.</option>
                            <option value="027">BANCO DO ESTADO DE SANTA CATARINA S.A.</option>
                            <option value="389">BANCO MERCANTIL DO BRASIL S.A.</option>
                            <option value="004">BANCO DO NORDESTE DO BRASIL S.A.</option>
                            <option value="021">BANCO DO ESTADO DO ESPIRITO SANTO S.A.</option>
                            <option value="422">BANCO SAFRA S.A.</option>
                            <option value="003">BANCO DA AMAZONIA S.A.</option>
                            <option value="047">BANCO DO ESTADO DE SERGIPE S.A.</option>
                            <option value="070">BRB - BANCO DE BRASILIA S.A.</option>
                            <option value="655">BANCO VOTORANTIM S.A.</option>
                            <option value="208">BANCO UBS PACTUAL S.A.</option>
                            <option value="107">BANCO BBM S/A</option>
                            <option value="025">BANCO ALFA S.A.</option>
                            <option value="263">BANCO CACIQUE S.A.</option>
                            <option value="229">BANCO CRUZEIRO DO SUL S.A.</option>
                            <option value="252">BANCO FININVEST S.A.</option>
                            <option value="063">BANCO IBI S.A. - BANCO MÚLTIPLO</option>
                            <option value="479">BANCO ITAUBANK S.A.</option>
                            <option value="623">BANCO PANAMERICANO S.A.</option>
                            <option value="633">BANCO RENDIMENTO S.A.</option>
                            <option value="749">BANCO SIMPLES S.A.</option>
                            <option value="215">BANCO COMERCIAL E DE INVESTIMENTO SUDAMERIS S.A.</option>
                            <option value="756">BANCO COOPERATIVO DO BRASIL S.A. - BANCOOB</option>
                            <option value="748">BANCO COOPERATIVO SICREDI S.A.</option>
                            <option value="065">BANCO LEMON S.A.</option>
                            <option value="069">BPN BRASIL BANCO MÚLTIPLO S.A.</option>
                            <option value="719">BANCO INTERNACIONAL DO FUNCHAL (BRASIL) S.A.</option>
                            <option value="318">BANCO BMG S A</option>
                        </optgroup>
                    </select>
                </fieldset>
                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label">Agência</label>
                    <input
                        id="agency_number"
                        ref="field-agencyNumber"
                        placeholder="Exemplo: 0170"
                        defaultValue={this.state.bankAccount.AgencyNumber}
                        type="text"
                        class="ilv-form-control"/>

                    <label className="ilv-form-label">Dígito</label>
                    <input
                        id="agency_check_number"
                        placeholder="Exemplo: 8"
                        defaultValue={this.state.bankAccount.AgencyCheckNumber}                        
                        ref="field-agencyCheckNumber"                        
                        type="text"
                        class="ilv-form-control"/>
                </fieldset>

                <fieldset className="ilv-form-group">
                    <div className="row">
                        <label className="ilv-form-label">Conta corrente</label>
                        <div className="col-xs-6">
                            <input
                                className="ilv-form-control"
                                type="number"
                                spellCheck={false}
                                id="account_number"
                                placeholder="Exemplo: 97845"
                                defaultValue={this.state.bankAccount.AccountNumber}   
                                ref="field-accountNumber"                        
                                />
                        </div>
                        <div class="col-xs-6">
                            <label className="ilv-form-label">Dígito</label>
                            <input
                                className="ilv-form-control"
                                type="number"
                                spellCheck={false}
                                id="account_check_number"
                                placeholder="Exemplo: 1"
                                defaultValue={this.state.bankAccount.AccountCheckNumber}                                
                                ref="field-accountCheckNumber"                        
                                />
                        </div>
                    </div>
                </fieldset>
            </form>
					</div>

                    <div className="ilv-card-footer ilv-text-xs-right">
                        <Link className="ilv-btn ilv-btn-clean" to="/become-a-professional">
                            {Messages.get("LabelBack")}
                        </Link>
                        <button className="ilv-btn ilv-btn-primary" ref="btn-submit" onClick={this.saveInfo}>
                            {Messages.get("LabelSave")}
                        </button>
                    </div>
				</div>
			</div>
		</div>
	</div>);
    }
});
