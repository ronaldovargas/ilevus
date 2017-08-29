var S = require("string");

var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");
var AssessmentsStore = require("ilevus/jsx/core/store/Assessments.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var ReactIntl = require('react-intl');
var moment = require('moment');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;

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
            isUser: this.props.location.pathname.indexOf('user') >= 0 ? true : false
        };
    },
    componentDidMount() {
        console.log('teste teste', this.props.location.pathname);

        var me = this;
        //if (!UserSession.get("logged") && this.props.location.pathname.indexOf('user') >= 0) {
        //    this.context.router.replace("/home");
        //}

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

        AssessmentsStore.dispatch({
            action: AssessmentsStore.ACTION_USER_ASSESSMENTS,
            data: user.Id
        });
        AssessmentsStore.dispatch({
            action: AssessmentsStore.ACTION_SEND_ASSESSMENTS,
            data: user.Id
        });
    },

    getDate() {
        return (new Date()).toString()
    },

    marcarLido(element, id) {
       
    },
    deleteNotification(element, id) {
       
    },
    alterarFiltroExibicao(event) {
        
    },
    showAllNotifications() {
        
    },
    qtdeNotifications() {
       
    },
    itensFiltrados() {
       
    },
    componentWillUnmount() {
        
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

    renderNotification() {
        var lista;
        var items = this.props.location.query.feitas == 1 ? this.state.sendedsAssessments : this.state.receivedsAssessments;
        if (!items || items.length == 0) {
            return <div className="ilv-notification ilv-notification-unread">nenhuma avaliação</div>
        }

        lista = items.map((contact, idx) => {           
            return <div className="ilv-notification ilv-notification-unread" style={{position: "relative"}}>
                            
                               <div className="ilv-media ilv-media-middle">
                                   <div className="ilv-media-body">
                                       <p className="mb-0">{contact.Titulo}</p>                                      
                                       <small>Data: {moment(contact.Data).format('DD/MM/YYYY hh:mm')}</small>
                                       <p><small>Programa: {contact.Programa}</small></p>
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
                Filtros
                <div style={{padding: "8px", border: "solid 1px #cecece"}}>
                <div className="row">
                    <div className="col col-4">
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroDataInicio">
                                            Data início
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
                                            Data final
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
                                            Programa
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editFiltroPrograma"
                                               ref="filtro-programa" />
                         </div>
                    </div>
                </div>




                <div className="row">
                    <div className="col col-4">
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroAvaliador">
                                            Avaliador
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editFiltroAvaliador"
                                               ref="filtro-avaliador" />
                         </div>
                    </div>
                    <div className="col col-4" style={{ display: this.props.location.pathname.indexOf('user') < 0 ? "none" : "block" }}>
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroAvaliado">
                                            Avaliado
                                        </label>
                                        <input className="ilv-form-control"
                                               type="text"
                                               spellCheck={false}
                                               id="editFiltroAvaliado"
                                               ref="filtro-avaliado" />
                         </div>
                    </div>
                     <div className="col col-2">
                         <div className="ilv-form-group">
                                        <label className="ilv-form-label" htmlFor="editFiltroRating">
                                            Rating
                                        </label>
                                        <div className="ilv-rating-list" style={{flexDirection: "initial"}} id="editFiltroRating">
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
                         <button className="ilv-btn ilv-btn-primary" ref="aplicar-filtro" style={{width: "100%", marginTop: "12px"}}>
                             Aplicar
                         </button>
                    </div>
                </div>

                </div>


                <ul className="ilv-nav ilv-nav-inline ilv-nav-tabs" style={{ display: this.props.location.pathname.indexOf('user') < 0 ? "none" : "block" }}>
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/assessments/?feitas=1" activeClassName="active">
                                Feitas
                                </Link>
                            </li>
                    
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/assessments/?recebidas=1" activeClassName="active">
                                Recebidas
                                </Link>
                            </li>
                                          
                </ul>

                <div className="ilv-media ilv-media-middle mb-4"  style={{paddingTop: "10px"}}>
                    <div className="ilv-media-body">
                        <h4>{Messages.get("YourAssessments")} ()</h4>
                    </div>                    
                </div>

                <div className="ilv-notification-list">
                   {this.renderNotification()}                    
                </div>
            </div>
        );
    }
});
