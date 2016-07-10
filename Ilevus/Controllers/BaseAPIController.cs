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

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);

            string cultureName = null;
            if (User != null && User.Identity != null)
            {
                var identity = (User.Identity as ClaimsIdentity);
                Claim cult = identity.Claims.Where(claim => claim.Type == IlevusClaimTypes.UserCulture)
                    .FirstOrDefault();
                if (cult != null)
                    cultureName = cult.Value;
            } else
            {
                cultureName = Request.Headers != null && Request.Headers.AcceptLanguage != null && Request.Headers.AcceptLanguage.Count > 0 ?
                    Request.Headers.AcceptLanguage.First().Value :  // obtain it from HTTP header AcceptLanguages
                    null;
            }

            // Validate culture name
            cultureName = CultureHelper.GetImplementedCulture(cultureName); // This is safe

            // Modify current thread's cultures            
            Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(cultureName);
            Thread.CurrentThread.CurrentUICulture = Thread.CurrentThread.CurrentCulture;
            
        }
    }
}