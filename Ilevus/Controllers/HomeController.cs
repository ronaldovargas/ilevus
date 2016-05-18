using System;
using System.Web;
using System.Web.Http;

namespace ilevus.Controllers
{
    /**
     * Controlador principal da aplicação.
     */
    public class HomeController : BaseAPIController
    {
        [AcceptVerbs("GET")]
        public IHttpActionResult Index()
        {
            // TODO Encontrar uma maneira melhor de servir os arquivos deste diretório.
            string uri = HttpContext.Current.Request.Url + "build/development/index.html";
            return Redirect(uri);
        }
    }
}
