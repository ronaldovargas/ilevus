var S = require("string");

var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var NotificationStore = require("ilevus/jsx/core/store/notifications/Notification.jsx");

var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");
var Messages = require("ilevus/jsx/core/util/Messages.jsx");

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

    renderNotification() {

        return <div>
                        <div className="ilv-notification ilv-notification-unread">
                            <Link to={"/notifications/timeline_detalhe/"}>
                               <div className="ilv-media ilv-media-middle">
                                   <div className="ilv-media-body">
                                       <p className="mb-0">nome usuario</p>
                                       <small>{this.getDate()}</small>
                                       <p>descricao avaliação</p>
                                   </div>                                   
                               </div>
                            </Link>
                           </div> 
    <div className="ilv-notification ilv-notification-unread">
                            <Link to={"/notifications/timeline_detalhe/"}>
                               <div className="ilv-media ilv-media-middle">
                                   <div className="ilv-media-body">
                                       <p className="mb-0">nome usuario</p>
                                       <small>{this.getDate()}</small>
                                       <p>descricao avaliação</p>
                                   </div>
                               </div>
        </Link>
    </div> 
    <div className="ilv-notification ilv-notification-unread">
                            <Link to={"/notifications/timeline_detalhe/"}>
                               <div className="ilv-media ilv-media-middle">
                                   <div className="ilv-media-body">
                                       <p className="mb-0">nome usuario</p>
                                       <small>{this.getDate()}</small>
                                       <p>descricao avaliação</p>
                                   </div>
                               </div>
        </Link>
    </div> 
    </div>

       
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
                                <Link className="ilv-nav-link" to="/user/assessments/feitas" activeClassName="active">
                                Feitas
                                </Link>
                            </li>
                    
                            <li className="ilv-nav-item">
                                <Link className="ilv-nav-link" to="/user/assessments/recebidas" activeClassName="active">
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
