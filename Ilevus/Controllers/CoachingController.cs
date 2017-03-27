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
        [Route("Retrieve/Process/{id}")]
        public async Task<IHttpActionResult> GetCoachingProcess(string id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var updates = Builders<CoachingProcess>.Update;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var process = (await collection.FindAsync(filters.Eq("Id", id))).FirstOrDefault();
                if (process != null)
                {
                    if (process.Sessions.Count == 0)
                    {
                        var session = new CoachingSession();
                        await collection.UpdateOneAsync(filters.Eq("Id", id), updates.Push("Sessions", session));
                        process.Sessions.Add(session);
                    }
                    var coachee = await UserManager.FindByIdAsync(process.CoacheeId);
                    var coach = await UserManager.FindByIdAsync(process.CoachId);
                    return Ok(new CoachingProcessViewModel(process, coach, coachee));
                }
                return NotFound();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("Update/SessionField")]
        public async Task<IHttpActionResult> UpdateSessionField(CoachingSessionFieldUpdateBindingModel model)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var updates = Builders<CoachingProcess>.Update;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var process = (await collection.FindAsync(filters.Eq("Id", model.ProcessId))).FirstOrDefault();
                if (process != null)
                {
                    var session = process.Sessions[model.Session];

                    if ("Objectives".Equals(model.Field))
                    {
                        session.Objectives = model.Value;
                    }
                    else if ("CoachComments".Equals(model.Field))
                    {
                        session.CoachComments = model.Value;
                    }
                    else if ("CoacheeComments".Equals(model.Field))
                    {
                        session.CoacheeComments = model.Value;
                    }
                    else
                    {
                        return BadRequest("Invalid request");
                    }

                    await collection.UpdateOneAsync(filters.Eq("Id", model.ProcessId), updates.Set("Sessions", process.Sessions));
                    var coachee = await UserManager.FindByIdAsync(process.CoacheeId);
                    var coach = await UserManager.FindByIdAsync(process.CoachId);
                    return Ok(new CoachingProcessViewModel(process, coach, coachee));
                }
                return NotFound();
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
                        viewModels.Add(new CoachingProcessViewModel(process, user, coachee));
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
                        viewModels.Add(new CoachingProcessViewModel(process, coach, user));
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