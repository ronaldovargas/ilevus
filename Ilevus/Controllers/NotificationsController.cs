using ilevus.App_Start;
using ilevus.Attributes;
using ilevus.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
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
    [RoutePrefix("api/Notifications")]
    [IlevusAuthorization]
    public class NotificationsController : BaseAPIController
    {
        [HttpGet]
        [Route("UserNotifications/{id}")]
        public async Task<IHttpActionResult> GetNotifications(string Id)
        {
            if (Id == null)
            {
                return NotFound();
            }

            var db = IlevusDBContext.Create();
            var builder = Builders<NotificationModel>.Filter;
            var filters = builder.Eq("Status", false) & builder.Eq("User_id", Id);
            var collection = db.GetNotificationsCollection();
            try
            {
                var results = await collection.FindAsync(filters);
                var notifications = await results.ToListAsync();
                if (notifications != null)
                {
                    return Ok(notifications);
                }
                return Ok(new List<NotificationModel>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("AllNotifications")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetAllNotifications()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<NotificationModel>.Filter;
            var collection = db.GetNotificationsCollection();
            try
            {
                var results = await collection.FindAsync(filters.Empty);
                var notifications = await results.ToListAsync();
                if (notifications != null)
                {
                    return Ok(notifications);
                }
                return Ok(new List<NotificationModel>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("SetRead/{id}")]
        public async Task<IHttpActionResult> SetReadyNotification(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();
            try
            {
                var result = await collection.FindAsync(filters.Eq("Id", Id));
                var notification = await result.FirstOrDefaultAsync();
                if (notification == null)
                {
                    return NotFound();
                }
                await collection.UpdateOneAsync(
                    filters.Eq("Id", Id),
                    updates.Inc("Status", true)
                );
                return Redirect(notification.Link);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("DelNotification/{id}")]
        public async Task<IHttpActionResult> DelNotification(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();
            try
            {
                var result = await collection.FindAsync(filters.Eq("Id", Id));
                var notification = await result.FirstOrDefaultAsync();
                if (notification == null)
                {
                    return NotFound();
                }
                await collection.DeleteOneAsync(
                    filters.Eq("Id", Id)
                );
                return Redirect(notification.Link);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}