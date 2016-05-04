using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ilevus.Controllers
{
    /**
     * Controlador principal da aplicação.
     */
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            // TODO Encontrar uma maneira melhor de servir os arquivos deste diretório.
            return Redirect("/build/development/index.html");
        }
    }
}
