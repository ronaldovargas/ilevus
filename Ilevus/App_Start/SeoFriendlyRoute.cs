using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http.Routing;
using System.Web.Mvc;
using System.Web.Routing;

namespace ilevus.App_Start
{
    public class SeoFriendlyRoute: IHttpRoute
    {
        private MvcRouteHandler mvcRouteHandler;
        private RouteValueDictionary routeValueDictionary;
        private string v;

        public SeoFriendlyRoute(string v, RouteValueDictionary routeValueDictionary, MvcRouteHandler mvcRouteHandler)
        {
            this.v = v;
            this.routeValueDictionary = routeValueDictionary;
            this.mvcRouteHandler = mvcRouteHandler;
        }

        //public SeoFriendlyRoute(string url, RouteValueDictionary defaults, IRouteHandler routeHandler) : this(url, defaults, routeHandler)
        //{
        //}


        public IDictionary<string, object> Constraints
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public IDictionary<string, object> DataTokens
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public IDictionary<string, object> Defaults
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public HttpMessageHandler Handler
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public string RouteTemplate
        {
            get
            {
                throw new NotImplementedException();
            }
        }
       
        public IHttpRouteData GetRouteData(string virtualPathRoot, HttpRequestMessage request)
        {
            var routeData = request.GetRouteData();

            if (routeData != null)
            {
                if (routeData.Values.ContainsKey("id"))
                    routeData.Values["id"] = GetIdValue(routeData.Values["id"]);
            }

            return routeData;
        }

        public IHttpVirtualPathData GetVirtualPath(HttpRequestMessage request, IDictionary<string, object> values)
        {
            throw new NotImplementedException();
        }

        private object GetIdValue(object id)
        {
            if (id != null)
            {
                string idValue = id.ToString();

                var regex = new Regex(@"^(?<id>\d+).*$");
                var match = regex.Match(idValue);

                if (match.Success)
                {
                    return match.Groups["id"].Value;
                }
            }

            return id;
        }
    }
}