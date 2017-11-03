var React = require("react");
var S = require("string");
var Toastr = require("toastr");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = createClass({
    propTypes: {
        bankAccount: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired
    },
    getDefaultProps() {
        return {bankAccount: {}};
    },
    onSubmit(event) {
        event.preventDefault();
        var data = {
            BankNumber: S(this.refs['field-bankNumber'].value).escapeHTML().s,
            AgencyNumber: S(this.refs['field-agencyNumber'].value).escapeHTML().s,
            AgencyCheckNumber: S(this.refs['field-agencyCheckNumber'].value).escapeHTML().s,
            AccountNumber: S(this.refs['field-accountNumber'].value).escapeHTML().s,
            AccountCheckNumber: S(this.refs['field-accountCheckNumber'].value).escapeHTML().s
        };
        console.log(data);
        debugger;
        this.props.onSubmit(data);
    },
    finishedChange() {
        this.setState({finished: this.refs['field-finished'].checked});
    },

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <fieldset className="ilv-form-group">
                    <label className="ilv-form-label">Banco</label>
                    <select id="bank_number" 
                            ref="field-bank_number"
                            className="ilv-form-control"
                            defaultValue={this.props.bankAccount.bank_number}>
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
                        ref="field-agency_number"
                        placeholder="Exemplo: 0170"
                        defaultValue={this.props.bankAccount.agency_number}
                        type="text"
                        class="ilv-form-control"/>

                    <label className="ilv-form-label">Dígito</label>
                    <input
                        id="agency_check_number"
                        placeholder="Exemplo: 8"
                        defaultValue={this.props.bankAccount.agency_check_number}                        
                        ref="field-agency_check_number"                        
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
                                defaultValue={this.props.bankAccount.account_number}   
                                ref="field-account_number"                        
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
                                defaultValue={this.props.bankAccount.account_check_number}                                
                                ref="field-account_check_number"                        
                                />
                        </div>
                    </div>
                </fieldset>
            </form>
        );
    }
});
