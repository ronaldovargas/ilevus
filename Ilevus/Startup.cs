using ilevus.App_Start;
using ilevus.Models;
using Microsoft.Owin;
using Microsoft.Owin.Diagnostics;
using Owin;
using System.Configuration;
using System.IO;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.ModelBinding;

[assembly: OwinStartup(typeof(ilevus.Startup))]

namespace ilevus
{
    public partial class Startup
    {
        public static string BaseURL = ConfigurationManager.AppSettings["BaseURL"];

        public void Configuration(IAppBuilder app)
        {
            log4net.Config.XmlConfigurator.Configure(new FileInfo(HostingEnvironment.MapPath("~/Web.config")));
            IlevusIdentityContext context = IlevusIdentityContext.Create();
            //context.createIde
            IlevusDbInitializer.Initialize(context);
            IlevusDbInitializer.InitializeIdentity(context);

            ConfigureAuth(app);

            //IlevusDBContext db = IlevusDBContext.Create();

            app.UseErrorPage(ErrorPageOptions.ShowAll);
            //GlobalConfiguration.Configure(WebApiConfig.Register);
            HttpConfiguration config = WebApiConfig.Create();
            app.UseWebApi(config);
            
        }
    }
}
