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

    [RoutePrefix("api/Schedule")]
    [IlevusAuthorization]
    public class ScheduleController : BaseAPIController
    {
        
        [HttpGet]
        [Route("Meetings")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetMeetings(string UserId, DateTime From, DateTime To)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<MeetingSchedule>.Filter;
            var collection = db.GetMeetingScheduleCollection();
            try
            {
                var results = await collection.FindAsync(
                    filters.Or(
                        filters.Eq("UserId", UserId),
                        filters.Gte("Begin", From),
                        filters.Lte("Begin", To)
                    )
                );
                var meetings = await results.ToListAsync();
                if (meetings != null)
                {
                    return Ok(meetings);
                }
                return Ok(new List<MeetingSchedule>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("BookMeeting")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> BookMeeting(MeetingBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var collection = IlevusDBContext.Create().GetMeetingScheduleCollection();
            try
            {
                var meeting = new MeetingSchedule()
                {
                    UserId = model.UserId,
                    CoacheeEmail = model.CoacheeEmail,
                    CoacheeFullName = model.CoacheeFullName,
                    CoacheePhone = model.CoacheePhone,
                    Subject = model.Subject,
                    Begin = model.Begin
                };
                await collection.InsertOneAsync(meeting);
                return Ok(meeting);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}