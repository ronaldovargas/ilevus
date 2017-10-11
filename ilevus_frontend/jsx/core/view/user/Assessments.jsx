var S = require("string");

var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");
var AssessmentsStore = require("ilevus/jsx/core/store/Assessments.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var moment = require('moment');
var Select = require('react-select');

var DOM = require('react-dom');
var AutoComplete = require("ilevus/lib/react-autocomplete/build/lib/index");

module.exports = React.createClass({
    
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            notifications: [],
            filtro: false,
            opcaoFiltro: "0",
            naoLidas: 0,
            avaliado: '',
            avaliador: '',
            dataIni: null,
            dataFim: null,
            programa: '',
            filtrar: false,
            filtroRating: '0',
            isUser: this.props.location.pathname.indexOf('user') >= 0 ? true : false,
            optionsRating: []
        };
    },
    componentDidMount() {        
        var me = this;

        me.setState({
            optionsRating: [
              { value: "0", label: Messages.get("LabelTodosRatings") },
              { value: "1", label: '1 ' + Messages.get("LabelEstrela") },
              { value: "2", label: '2 ' + Messages.get("LabelEstrelas") },
              { value: "3", label: '3 ' + Messages.get("LabelEstrelas") },
              { value: "4", label: '4 ' + Messages.get("LabelEstrelas") },
              { value: "5", label: '5 ' + Messages.get("LabelEstrelas") }
            ]
        });

        AssessmentsStore.on("receivedassessmentget", (receiveds) => {
            console.log('recebidas', receiveds);
            me.setState({
                receivedsAssessments: receiveds                
            });
        }, me);

        AssessmentsStore.on("sendeddassessmentget", (sendeds) => {
            console.log('enviadas', sendeds);
            me.setState({
                sendedsAssessments: sendeds
            });
        }, me);

        var user = UserSession.get("user");
        if (this.props.location.query.userId) {
            user.Id = this.props.location.query.userId;
        }

        AssessmentsStore.dispatch({
            action: AssessmentsStore.ACTION_USER_ASSESSMENTS,
            data: user.Id
        });
        AssessmentsStore.dispatch({
            action: AssessmentsStore.ACTION_SEND_ASSESSMENTS,
            data: user.Id
        });
    },

    logChange(val) {
        this.setState({
            filtroRating: val.value
        });
        console.log("Selected: " + JSON.stringify(val));
    },

    getDate() {
        return (new Date()).toString()
    },

    ratingChanged(newRating) {
        console.log(newRating)
    },

    aplicarFiltro() {
        var me = this;
        if (!me.state)
            return;

        me.setState({
            filtrar: true
        });
    },

    listaContemItem(lista, item) {
        if (!lista)
            return lista;

        try {
            var filtro = lista.filter(function(value){
                return value == item;
            })

            return filtro.length > 0;
        } catch (ex) {
            console.error(ex);
            return false;
        }
    },

    getListaProgramasFiltro() {
        var items = this.props.location.query.feitas == 1 ? this.state.sendedsAssessments : this.state.receivedsAssessments;
        if (!items)
            return [];

        var lista = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].Programa) {
                if (!this.listaContemItem(lista, items[i].Programa))
                    lista.push(items[i].Programa)
            }
        }

        return lista;
    },

    getListaUsuariosFiltro(){
        var items = this.props.location.query.feitas == 1 ? this.state.sendedsAssessments : this.state.receivedsAssessments;
        if (!items)
            return [];

        var lista = [];
        for (var i = 0; i < items.length; i++) {
            if (this.props.location.query.feitas == 1) {
                if (items[i].DadosAvaliado) {
                    if (!this.listaContemItem(lista, items[i].DadosAvaliado.Name + ' ' + items[i].DadosAvaliado.Surname))
                        lista.push(items[i].DadosAvaliado.Name + ' ' + items[i].DadosAvaliado.Surname)
                }
            } else {
                if (items[i].DadosAvaliador) {
                    if (!this.listaContemItem(lista, items[i].DadosAvaliador.Name + ' ' + items[i].DadosAvaliador.Surname))
                        lista.push(items[i].DadosAvaliador.Name + ' ' + items[i].DadosAvaliador.Surname)
                }
            }
        }

        return lista;
    },

    componentWillUnmount() {
        AssessmentsStore.off(null, null, this);
    },

    getQtdeAvaliacoesRating(rate) {
        var items = this.props.location.query.feitas == 1 ? this.state.sendedsAssessments : this.state.receivedsAssessments;
        if (!items || !rate)
            return 0;

        var qtde = 0;
        var filtro = items.filter(function (value) {
            return value.Rating == rate;
        });

        if (filtro.length == 0)
            return '0%';

        var percent = (100 * filtro.length) / items.length;
        return percent + '%';
    },

    getQtdeAvaliacoes() {        
        var items = this.props.location.query.feitas == 1 ? this.state.sendedsAssessments : this.state.receivedsAssessments;
        return items ? items.length : 0;
    },

    loadMore() {

    },

    getListaFiltrada(lista) {
        if (!lista)
            return lista;

        if (!this.state.filtrar)
            return lista;

        var me = this;
        try {
            var retorno = lista.filter(function (value) {
                var ok = true;

                var nomeAvaliado = null;
                var nomeAvaliador = null;

                if (value.DadosAvaliado)
                    nomeAvaliado = value.DadosAvaliado.Name + ' ' + value.DadosAvaliado.Surname;
                if (value.DadosAvaliador)
                    nomeAvaliador = value.DadosAvaliado.Name + ' ' + value.DadosAvaliado.Surname;

                if (me.state.avaliado && nomeAvaliado && nomeAvaliado.indexOf(me.state.avaliado) < 0)
                    ok = false;

                if (me.state.avaliador && nomeAvaliador && nomeAvaliador.indexOf(me.state.avaliador) < 0)
                    ok = false;

                if (me.state.programa && value.Programa.indexOf(me.state.programa) < 0)
                    ok = false;

                if (me.state.filtroRating && me.state.filtroRating != '0' && me.state.filtroRating != value.Rating)
                    ok = false;

                var dataAval = new Date(new Date(value.Data).toDateString());

                if (me.refs['filtro-data-inicio'].value) {
                    var ini = new Date(new Date(me.refs['filtro-data-inicio'].value).toDateString());
                    ini.setDate(ini.getDate() + 1);
                    if (ini.getTime() > dataAval.getTime())
                        ok = false;
                }

                if (me.refs['filtro-data-final'].value) {
                    var fim =  new Date(new Date(me.refs['filtro-data-final'].value).toDateString());
                    fim.setDate(fim.getDate() + 1);
                    if (fim.getTime() < dataAval.getTime())
                        ok = false;
                }


                return ok;
            });

            return retorno;
        } catch (ex) {
            console.error(ex);
            return lista;
        }
    },

    renderStars(qtde) {
        var tmp = [];
        for (var i = 0; i < qtde; i++) {
            tmp.push(i);
        }

        var stars = tmp.map(function (i) {
            return (<i className="ilv-rating-item-no-hover material-icons">&#xE838;</i>);
        });

        return (
                <div className="ilv-rating" style={{ position: "absolute", right: "20px", top: "15px"}}>
                    <div className="ilv-rating-list">
                        {stars}
                    </div>
                </div>
        )        
    },
    
    renderUsuario(avaliacao) {
        if (this.props.location.query.feitas == 1) {
            if (avaliacao.DadosAvaliado)
                return (
                    <div><small>Avaliado: <Link to={"/profile/"+avaliacao.DadosAvaliado.Id}><strong>{avaliacao.DadosAvaliado.Name} {avaliacao.DadosAvaliado.Surname}</strong></Link></small></div>
                )
            else
                return <span></span>
        } else {
            if (avaliacao.DadosAvaliador)
                return (                    
                    <div><small>{Messages.get("LabelAvaliador")}: <Link to={"/profile/"+avaliacao.DadosAvaliador.Id}><strong>{avaliacao.DadosAvaliador.Name} {avaliacao.DadosAvaliador.Surname}</strong></Link></small></div>
                )
            else
                return <span></span>
        }
    },

    renderNotification() {
        var lista;
        var items = this.getListaFiltrada(this.props.location.query.feitas == 1 ? this.state.sendedsAssessments : this.state.receivedsAssessments);
        if (!items || items.length == 0) {
            return <div className="ilv-notification ilv-notification-unread">{Messages.get("LabelNenhumaAvaliacao")}</div>
        }

        lista = items.map((contact, idx) => {           
            return <div className="ilv-notification ilv-notification-unread" style={{position: "relative"}}>
                            
                               <div className="ilv-media ilv-media-middle">
                                   <div className="ilv-media-body">
                                       <p className="mb-0">{contact.Titulo}</p>                                      
                                       <small>{Messages.get("LabelData")}: {moment(contact.Data).format('DD/MM/YYYY hh:mm')}</small>
                                       <div><small>{Messages.get("LabelService")}: {contact.Programa}</small></div>
                                       {this.renderUsuario(contact)}                                       
                                       <p>{contact.Descricao}</p>
                                       {this.renderStars(contact.Rating)}
                                   </div>
                               </div>
                        
                    </div> 
        })
        return <div>{lista}</div>
    },

    render() {

        return (
            <div style={{ paddingTop: "10px", padding: this.props.location.pathname.indexOf('user') < 0 ? "30px" : "0px"}}>                                
                <span style={{ display: this.props.location.pathname.indexOf('user') < 0 ? "none" : "block" }}>{Messages.get("LabelFiltros")}</span>
                <div style={{ padding: "8px", border: "solid 1px #cecece", display: this.props.location.pathname.indexOf('user') < 0 ? "none" : "block" }}>
                <div className="row">
                    <div className="col col-4">
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroDataInicio">
                                            {Messages.get("LabelDataInicio")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="date"
                                               spellCheck={false}
                                               id="editFiltroDataInicio"
                                               ref="filtro-data-inicio" />
                         </div>
                    </div>
                    <div className="col col-4">
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroDataFim">
                                            {Messages.get("LabelDataFinal")}
                                        </label>
                                        <input className="ilv-form-control"
                                               type="date"
                                               spellCheck={false}
                                               id="editFiltroDataFim"
                                               ref="filtro-data-final" />
                         </div>
                    </div>
                     <div className="col col-4">
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroPrograma">
                                            {Messages.get("LabelService")}
                                        </label>
                                        <AutoComplete getItemValue={(item) => item} className="ilv-form-control"
                                          items={this.getListaProgramasFiltro()}
                                          renderItem={
                                            (item, isHighlighted) =>
                                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>{item}</div>
                                          }
                                          value={this.state.programa}
                                          onChange={
                                                (e) =>
                                                    this.setState({
                                                        programa: e.target.value
                                                    })                                                    
                                            }
                                          onSelect={
                                            (val) =>
                                                this.setState({
                                                    programa: val
                                                })
                                            }
                             />
                         </div>
                    </div>
                </div>




                <div className="row">
                    <div className="col col-4" style={{ display: this.props.location.query.feitas == 1 ? "none" : "block"}}>
                         <div className="ilv-form-group">
                            <label className="ilv-form-label" htmlFor="editFiltroAvaliador">
                                {Messages.get("LabelAvaliador")}
                            </label>
                            <AutoComplete getItemValue={(item) => item} className="ilv-form-control"
                                          items={this.getListaUsuariosFiltro()}
                                          renderItem={
                                            (item, isHighlighted) =>
                                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>{item}</div>
                                          }
                                          value={this.state.avaliador}
                                          onChange={
                                                (e) =>
                                                    this.setState({
                                                        avaliador: e.target.value,
                                                        avaliado: ''
                                                    })                                                    
                                            }
                                          onSelect={
                                            (val) =>
                                                this.setState({
                                                    avaliador: val,
                                                    avaliado: ''
                                                })
                                            }
                             />
                        </div>
                    </div>
                    <div className="col col-3" style={{ display: this.props.location.query.feitas == 1 ? "block" : "none"}}>
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroAvaliado">
                                            {Messages.get("LabelAvaliado")}
                                        </label>
                                        <AutoComplete getItemValue={(item) => item} className="ilv-form-control"
                                          items={this.getListaUsuariosFiltro()}
                                          renderItem={
                                            (item, isHighlighted) =>
                                                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>{item}</div>
                                          }
                                          value={this.state.avaliado}
                                          onChange={
                                                (e) =>
                                                    this.setState({
                                                        avaliado: e.target.value,
                                                        avaliador: ''
                                                    })                                                    
                                            }
                                          onSelect={
                                            (val) =>
                                                this.setState({
                                                    avaliado: val,
                                                    avaliador: ''
                                                })
                                            }
                             />
                         </div>
                    </div>
                     <div className="col col-3">
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroRating">
                                            {Messages.get("LabelRating")}
                                        </label>
                                        
                                        <Select name="form-field-name"
                                            value={this.state.filtroRating}
                                            options={this.state.optionsRating}
                                            onChange={this.logChange} />

                                        <div className="ilv-rating-list" style={{flexDirection: "initial", display: "none"}} id="editFiltroRating">
                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                                <i className="ilv-rating-item material-icons">&#xE838;</i>
                                        </div>    
                                        <input className="ilv-form-control"
                                               type="number"
                                               min="0"
                                               style={{display: "none"}}
                                               max="6"
                                               spellCheck={false}
                                               id="editFiltroRating2"
                                               ref="filtro-rating" />
                         </div>
                     </div>
                    <div className="col col-2 center-end">
                         <button onClick={()=>this.aplicarFiltro()} className="ilv-btn ilv-btn-primary" ref="aplicar-filtro" style={{ width: "100%", marginTop: "12px" }}>
                             {Messages.get("LabelAplicar")}
                         </button>
                    </div>
                </div>

                </div>


                <ul className="ilv-nav ilv-nav-inline ilv-nav-tabs" style={{ display: this.props.location.pathname.indexOf('user') < 0 ? "none" : "block" }}>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/assessments/?feitas=1" activeClassName="active">
                                {Messages.get("LabelFeitas")}
                                </Link>
                            </li>
                    
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/assessments/?recebidas=1" activeClassName="active">
                                {Messages.get("LabelRecebidas")}
                                </Link>
                            </li>

                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/assessments/?recebidas=0" activeClassName="active">
                                {Messages.get("LabelPendentes")}
                                </Link>
                            </li>
                                          
                </ul>

                <div className="ilv-media ilv-media-middle mb-4"  style={{paddingTop: "10px"}}>
                    <div className="ilv-media-body">
                        <h4>{Messages.get(this.state.isUser ? "YourAssessments" : "LabelAssessments")} ({this.getQtdeAvaliacoes()})</h4>                        
                        <div>
                            <small>
                                1 {Messages.get("LabelEstrela")}: {this.getQtdeAvaliacoesRating(1)} | 
                                2 {Messages.get("LabelEstrelas")}: {this.getQtdeAvaliacoesRating(2)} | 
                                3 {Messages.get("LabelEstrelas")}: {this.getQtdeAvaliacoesRating(3)} | 
                                4 {Messages.get("LabelEstrelas")}: {this.getQtdeAvaliacoesRating(4)} | 
                                5 {Messages.get("LabelEstrelas")}: {this.getQtdeAvaliacoesRating(5)}
                            </small>
                        </div>                        
                    </div>                    
                </div>

                <div className="ilv-notification-list">
                   {this.renderNotification()}                    
                   <div className="text-center py-3">
                        <a style={{ cursor: "pointer" }} onClick={this.loadMore }>{Messages.get("LoadMoreAssessments")}</a>
                   </div>

                </div>
            </div>
        );
    }
});
