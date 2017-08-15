
var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var SystemStore = require("ilevus/jsx/core/store/System.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");

var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");
var Fluxbone = require("ilevus/jsx/core/store/Fluxbone.jsx");
var URL = BACKEND_URL+"User";

module.exports = React.createClass({
    url: URL,
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true
        };
    },
    componentDidMount() {
        var me = this;
        SystemStore.on("retrieve-config", (config) => {
            me.setState({
                loading: false,
                config: config
            });
        }, me);
        SystemStore.on("update-config-apis", (config) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextDataSavedSuccessfully"));
            $("button").removeAttr("disabled");
        }, me);
        SystemStore.on("fail", (msg) => {
            $("button").removeAttr("disabled");
        }, me);

        SystemStore.dispatch({
            action: SystemStore.ACTION_RETRIEVE_CONFIG
        });
    },
    componentWillUnmount() {
        SystemStore.off(null, null, this);
    },

    saveApiConfigs(event) {
        event.preventDefault();

        SystemStore.dispatch({
            action: SystemStore.ACTION_UPDATE_CONFIG_APIS,
            data: {
                MoipBaseUrl: this.refs['MoipBaseUrl'].value,
                MoipToken: this.refs['MoipToken'].value,
                MoipKey: this.refs['MoipKey'].value,
                MoipSubscriptionKey: this.refs['MoipSubscriptionKey'].value,
                MoipSubscriptionCode: this.refs['MoipSubscriptionCode'].value,
                MoipCryptoPublicKey: this.refs['MoipCryptoPublicKey'].value,
            }
        });
    },

enviarMensagem(sender) {
     var me = this;
	    $.ajax({
	        method: "POST",
	        url: me.url + "/SendEmail",
	        dataType: 'json',
	        data: {
	            assunto: this.refs['labelSubject'].value,
                mensagem: this.refs['textEmail'].value
	        },
	        success(data, status, opts) {
	            alert('e-mail enviado com sucesso');
	        },
	        error(opts, status, errorMsg) {
	            me.handleRequestErrors([], opts);
	        }
	    });
},

    render() {
        if (this.state.loading) {
            return <LoadingGauge />;
        }
        return (<div>
            

<form className="tab-content">
                        
                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="labelSubject">
                                    {Messages.get("LabelSubject")}
                                </label>
                                <input spellCheck={false}
                                       typeof="text"
                                       className="ilv-form-control"
                                       id="labelSubject"
                                       ref="labelSubject"
                                        />
                            </div>

                            <div className="ilv-form-group">
                                <label className="ilv-form-label" htmlFor="textEmail">
                                    {Messages.get("LabelMessage")}
                                </label>
                                <textarea rows={5}
                                          spellCheck={false}
                                          className="ilv-form-control"
                                          id="textEmail"
                                          ref="textEmail"
                                           />
                            </div>
                        

                       
                       
</form>

                    <button className="ilv-btn ilv-btn-primary"
                            ref="enviarEmail"
                            onClick={this.enviarMensagem.bind(this)}>
                        {Messages.get("EnviarEmail")}
                    </button>
                    





        </div>);
    }
});
