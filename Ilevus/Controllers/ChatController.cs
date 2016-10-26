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
using System.Globalization;
using System.Resources;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ilevus.Controllers
{

    [RoutePrefix("api/Chat")]
    [IlevusAuthorization]
    public class ChatController : BaseAPIController
    {

        [HttpGet]
        [Route("Ensure")]
        public async Task<IHttpActionResult> EnsureConversation(string Destination)
        {
            if (string.IsNullOrWhiteSpace(Destination))
            {
                return BadRequest("You must provide a destination id.");
            }
            var filters = Builders< ChatConversation >.Filter;
            var user = UserManager.FindByName(User.Identity.Name);
            var partner = await UserManager.FindByIdAsync(Destination);
            var collection = IlevusDBContext.Create().GetConversationsCollection();
            var first = string.Compare(partner.Id, user.Id) > 0 ? user : partner;
            var second = string.Compare(partner.Id, user.Id) < 0 ? user : partner;
            try
            {
                var results = await collection.FindAsync(
                    filters.And(
                        filters.Eq("FirstUser", first.Id),
                        filters.Eq("SecondUser", second.Id)
                    )
                );
                var conversation = await results.FirstOrDefaultAsync();
                if (conversation != null)
                {
                    return Ok(new ChatConversationViewModel(conversation, partner));
                }
                conversation = new ChatConversation() {
                    FirstUser = first.Id,
                    SecondUser = second.Id
                };
                await collection.InsertOneAsync(conversation);
                return Ok(new ChatConversationViewModel(conversation, partner));
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("Poll")]
        public async Task<IHttpActionResult> PollNewMessages(string Destination, DateTime Since)
        {
            if (string.IsNullOrWhiteSpace(Destination))
            {
                return BadRequest("You must provide a destination id.");
            }
            var filters = Builders<ChatConversation>.Filter;
            var user = UserManager.FindByName(User.Identity.Name);
            var partner = await UserManager.FindByIdAsync(Destination);
            var collection = IlevusDBContext.Create().GetConversationsCollection();
            var first = string.Compare(partner.Id, user.Id) > 0 ? user : partner;
            var second = string.Compare(partner.Id, user.Id) < 0 ? user : partner;
            try
            {
                var results = await collection.FindAsync(
                    filters.And(
                        filters.Eq("FirstUser", first.Id),
                        filters.Eq("SecondUser", second.Id)
                    )
                );
                var conversation = await results.FirstOrDefaultAsync();
                if (conversation != null)
                {
                    return Ok(new ChatConversationViewModel(conversation, partner));
                }
                return BadRequest("Invalid conversation");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("Send")]
        public async Task<IHttpActionResult> SendMessage(ChatMessageBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = UserManager.FindByName(User.Identity.Name);
            var partner = await UserManager.FindByIdAsync(model.Destination);
            if (partner == null)
            {
                return BadRequest("You must provide the destination of the message.");
            }

            var filters = Builders<ChatConversation>.Filter;
            var collection = IlevusDBContext.Create().GetConversationsCollection();
            var first = string.Compare(partner.Id, user.Id) > 0 ? user : partner;
            var second = string.Compare(partner.Id, user.Id) < 0 ? user : partner;
            var docFilter = filters.And(
               filters.Eq("FirstUser", first.Id),
               filters.Eq("SecondUser", second.Id),
               filters.Eq("Day", DateTime.Today)
           );
            try
            {
                var results = await collection.FindAsync(docFilter);
                ChatMessage msg;
                var conversation = await results.FirstOrDefaultAsync();
                if (conversation == null)
                {
                    conversation = new ChatConversation()
                    {
                        FirstUser = first.Id,
                        SecondUser = second.Id
                    };
                    msg = new ChatMessage()
                    {
                        AuthorId = user.Id,
                        Content = model.Content
                    };
                    conversation.Messages.Add(msg);
                    await collection.InsertOneAsync(conversation);
                    return Ok(msg);
                } else
                {
                    msg = new ChatMessage()
                    {
                        AuthorId = user.Id,
                        Content = model.Content
                    };
                    await collection.UpdateOneAsync(
                        docFilter, Builders<ChatConversation>.Update.AddToSet("Messages", msg)
                    );
                    return Ok(msg);
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}