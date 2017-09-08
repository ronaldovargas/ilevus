using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Xml;

namespace ilevus
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configura o Unity para injeção de dependências.
            UnityConfig.Register(config);

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Routes.MapHttpRoute(
                name: "SEORoutes",                
                routeTemplate: "user/{userName}",
                defaults: new { controller = "SEO", action = "user" }
            );
            config.Routes.MapHttpRoute(
                name: "NonApiRoutes",
                routeTemplate: "{controller}/{action}",
                defaults: new {controller="Home", action="Index"}
            );
            config.Routes.MapHttpRoute(
                name: "termosPrivacidade",
                routeTemplate: "termos-e-privacidade",
                defaults: new {controller="TermosPrivacidade", action="Index"}
            );
        }
        public static HttpConfiguration Create()
        {
            HttpConfiguration config = new HttpConfiguration();
            Register(config);
            return config;
        }

        public static void CreateSiteMap()
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

            //TODO: CRIAR CAMPO COM DATA DE MODIFICAÇÃO
            //TODO: CRIAR CAMPO COM NOME-LINK DO USUARIO, COM UM RANDOM NO FINAL (NOME-SOBRENOME-1246)
            //TODO: BOTÃO GERAR SITEMAP AGORA
            //TODO: GERAR LOG DE GERAÇÃO/VERIFICAÇÃO SITEMAP
            //TODO: BOTÃO PARA APARAGAR LOG SITEMAP

            List<string> listaUsuarios = new List<string>();


            foreach (var array in listaUsuarios)
            {
                XmlElement MyUrl = doc.CreateElement("url");

                XmlElement Loc = doc.CreateElement("loc");
                XmlElement Freq = doc.CreateElement("changefreq");
                XmlElement Pri = doc.CreateElement("priority");

                Loc.InnerText = MyHome + "/" + array;//set value for 1. child node  Loc node
                Freq.InnerText = "daily";//set value for 1. child node-Freq node
                Pri.InnerText = "0.85";//set value for 1. child node-Pri node

                MyUrl.AppendChild(Loc); //add child Loc node to MyUrl node
                MyUrl.AppendChild(Freq);//add child Freq node to MyUrl node
                MyUrl.AppendChild(Pri);//add child Pri node to MyUrl node


                root.AppendChild(MyUrl);//add child MyUrl node to root node
            }


            Response.Clear();
            XmlSerializer xs = new XmlSerializer(typeof(XmlDocument));
            Response.ContentType = "text/xml";
            xs.Serialize(Response.Output, doc);
            Response.End();
        }
    }
}
