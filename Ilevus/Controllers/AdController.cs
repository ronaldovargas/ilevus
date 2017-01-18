﻿using ilevus.Attributes;
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

    [RoutePrefix("api/Ad")]
    [IlevusAuthorization]
    public class AdController : BaseAPIController
    {
        
        [HttpGet]
        [Route("Retrieve")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetAds()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var collection = db.GetAdsCollection();
            try
            {
                var results = await collection.FindAsync(filters.Empty);
                var ads = await results.ToListAsync();
                if (ads != null)
                {
                    return Ok(ads);
                }
                return Ok(new List<Ad>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("MyMeetings")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetMyMeetings()
        {
            var user = await UserManager.FindByNameAsync(User.Identity.Name);
            var db = IlevusDBContext.Create();
            var filters = Builders<MeetingSchedule>.Filter;
            var collection = db.GetMeetingScheduleCollection();
            try
            {
                var results = await collection.FindAsync(
                    filters.And(
                        filters.Eq("UserId", user.Id),
                        filters.Gte("Begin", DateTime.Now)
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
        
        [HttpPost]
        [Route("Config")]
        public async Task<IHttpActionResult> SaveConfig(UserScheduleConfig model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                user.ScheduleConfig = model;
                var result = await UserManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return GetErrorResult(result);
                }
                return Ok(true);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}