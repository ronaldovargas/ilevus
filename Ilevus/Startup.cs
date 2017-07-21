﻿using System.Configuration;
using System.IO;
using System.Web.Hosting;
using System.Web.Http;
using ilevus.App_Start;
using ilevus.Models;
using Microsoft.Owin;
using Microsoft.Owin.Diagnostics;
using Owin;

[assembly: OwinStartup(typeof(ilevus.Startup))]

namespace ilevus
{
	public partial class Startup
	{
		public static string BaseURL = ConfigurationManager.AppSettings["BaseURL"];

		public void Configuration(IAppBuilder app)
		{
            AutoMapperConfig.Initialize();
            log4net.Config.XmlConfigurator.Configure(new FileInfo(HostingEnvironment.MapPath("~/Web.config")));
            IlevusIdentityContext context = IlevusIdentityContext.Create();

            IlevusDbInitializer.Initialize(context);
            IlevusDbInitializer.InitializeIdentity(context);

            ConfigureAuth(app);

            app.CreatePerOwinContext(IlevusDBContext.Create);
            IlevusDBContext db = IlevusDBContext.Create();
            db.Migrations();
            db.EnsureIndexes();
            db.EnsureSystemConfig();

            app.UseErrorPage(ErrorPageOptions.ShowAll);
            HttpConfiguration config = WebApiConfig.Create();
            app.UseWebApi(config);
		}
	}
}
