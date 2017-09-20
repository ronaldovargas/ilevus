using ilevus.Models;
using MongoDB.Driver;
using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace ilevus.Controllers
{
    /**
     * Controlador principal da aplicação.
     */
    public class HomeController : BaseAPIController
    {
        [HttpGet]
        public async Task<object> Index()
        {
            //return View();
            HttpResponseMessage result;

            try
            {
                if (Request.RequestUri.Segments.Length == 2)
                {
                    IlevusUser user = null;
                    if (System.Text.RegularExpressions.Regex.IsMatch(Request.RequestUri.Segments[1], @"\A\b[0-9a-fA-F]+\b\Z"))
                        user = await UserManager.FindByIdAsync(Request.RequestUri.Segments[1]);

                    // tentativa de buscar pelo nomeUrl
                    if (user == null)
                    {
                        var db = IlevusDBContext.Create();
                        var builder = Builders<IlevusUser>.Filter;
                        var filters = builder.Eq("Professional.NomeURL", Request.RequestUri.Segments[1]);
                        var collection = db.GetUsersCollection();
                        var results = await collection.FindAsync(filters);
                        var users = await results.ToListAsync();

                        if (users.Count > 0)
                        {
                            string uri = Request.RequestUri.Scheme + "://" +
                                Request.RequestUri.Authority + "?p=" +
                                Request.RequestUri.Segments[1];

                            return Redirect(uri);
                        }
                    }
                    //var path = HttpContext.Current.Server.MapPath("~/index.html");
                    //result = new HttpResponseMessage(HttpStatusCode.OK);
                    //result.Content = new ByteArrayContent(File.ReadAllBytes(path));
                    //result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");

                }

                if (Env == "development")
                {
                    var path = HttpContext.Current.Server.MapPath("~/index.html");
                    result = new HttpResponseMessage(HttpStatusCode.OK);
                    result.Content = new ByteArrayContent(File.ReadAllBytes(path));
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");

                    //string uri = HttpContext.Current.Request.Url + "build/Debug/index.html";
                    //return Redirect(uri);
                }
                else
                {
                    var path = HttpContext.Current.Server.MapPath("~/index.html");
                    result = new HttpResponseMessage(HttpStatusCode.OK);
                    result.Content = new ByteArrayContent(File.ReadAllBytes(path));
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
                }

                return result;
            }
            catch (Exception ex)
            {
                Console.Write(ex.Message);
                throw ex;
            }
        }


    }
}
