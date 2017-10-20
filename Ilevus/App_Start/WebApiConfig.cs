using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Xml;
using ilevus.Models;
using MongoDB.Driver;
using ilevus.Enums;
using System.Threading.Tasks;
using System.IO;
using ilevus.App_Start;
using System.Web.Routing;
using System.Web.Mvc;
using System.Web.Http.Cors;

namespace ilevus
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configura o Unity para injeção de dependências.
            UnityConfig.Register(config);
			//config.EnableCors();
			//var cors = new EnableCorsAttribute("*", "*", "*");
			//config.EnableCors(cors);

			// Web API routes
			config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
        public static HttpConfiguration Create()
        {
            HttpConfiguration config = new HttpConfiguration();
            Register(config);
            execAction();
            return config;
        }

        public static async void execAction()
        {
            int timeoutInMilliseconds = (int) new TimeSpan(1, 0, 0, 0).TotalMilliseconds;

            var path = AppDomain.CurrentDomain.BaseDirectory + "sitemap.xml";
            if (!File.Exists(path))
                timeoutInMilliseconds = 10;
                        
            await Task.Delay(timeoutInMilliseconds);
            await CreateSiteMap();
            execAction();
        }

        public static async Task<bool> CreateSiteMap()
        {
            try
            {
                string homeUrl = @"http://www.ilevus.com";
                XmlDocument doc = new XmlDocument();
                XmlDeclaration dec = doc.CreateXmlDeclaration("1.0", null, null);
                doc.AppendChild(dec);

                XmlElement root = doc.CreateElement("urlset");
                root.SetAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
                root.SetAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
                root.SetAttribute("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");
                doc.AppendChild(root);

                var db = IlevusDBContext.Create();
                var builder = Builders<IlevusUser>.Filter;
                var filters = builder.Eq("Status", UserStatus.Active);
                var collection = db.GetUsersCollection();
                var results = await collection.FindAsync(filters);
                var listaUsuarios = await results.ToListAsync();

                int incluidos = 0;

                foreach (var array in listaUsuarios)
                {
                    if (array.Professional == null || string.IsNullOrEmpty(array.Professional.NomeURL))
                        continue;

                    incluidos++;

                    XmlElement MyUrl = doc.CreateElement("url");

                    XmlElement Loc = doc.CreateElement("loc");
                    XmlElement Freq = doc.CreateElement("changefreq");
                    XmlElement Pri = doc.CreateElement("priority");
                    XmlElement Mod = doc.CreateElement("lastmod");

                    Loc.InnerText = homeUrl + "/" + array.Professional.NomeURL;
                    Freq.InnerText = "daily";
                    Pri.InnerText = "1.0";
                    Mod.InnerText = array.Modification.ToString("yyyy-MM-dd");

                    MyUrl.AppendChild(Loc);
                    MyUrl.AppendChild(Freq);
                    MyUrl.AppendChild(Pri);
                    MyUrl.AppendChild(Mod);

                    root.AppendChild(MyUrl);
                }

                doc.Save(AppDomain.CurrentDomain.BaseDirectory + "sitemap.xml");

                var log = new SiteMapLogModel()
                {
                    DataGeracao = DateTime.Now,
                    UsuariosIncluidosArquivos = incluidos,
                    UsuariosVerificados = listaUsuarios.Count
                };

                var colLog = IlevusDBContext.Create().GetSiteMapLogCollection();
                await colLog.InsertOneAsync(log);

                return true;
            } catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
