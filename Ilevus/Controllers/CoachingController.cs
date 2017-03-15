using ilevus.Attributes;
using ilevus.Helpers;
using ilevus.Models;
using ilevus.Resources;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.Cookies;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Resources;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ilevus.Controllers
{

    [RoutePrefix("api/Coaching")]
    [IlevusAuthorization]
    public class CoachingController : BaseAPIController
    {

        [HttpPost]
        [Route("Hire/{Id}")]
        public async Task<IHttpActionResult> HireCoach(string Id)
        {
            var db = IlevusDBContext.Create();
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                var process = new CoachingProcess()
                {
                    CoachId = Id,
                    CoacheeId = user.Id
                };
                await collection.InsertOneAsync(process);
                return Ok(process);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("Retrieve/Coach")]
        public async Task<IHttpActionResult> GetCoachProcesses()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                var results = await collection.FindAsync(filters.Eq("CoachId", user.Id));
                var processes = await results.ToListAsync();
                if (processes != null)
                {
                    return Ok(processes);
                }
                return Ok(new List<CoachingProcess>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("Retrieve/Coachee")]
        public async Task<IHttpActionResult> GetCoacheeProcesses()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                var results = await collection.FindAsync(filters.Eq("CoacheeId", user.Id));
                var processes = await results.ToListAsync();
                if (processes != null)
                {
                    return Ok(processes);
                }
                return Ok(new List<CoachingProcess>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


    }
}