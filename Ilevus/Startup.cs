using ilevus.App_Start;
using ilevus.Models;
using Microsoft.Owin;
using Microsoft.Owin.Diagnostics;
using Owin;
using System.Configuration;
using System.Web.Http;
using System.Web.ModelBinding;

[assembly: OwinStartup(typeof(ilevus.Startup))]

namespace ilevus
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            IlevusDbContext context = IlevusDbContext.Create();
            //context.createIde
            IlevusDbInitializer.Initialize(context);
            IlevusDbInitializer.InitializeIdentity(context);

            ConfigureAuth(app);

            app.UseErrorPage(ErrorPageOptions.ShowAll);
            //GlobalConfiguration.Configure(WebApiConfig.Register);
            HttpConfiguration config = WebApiConfig.Create();
            app.UseWebApi(config);
            
        }
    }
}
