using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using ElCamino.AspNet.Identity.Dynamo;
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
            IlevusDbContext db = IlevusDbContext.Create();
            var response = await db.Client.ScanAsync(new ScanRequest {
                TableName = db.FormatTableNameWithPrefix(Constants.TableNames.UsersTable),
                FilterExpression = "contains(Keywords, :t)",
                ExpressionAttributeValues =
                {
                    {":t", new AttributeValue(keywords != null ? keywords.ToLower():"")}
                }
            });
            var attrs = response.Items;
            ConcurrentBag<PublicProfileViewModel> users = new ConcurrentBag<PublicProfileViewModel>();
            var userDict = attrs
                .Where(c => c["Id"].S.Equals(c["UserId"].S, StringComparison.OrdinalIgnoreCase));

            Parallel.ForEach<Dictionary<string, AttributeValue>>(userDict, (userItem) =>
            {
                //User
                IlevusUser user = db.FromDocument<IlevusUser>(Document.FromAttributeMap(userItem));
                users.Add(new PublicProfileViewModel(user));
            });
            return Ok(users);
        }
    }
}