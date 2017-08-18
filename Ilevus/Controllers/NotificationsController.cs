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
            var filters = (builder.Eq("User_id", Id) | builder.Eq("User_id", "0"));
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
            var filters = Builders<NotificationModel>.Filter;
            var updates = Builders<NotificationModel>.Update;
            var collection = db.GetNotificationsCollection();
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
                    updates.Set("Status", true)
                );
                return Ok(notification);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

       
        [HttpPost]
        [Route("Send")]
        public async Task<IHttpActionResult> SendNotification(NotificationModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var user = UserManager.FindByName(User.Identity.Name);
            //var partner = await UserManager.FindByIdAsync(model.Destination);
            //if (partner == null)
            //{
            //    return BadRequest("You must provide the destination of the message.");
            //}

            //var filters = Builders<ChatConversation>.Filter;
            var collection = IlevusDBContext.Create().GetNotificationsCollection();
           // var first = string.Compare(partner.Id, user.Id) > 0 ? user : partner;
           // var second = string.Compare(partner.Id, user.Id) < 0 ? user : partner;
           // var docFilter = filters.And(
           //    filters.Eq("FirstUser", first.Id),
           //    filters.Eq("SecondUser", second.Id)
           //// filters.Eq("Day", DateTime.Today) // Uncomment if per-day conversation is active
           //);
            try
            {
                await collection.InsertOneAsync(model);
                return Ok(model);
                //var results = await collection.FindAsync(docFilter);
                //ChatMessage msg;
                //var conversation = await results.FirstOrDefaultAsync();
                //if (conversation == null)
                //{
                //    conversation = new ChatConversation()
                //    {
                //        FirstUser = first.Id,
                //        SecondUser = second.Id
                //    };
                //    msg = new ChatMessage()
                //    {
                //        AuthorId = user.Id,
                //        Content = model.Content
                //    };
                //    conversation.Messages.Add(msg);
                //    await collection.InsertOneAsync(conversation);
                //    return Ok(msg);
                //}
                //else
                //{
                //    msg = new ChatMessage()
                //    {
                //        AuthorId = user.Id,
                //        Content = model.Content
                //    };
                //    await collection.UpdateOneAsync(
                //        docFilter, Builders<ChatConversation>.Update.AddToSet("Messages", msg)
                //    );
                //    return Ok(msg);
                //}
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }



        [HttpGet]
        [Route("GetNotification/{id}")]
        public async Task<IHttpActionResult> GetNotification(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<NotificationModel>.Filter;
            var collection = db.GetNotificationsCollection();
            try
            {
                var result = await collection.FindAsync(filters.Eq("Id", Id));
                var notification = await result.FirstOrDefaultAsync();
                if (notification == null)
                {
                    return NotFound();
                }

                await SetReadyNotification(Id);               
                return Ok(notification);
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
            var filters = Builders<NotificationModel>.Filter;
            var updates = Builders<NotificationModel>.Update;
            var collection = db.GetNotificationsCollection();
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
                return Ok(notification);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}