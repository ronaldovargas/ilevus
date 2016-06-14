using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace ilevus.Controllers
{
    /**
     * Controlador principal da aplicação.
     */
    public class HomeController : BaseAPIController
    {
        public string Env
        {
            get
            {
                return ConfigurationManager.AppSettings["Env"];
            }
        }

        [HttpGet]
        public object Index()
        {
            HttpResponseMessage result;

            if (Env == "development")
            {
                string uri = HttpContext.Current.Request.Url + "build/Debug/index.html";
                return Redirect(uri);
            } else
            {
                var path = HttpContext.Current.Server.MapPath("~/index.html");
                result = new HttpResponseMessage(HttpStatusCode.OK);
                result.Content = new ByteArrayContent(File.ReadAllBytes(path));
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            }
            
            return result;
        }
        
    }
}
