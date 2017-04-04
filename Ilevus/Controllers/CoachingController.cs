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
        public async Task<IHttpActionResult> GetCoachingProcess(string id, string lastModified = null)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var updates = Builders<CoachingProcess>.Update;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                if (!string.IsNullOrEmpty(lastModified))
                {
                    var modified = await collection.CountAsync(filters.And(
                        filters.Eq("Id", id),
                        filters.Gt("LastModified", DateTime.Parse(lastModified))
                    ));
                    if (modified == 0)
                        return Ok(false);
                }
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
                    
                    process.LastModified = DateTime.Now;
                    await collection.UpdateOneAsync(filters.Eq("Id", model.ProcessId),
                        updates.Combine(
                            updates.Set("Sessions", process.Sessions),
                            updates.Set("LastModified", process.LastModified)
                        )
                    );
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
        [Route("{id}/NewSession")]
        public async Task<IHttpActionResult> NewSession(string id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var updates = Builders<CoachingProcess>.Update;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                var process = (await collection.FindAsync(filters.Eq("Id", id))).FirstOrDefault();
                if (process != null)
                {
                    var session = process.Sessions[process.Sessions.Count - 1];
                    if (session.Status < 10 || !process.CoachId.Equals(user.Id))
                    {
                        return BadRequest("Você não pode criar uma nova sessão antes de finalizar a atual.");
                    }
                    var newSession = new CoachingSession();
                    process.Sessions.Add(newSession);
                    process.LastModified = newSession.Creation;

                    await collection.UpdateOneAsync(filters.Eq("Id", id),
                        updates.Combine(
                            updates.AddToSet("Sessions", newSession),
                            updates.Set("LastModified", newSession.Creation)
                        )
                    );
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
        [Route("{id}/StartSession")]
        public async Task<IHttpActionResult> StartSession(string id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var updates = Builders<CoachingProcess>.Update;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                var process = (await collection.FindAsync(filters.Eq("Id", id))).FirstOrDefault();
                if (process != null)
                {
                    var session = process.Sessions[process.Sessions.Count - 1];
                    if (session.Status != 0 || !process.CoachId.Equals(user.Id))
                    {
                        return BadRequest("Você não pode iniciar esta sessão.");
                    }
                    session.Status = 5;
                    session.Started = DateTime.Now;
                    process.LastModified = session.Started;

                    await collection.UpdateOneAsync(filters.Eq("Id", id),
                        updates.Combine(
                            updates.Set("Sessions", process.Sessions),
                            updates.Set("Status", 5),
                            updates.Set("LastModified", process.LastModified)
                        )
                    );
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
        [Route("{id}/FinishSession")]
        public async Task<IHttpActionResult> FinishSession(string id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var updates = Builders<CoachingProcess>.Update;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                var process = (await collection.FindAsync(filters.Eq("Id", id))).FirstOrDefault();
                if (process != null)
                {
                    var session = process.Sessions[process.Sessions.Count - 1];
                    if (session.Status != 5 || !process.CoachId.Equals(user.Id))
                    {
                        return BadRequest("Você não pode finalizar esta sessão.");
                    }
                    session.Status = 10;
                    session.Finished = DateTime.Now;
                    process.LastModified = session.Finished;

                    await collection.UpdateOneAsync(filters.Eq("Id", id),
                        updates.Combine(
                            updates.Set("Sessions", process.Sessions),
                            updates.Set("LastModified", process.LastModified)
                        )
                    );
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
        [Route("EvaluateSession")]
        public async Task<IHttpActionResult> EvaluateSession(EvaluateSessionBindingModel model)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<CoachingProcess>.Filter;
            var updates = Builders<CoachingProcess>.Update;
            var collection = db.GetCoachingProcessCollection();
            try
            {
                var process = (await collection.FindAsync(filters.Eq("Id", model.Id))).FirstOrDefault();
                if (process != null)
                {
                    var session = process.Sessions[model.Session];
                    if (session == null || session.Status < 10)
                    {
                        return BadRequest("Sessão inválida.");
                    }
                    session.Rating = model.Rating;
                    session.Commitment = model.Commitment;
                    process.LastModified = DateTime.Now;
                    await collection.UpdateOneAsync(filters.Eq("Id", model.Id),
                        updates.Combine(
                            updates.Set("Sessions", process.Sessions),
                            updates.Set("LastModified", process.LastModified)
                        )
                    );
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