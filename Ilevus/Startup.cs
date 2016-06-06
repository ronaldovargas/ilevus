﻿using ilevus.App_Start;
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
        public void Configuration(IAppBuilder app)
        {
            log4net.Config.XmlConfigurator.Configure(new FileInfo(HostingEnvironment.MapPath("~/Web.config")));
            IlevusDbContext context = IlevusDbContext.Create();
            //context.createIde
            IlevusDbInitializer.Initialize(context);
            IlevusDbInitializer.InitializeIdentity(context);

            ConfigureAuth(app);

            IlevusDBContext db = new IlevusDBContext();
            var task = db.CreateTablesIfNotExistsAsync();
            task.Wait();

            app.UseErrorPage(ErrorPageOptions.ShowAll);
            //GlobalConfiguration.Configure(WebApiConfig.Register);
            HttpConfiguration config = WebApiConfig.Create();
            app.UseWebApi(config);
            
        }
    }
}
