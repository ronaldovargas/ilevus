
using ilevus.App_Start;
using ilevus.Helpers;
using ilevus.Models;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ilevus.Controllers
{
    public class SearchController : BaseAPIController
    {
        public SearchController()
        {
        }
        
        // GET /api/Search
        public async Task<IHttpActionResult> Get(string keywords)
        {
            
            ConcurrentBag<PublicProfileViewModel> users = new ConcurrentBag<PublicProfileViewModel>();
            
            return Ok(users);
        }
    }
}