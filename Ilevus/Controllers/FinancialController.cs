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
using Moip.Net.V2;
using Moip.Net.V2.Filter;
using Moip.Net.V2.Model;
using Moip.Net.Assinaturas;
using static ilevus.Models.CoachingSession;
using Moip.Net;

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
            var assClient = new AssinaturasClient(
                new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                IlevusDBContext.SystemConfiguration.MoipToken,
                IlevusDBContext.SystemConfiguration.MoipKey
            );
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

                SubscriptionResponse moipSub;
                try
                {
                    moipSub = assClient.GetSubscription(result.Id);
                }
                catch (MoipException e)
                {
                    if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        moipSub = null;
                    }
                    else
                    {
                        return InternalServerError(e);
                    }
                }

                if (moipSub == null)
                {
                    CustomerRequest customer = model.Customer;
                    customer.Code = user.Id;
                    bool newCustomer = false;
                    try
                    {
                        CustomerResponse moipCustomer = assClient.GetCustomer(user.Id);
                        newCustomer = false;
                    }
                    catch (MoipException e)
                    {
                        if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                        {
                            newCustomer = true;
                        }
                        else
                        {
                            return InternalServerError(e);
                        }
                    }
                    if (newCustomer)
                    {
                        assClient.CreateCustomer(customer, true);
                    } else
                    {
                        assClient.UpdateCustomer(user.Id, customer);
                        assClient.UpdateBillingInfo(user.Id, customer.BillingInfo);
                    }

                    Subscription subscription = new Subscription()
                    {
                        Code = result.Id,
                        Customer = customer,
                        PaymentMethod = Plan.PaymentMethodPlan.CREDIT_CARD,
                        Plan = new Plan()
                        {
                            Code = IlevusDBContext.SystemConfiguration.MoipSubscriptionCode
                        }
                    };
                    moipSub = assClient.CreateSubscription(subscription, false);
                }

                if (!moipSub.Status.Equals(Subscription.SubscriptionStatus.ACTIVE))
                {
                    assClient.ActivateSubscription(moipSub.Code);
                }

                result.Amount = moipSub.Invoice.Amount;
                result.Invoice = moipSub.Invoice;
                result.NextInvoiceDate = moipSub.NextInvoiceDate;
                result.Status = moipSub.Status.ToString();
                await collection.ReplaceOneAsync(filters.Eq("Id", model.Id), result);

                DateTime payedUntil = DateTime.Today;
                if ((result.NextInvoiceDate.Year != null) && (result.NextInvoiceDate.Month != null) && (result.NextInvoiceDate.Day != null))
                {
                    payedUntil = new DateTime(result.NextInvoiceDate.Year.Value, result.NextInvoiceDate.Month.Value, result.NextInvoiceDate.Day.Value);
                }
                user.Premium = new UserPremiumMembership()
                {
                    Active = true,
                    Late = false,
                    PayedUntil = payedUntil
                };
                await UserManager.UpdateAsync(user);

                return Ok(result);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpPost]
        [Route("Subscription/Suspend")]
        public async Task<IHttpActionResult> SuspendUserSubscription()
        {
            var assClient = new AssinaturasClient(
                new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                IlevusDBContext.SystemConfiguration.MoipToken,
                IlevusDBContext.SystemConfiguration.MoipKey
            );
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
                IlevusSubscription sub = (await collection.FindAsync(filters.And(
                    filters.Eq("UserId", user.Id),
                    filters.Ne("Status", "CANCELLED")
                ))).FirstOrDefault();

                if (sub == null)
                {
                    return BadRequest("You must have a subscription to suspend");
                }
                
                try
                {
                    SubscriptionResponse moipSub = assClient.GetSubscription(sub.Id);
                    assClient.SuspendSubscription(moipSub.Code);

                    sub.Status = Subscription.SubscriptionStatus.SUSPENDED.ToString();
                    await collection.ReplaceOneAsync(filters.Eq("Id", sub.Id), sub);

                    user.Premium.Suspended = true;
                    await UserManager.UpdateAsync(user);

                    return Ok(user.Premium);
                }
                catch (MoipException e)
                {
                    if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        return BadRequest("Assiantura MOIP não encontrada.");
                    }
                    else
                    {
                        return InternalServerError(e);
                    }
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("Subscriptions")]
        public IHttpActionResult GetAllSubscriptions()
        {
            try
            {
                var assClient = new AssinaturasClient(
                    new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                    IlevusDBContext.SystemConfiguration.MoipToken,
                    IlevusDBContext.SystemConfiguration.MoipKey
                );
                var subsResponse = assClient.GetSubscriptions();
                return Ok(subsResponse.Subscriptions);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        [Route("Subscriptions/Detail/{Id}")]
        public IHttpActionResult GetSubscriptionDetail(string Id)
        {

            try
            {
                var assClient = new AssinaturasClient(
                    new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                    IlevusDBContext.SystemConfiguration.MoipToken,
                    IlevusDBContext.SystemConfiguration.MoipKey
                );
                var sub = assClient.GetSubscription(Id);
                return Ok(sub);
            }
            catch (MoipException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return BadRequest("Assinatura MOIP não encontrado");
                }
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("Subscriptions/Invoices/{Id}")]
        public IHttpActionResult GetSubscriptionInvoices(string Id)
        {

            try
            {
                var assClient = new AssinaturasClient(
                    new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                    IlevusDBContext.SystemConfiguration.MoipToken,
                    IlevusDBContext.SystemConfiguration.MoipKey
                );
                var invoicesResponse = assClient.GetInvoices(Id);
                return Ok(invoicesResponse.Invoices);
            }
            catch (MoipException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return BadRequest("Assinatura MOIP não encontrado");
                }
                return InternalServerError(e);
            }
        }
        [HttpGet]
        [Route("Subscriptions/Invoice/{Id}")]
        public IHttpActionResult GetSubscriptionInvoice(int Id)
        {

            try
            {
                var assClient = new AssinaturasClient(
                    new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                    IlevusDBContext.SystemConfiguration.MoipToken,
                    IlevusDBContext.SystemConfiguration.MoipKey
                );
                var invoice = assClient.GetInvoice(Id);
                return Ok(invoice);
            }
            catch (MoipException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return BadRequest("Fatura MOIP não encontrado");
                }
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("Subscriptions/Customers")]
        public IHttpActionResult GetAllSubscriptionCustomer()
        {
            try
            {
                var assClient = new AssinaturasClient(
                    new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                    IlevusDBContext.SystemConfiguration.MoipToken,
                    IlevusDBContext.SystemConfiguration.MoipKey
                );
                var customersResponse = assClient.GetCustomers();
                return Ok(customersResponse.Customers);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [HttpGet]
        [Route("Subscriptions/Customers/{Id}")]
        public IHttpActionResult GetSubscriptionCustomer(string Id)
        {

            try
            {
                var assClient = new AssinaturasClient(
                    new Uri(IlevusDBContext.SystemConfiguration.MoipBaseUrl),
                    IlevusDBContext.SystemConfiguration.MoipToken,
                    IlevusDBContext.SystemConfiguration.MoipKey
                );
                var customerResponse = assClient.GetCustomer(Id);
                return Ok(customerResponse);
            }
            catch (MoipException e)
            {
                if (e.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    return BadRequest("Cliente MOIP não encontrado");
                }
                return InternalServerError(e);
            }
        }

        [HttpPost]
	    [Route("HireService")]
	    public async Task<IHttpActionResult> HireService(HireServiceModel model)
	    {
		    var db = IlevusDBContext.Create();
		    try
		    {
			    var user = await UserManager.FindByNameAsync(User.Identity.Name);
			    if (user == null)
			    {
				    return BadRequest("You must be logged in.");
			    }


				//var clienteCriado = v2Client.CriarPedido(pedido);

			 //   //Listar todos os pedidos pagos e criados com data superior a 01/01/2016
			 //   var filters = new Filters()
				//    .Add(new GreatherThanFilter<DateTime>("createdAt", new DateTime(2016, 01, 01)))
				//    .Add(new InFilter<OrderStatusType>("status", OrderStatusType.CREATED, OrderStatusType.PAID));

			 //   var pedidos = v2Client.ListarTodosPedidos();
				//await UserManager.UpdateAsync(user);

			    return Ok();
		    }
		    catch (Exception e)
		    {
			    return InternalServerError(e);
		    }
	    }


	}
}
