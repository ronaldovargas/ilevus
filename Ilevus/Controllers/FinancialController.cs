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

    [RoutePrefix("api/Financial")]
    [IlevusAuthorization]
    public class FinancialController : BaseAPIController
    {

        [HttpGet]
        [Route("Subscription")]
        public async Task<IHttpActionResult> GetUserSubscription()
        {
            var db = IlevusDBContext.Create();
            var collection = db.GetSubscriptionsCollection();
            var filters = Builders<IlevusSubscription>.Filter;
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                if (user == null)
                {
                    return BadRequest("You must be logged in.");
                }
                if (!user.IsProfessional)
                {
                    return BadRequest("Você precisa ser um profissional para ter um plano de assinatura premium.");
                }
                IlevusSubscription result = (await collection.FindAsync(filters.And(
                    filters.Eq("UserId", user.Id),
                    filters.Ne("Status", "CANCELLED")
                ))).FirstOrDefault();
                if (result == null)
                {
                    result = new IlevusSubscription()
                    {
                        Status = "NEW",
                        UserId = user.Id
                    };
                    await collection.InsertOneAsync(result);
                }
                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("Subscription")]
        public async Task<IHttpActionResult> UpdateUserSubscription(MoipSubscriptionBindingModel model)
        {
            var db = IlevusDBContext.Create();
            var collection = db.GetSubscriptionsCollection();
            var filters = Builders<IlevusSubscription>.Filter;
            try
            {
                var user = await UserManager.FindByNameAsync(User.Identity.Name);
                if (user == null)
                {
                    return BadRequest("You must be logged in.");
                }

                IlevusSubscription result = (await collection.FindAsync(filters.Eq("Id", model.Id))).FirstOrDefault();
                if (result == null)
                {
                    return BadRequest("Invalid subscription.");
                }
                if (!result.UserId.Equals(user.Id))
                {
                    return BadRequest("Essa não é sua assinatura.");
                }
                result.Amount = model.Amount;
                result.CreditCard = model.CreditCard;
                result.Invoice = model.Invoice;
                result.NextInvoiceDate = model.NextInvoiceDate;
                result.Status = model.Status;
                await collection.ReplaceOneAsync(filters.Eq("Id", model.Id), result);
                user.Premium = new UserPremiumMembership()
                {
                    Active = true,
                    Late = false,
                    PayedUntil = new DateTime(result.NextInvoiceDate.year, result.NextInvoiceDate.month, result.NextInvoiceDate.day)
                };
                await UserManager.UpdateAsync(user);

                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }


    }
}