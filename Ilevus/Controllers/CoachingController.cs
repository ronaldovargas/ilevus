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
using static ilevus.Models.CoachingSession;

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
                    var viewModels = new List<CoachingProcessViewModel>();
                    foreach (var process in processes) {
                        var coachee = await UserManager.FindByIdAsync(process.CoacheeId);
                        viewModels.Add(new CoachingProcessViewModel() {
                            Id = process.Id,
                            CoachComments = process.CoachComments,
                            CoacheeComments = process.CoacheeComments,
                            Creation = process.Creation,
                            Started = process.Started,
                            Finished = process.Finished,
                            Objectives = process.Objectives,
                            Testimony = process.Testimony,
                            Rating = process.Rating,
                            Status = process.Status,
                            Sessions = process.Sessions,
                            Coach = new PublicProfileViewModel(user),
                            Coachee = new PublicProfileViewModel(coachee)
                        });
                    }
                    return Ok(viewModels);
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
                    var viewModels = new List<CoachingProcessViewModel>();
                    foreach (var process in processes)
                    {
                        var coach = await UserManager.FindByIdAsync(process.CoachId);
                        viewModels.Add(new CoachingProcessViewModel()
                        {
                            Id = process.Id,
                            CoachComments = process.CoachComments,
                            CoacheeComments = process.CoacheeComments,
                            Creation = process.Creation,
                            Started = process.Started,
                            Finished = process.Finished,
                            Objectives = process.Objectives,
                            Testimony = process.Testimony,
                            Rating = process.Rating,
                            Status = process.Status,
                            Sessions = process.Sessions,
                            Coach = new PublicProfileViewModel(coach),
                            Coachee = new PublicProfileViewModel(user)
                        });
                    }
                    return Ok(viewModels);
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