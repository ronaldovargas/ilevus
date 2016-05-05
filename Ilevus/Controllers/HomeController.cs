using System.Web.Mvc;

namespace ilevus.Controllers
{
    /**
     * Controlador principal da aplicação.
     */
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            // TODO Encontrar uma maneira melhor de servir os arquivos deste diretório.
            return Redirect("/build/development/index.html");
        }
    }
}
