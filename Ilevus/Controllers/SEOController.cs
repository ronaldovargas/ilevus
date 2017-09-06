using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;

namespace ilevus.Controllers
{    
    public class SEOController : ApiController
    {
        [Route("user/{userName}")]
        [HttpGet]
        public HttpResponseMessage getUserByName(string userName) {
            var newUrl = this.Url.Link("NonApiRoutes", new
            {
                Controller = "Home",
                Action = "Index"
            });
            
            return Request.CreateResponse(HttpStatusCode.OK, new { Success = true, RedirectUrl = newUrl });
            //return userName;
        }
    }
}
