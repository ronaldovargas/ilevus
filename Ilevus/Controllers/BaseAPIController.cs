using ilevus.App_Start;
using ilevus.Helpers;
using log4net;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Configuration;
using System.Linq;
using System.Net.Http;
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
        protected IlevusUserManager _userManager;
        public IlevusUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<IlevusUserManager>();
            }
            protected set
            {
                _userManager = value;
            }
        }



        public BaseAPIController() : base()
        {
            this.Log = LogManager.GetLogger(this.GetType());
        }

        protected IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    return BadRequest(result.Errors.First());
                }
                return BadRequest();
            }

            return null;
        }

    }
}