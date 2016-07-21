using ilevus.Helpers;
using log4net;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.SessionState;

namespace ilevus.Controllers
{
    public class BaseAPIController : ApiController
    {
        protected readonly ILog Log;
        public string Env
        {
            get
            {
                return ConfigurationManager.AppSettings["Env"];
            }
        }
        public string BaseURL
        {
            get
            {
                return ConfigurationManager.AppSettings["BaseURL"];
            }
        }



        public BaseAPIController() : base()
        {
            this.Log = LogManager.GetLogger(this.GetType());
        }
        
    }
}