
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

        private async Task<List<AssessmentModel>> getAssessments(string id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AssessmentModel>.Filter;
            var collection = db.GeAssessmentsCollection();

            var collectionUser = db.GetUsersCollection();
            var filtersUsers = Builders<IlevusUser>.Filter;

            try
            {
                var result = await collection.FindAsync(filters.Eq("Avaliado", id));
                var avaliacoes = await result.ToListAsync();

                if (avaliacoes == null)
                {
                    return new List<AssessmentModel>();
                }

                avaliacoes = AssessmentController.calculaMedia(avaliacoes);
                return avaliacoes;
            }
            catch (Exception e)
            {
                return new List<AssessmentModel>();
            }
        }

        // GET /api/Search
        public async Task<IHttpActionResult> Get(string keywords, int start = 0, int limit = 20)
        {
            var db = Request.GetOwinContext().Get<IlevusIdentityContext>();
            var users = db.Users;            
            var filter = GetSearchFilter(keywords);
            var opts = GetFindOptions(start, limit);
            var results = await users.FindAsync(filter, opts);
            var total = await users.CountAsync(filter);
            var publicUsers = new ConcurrentBag<PublicProfileViewModel>();
            AssessmentController ctrl = new AssessmentController();
            await results.ForEachAsync(async user =>
            {
                var lista = await getAssessments(user.Id);
                publicUsers.Add(new PublicProfileViewModel(user, lista.Count, lista.Count > 0 ? (lista[0].MediaRating.HasValue ? lista[0].MediaRating.Value : 0) : 0));
            });
            var resp = new Dictionary<string, object>();
            resp["data"] = publicUsers;
            resp["total"] = total;
            resp["success"] = true;
            return Ok(resp);
        }

        private FilterDefinition<IlevusUser> GetSearchFilter(string keywords)
        {
            return Builders<IlevusUser>.Filter.And(
                Builders<IlevusUser>.Filter.Eq("IsProfessional", true),
                Builders<IlevusUser>.Filter.Text(keywords)
            );
        }
        private FindOptions<IlevusUser> GetFindOptions(int start, int limit)
        {
            return new FindOptions<IlevusUser>()
            {
                Projection = Builders<IlevusUser>.Projection.MetaTextScore("SearchRelevance"),
                Sort = Builders<IlevusUser>.Sort.MetaTextScore("SearchRelevance"),
                Skip = start,
                Limit = limit
            };
        }
    }
}