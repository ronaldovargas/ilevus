using ilevus.Attributes;
using ilevus.Helpers;
using ilevus.Models;
using ilevus.Models.CoachingTools;
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

namespace ilevus.Controllers.CoachingTools
{

    [RoutePrefix("api/WheelOfLife")]
    [IlevusAuthorization]
    public class WheelOfLifeController : BaseAPIController
    {

        [HttpPost]
        [Route("Initialize")]
        public async Task<IHttpActionResult> InitializeTool(CoachingSessionBindingModel model)
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
                    if (session == null)
                    {
                        return BadRequest("Sessão inválida.");
                    }

                    var coachee = await UserManager.FindByIdAsync(process.CoacheeId);
                    var coach = await UserManager.FindByIdAsync(process.CoachId);
                    if (session.WheelOfLifeTool == null)
                    {
                        session.WheelOfLifeTool = new WheelOfLife(coach.Professional.CoachingToolsConfigs.WheelOfLifeDefaults);
                    }
                    process.LastModified = DateTime.Now;
                    await collection.UpdateOneAsync(filters.Eq("Id", model.ProcessId),
                        updates.Combine(
                            updates.Set("Sessions", process.Sessions),
                            updates.Set("LastModified", process.LastModified)
                        )
                    );
                    return Ok(session.WheelOfLifeTool);
                }
                return NotFound();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("Evaluate")]
        public async Task<IHttpActionResult> Evaluate(WheelOfLifeFieldEvaluateBindingModel model)
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
                    if (session == null || session.WheelOfLifeTool == null)
                    {
                        return BadRequest("Sessão inválida.");
                    }
                    session.WheelOfLifeTool.Fields[model.Field].Evaluation = model.Evaluation;
                    await collection.UpdateOneAsync(filters.Eq("Id", model.ProcessId),
                        updates.Combine(
                            updates.Set("Sessions", process.Sessions),
                            updates.Set("LastModified", DateTime.Now)
                        )
                    );
                    return Ok(true);
                }
                return NotFound();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("SaveLearnings")]
        public async Task<IHttpActionResult> SaveLearnings(WheelOfLifeSaveLearningsBindingModel model)
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
                    if (session == null || session.WheelOfLifeTool == null)
                    {
                        return BadRequest("Sessão inválida.");
                    }
                    session.WheelOfLifeTool.Learnings = model.Learnings;
                    await collection.UpdateOneAsync(filters.Eq("Id", model.ProcessId),
                        updates.Combine(
                            updates.Set("Sessions", process.Sessions),
                            updates.Set("LastModified", DateTime.Now)
                        )
                    );
                    return Ok(true);
                }
                return NotFound();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}