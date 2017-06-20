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
using Moip.Net.V2.Model;
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

			    var v2Client = new V2Client(
				    new Uri("https://sandbox.moip.com.br/"),
					"QXEYNX1WIEGI3VZV9IBKU0ZZQCIKU4BF",
					"6NU0BEALWOVLIVR4FD1FRIGTE6NONJYJOESOBT5N"
				);

			    var pedido = new Pedido()
			    {
				    OwnId = "SEU_CODIGO_PEDIDO",
				    Amount = new Valores()
				    {
					    Currency = CurrencyType.BRL,
					    Subtotals = new Subtotal()
					    {
						    Shipping = 1000
					    }
				    },
				    Items = new List<ItemPedido>()
				    {
					    new ItemPedido()
					    {
						    Product = "Descrição do produto",
						    Quantity = 1,
						    Detail = "Detalhes",
						    Price = 1000
					    }
				    },
				    Customer = new Cliente()
				    {
					    OwnId = "SEU_ID_CLIENTE",
					    Fullname = "José Silva",
					    Email = "josesilva@acme.com.br",
					    BirthDate = DateTime.Now.Date.AddYears(-18).ToString("yyyy-MM-dd"),
					    TaxDocument = new Documento()
					    {
						    Type = DocumentType.CPF,
						    Number = "65374721054"
					    },
					    Phone = new Telefone()
					    {
						    CountryCode = 55,
						    AreaCode = 11,
						    Number = 999999999
					    },
					    ShippingAddress = new Endereco()
					    {
						    ZipCode = "01234000",
						    Street = "Avenida Faria Lima",
						    StreetNumber = "2927",
						    Complement = "SL 1",
						    City = "São Paulo",
						    District = "Itaim",
						    State = "SP",
						    Country = "BRA"
					    }
				    }
			    };

			    var clienteCriado = v2Client.CriarPedido(pedido);

			await UserManager.UpdateAsync(user);

			    return Ok();
		    }
		    catch (Exception e)
		    {
			    return InternalServerError(e);
		    }
	    }


	}
}