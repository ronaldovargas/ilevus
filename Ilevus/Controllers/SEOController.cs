using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace ilevus.Controllers
{    
    public class SEOController : BaseAPIController
    {
        [Route("seo/{userName}")]
        [HttpGet]
        public object Index(string userName)
        {
            HttpResponseMessage result;

            if (Env == "development")
            {
                string uri = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + "/build/Debug/index.html/profile/" + userName;
                return Redirect(uri);
            }
            else
            {
                string uri = HttpContext.Current.Request.Url.Scheme + "://" + HttpContext.Current.Request.Url.Authority + "/profile/" + userName;
                return Redirect(uri);

                //var path = HttpContext.Current.Server.MapPath("~/index.html#/profile/" + userName);
                //var path = HttpContext.Current.Server.MapPath("~/#/profile/" + userName);
                //result = new HttpResponseMessage(HttpStatusCode.OK);
                //result.Content = new ByteArrayContent(File.ReadAllBytes(path));
                //result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            }

            //return result;
        }

        //[Route("{userName}")]
        //[HttpGet]
        //public HttpResponseMessage getUserByName(string userName) {
        //    var newUrl = this.Url.Link("NonApiRoutes", new
        //    {
        //        Controller = "Home",
        //        Action = "Index"
        //    });

        //    var response = Request.CreateResponse(HttpStatusCode.Moved);
        //    response.Headers.Location = new Uri(newUrl + "profile/" + userName);
        //    return response;
        //}
    }
}
