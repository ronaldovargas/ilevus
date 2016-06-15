
using ilevus.App_Start;
using ilevus.Helpers;
using ilevus.Models;
using Microsoft.AspNet.Identity.Owin;
using MongoDB.Driver;
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
            var db = Request.GetOwinContext().Get<IlevusIdentityContext>();
            var users = db.Users;
            var filter = Builders<IlevusUser>.Filter.Text(keywords);
            var projection = Builders<IlevusUser>.Projection.MetaTextScore("SearchRelevance");
            var sort = Builders<IlevusUser>.Sort.MetaTextScore("SearchRelevance");
            var opts = new FindOptions<IlevusUser>() {
                Projection = projection,
                Sort = sort
            };
            var results = (await users.FindAsync(filter, opts));
            var publicUsers = new ConcurrentBag<PublicProfileViewModel>();
            await results.ForEachAsync(user => {
                publicUsers.Add(new PublicProfileViewModel(user));
            });
            return Ok(publicUsers);
        }
    }
}