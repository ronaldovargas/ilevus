var React = require("react");
var Link = require("react-router").Link;
var Toastr = require("toastr");

var SitemapLogStore = require("ilevus/jsx/core/store/SitemapLog.jsx");
var UserSession = require("ilevus/jsx/core/store/UserSession.jsx");
var moment = require('moment');
var LoadingGauge = require("ilevus/jsx/core/widget/LoadingGauge.jsx");

var Messages = require("ilevus/jsx/core/util/Messages.jsx");

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState() {
        return {
            loading: true,
            data: []
        };
    },
    componentDidMount() {
        var me = this;
        SitemapLogStore.on("sitemaplogget", (data) => {
            me.setState({
                loading: false,
                data: data.Result
            });
        }, me);
        SitemapLogStore.on("sitemapdelete", (qtde) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextSitemapDeleteOK"));

            SitemapLogStore.dispatch({
                action: SitemapLogStore.ACTION_SITEMAP_GET
            });
        }, me);
        SitemapLogStore.on("sitemapgenerateget", (res) => {
            Toastr.remove();
            Toastr.success(Messages.get("TextSitemapGereratedOK"));

            SitemapLogStore.dispatch({
                action: SitemapLogStore.ACTION_SITEMAP_GET
            });
        }, me);

        SitemapLogStore.dispatch({
            action: SitemapLogStore.ACTION_SITEMAP_GET
        });
    },
    componentWillUnmount() {
        SitemapLogStore.off(null, null, this);
    },

    deleteAll() {
        SitemapLogStore.dispatch({
            action: SitemapLogStore.ACTION_SITEMAP_DEL
        });    
    },

    generateNow() {
        SitemapLogStore.dispatch({
            action: SitemapLogStore.ACTION_SITEMAP_GENERATE
        });
    },

    renderLog() {
        var items;
        if (!this.state.data || this.state.data.length == 0) {
            return <div className="ilv-notification ilv-notification-unread">{Messages.get("LabelNenhumLogSitemap")}</div>
        }

        items = this.state.data.map((contact, idx) => {
            return <div>
                        {Messages.get("LabelDataGeracao")}: {moment(contact.DataGeracao).format('DD/MM/YYYY hh:mm')}<br/>
                        {Messages.get("LabelUsuariosVerificados")}: {contact.UsuariosVerificados}<br />
                        {Messages.get("LabelUsuariosAdicionados")}: {contact.UsuariosIncluidosArquivos}
                        <hr />
                   </div>
        });
        return <div>{items}</div>
    },
   
    render() {
        return <div>
            <div><a style={{cursor: "pointer" }} onClick={this.generateNow}>{Messages.get("LabelGerarAgora")}</a></div>
            <div><a style={{cursor: "pointer" }} onClick={this.deleteAll}>{Messages.get("LabelExcluirTodos")}</a></div>
            <br/>
            {this.renderLog()}
           </div>
        }
        //if (this.state.loading) {
        //    return <LoadingGauge />;
        //}       

    //    return (<div>
    //                <div><a style={{cursor: "pointer" }} onClick={this.generateNow}>{Messages.get("LabelGerarAgora")}</a></div>
    //                <div><a style={{cursor: "pointer" }} onClick={this.deleteAll}>{Messages.get("LabelExcluirTodos")}</a></div>
    //                <br>
    //                {this.renderLog()}
    //            </div>);
    //}
});
