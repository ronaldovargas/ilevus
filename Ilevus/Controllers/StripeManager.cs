using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Web;
using AutoMapper;
using ilevus.App_Start;
using ilevus.Models;
using Microsoft.AspNet.Identity;
using MongoDB.Driver;
using Stripe;

namespace ilevus.Controllers
{
	public class StripeManager
	{


		readonly StripeAccountService accountService = new StripeAccountService();

		StripeCustomerService customerService = new StripeCustomerService();
		IlevusUserManager UserManager { get; set; }

		private static StripeManager instance;


		public static StripeManager Instance
		{
			get
			{
				if (instance != null)
					return instance;

				lock (typeof(StripeManager))
					if (instance == null)
						instance = new StripeManager();

				return instance;
			}
		}

		private StripeManager()
		{
			StripeConfiguration.SetApiKey("sk_test_oUBTbeU0cX5yhj2bq0g1l1qS");
		}

		public bool AccountIsValid(IlevusUser user)
		{
			//Email = accountLocal.Email,
			//Type = StripeAccountType.Custom,
			//Country = accountLocal.Country,
			//DefaultCurrency = accountLocal.DefaultCurrency
			//.ForMember(para => para.BirthDay, de => de.MapFrom(o => o.DateBirth.Day))
			//	.ForMember(para => para.BirthMonth, de => de.MapFrom(o => o.DateBirth.Month))
			//	.ForMember(para => para.BirthYear, de => de.MapFrom(o => o.DateBirth.Year))
			//	.ForMember(para => para.FirstName, de => de.MapFrom(o => o.FirstName))
			//	.ForMember(para => para.LastName, de => de.MapFrom(o => o.LastName))
			//	.ForMember(para => para.PersonalIdNumber, de => de.MapFrom(o => o.PersonalIdNumber))
			//	.ForMember(para => para.Type, de => de.MapFrom(o => "individual"))

			//	.ForMember(para => para.AddressCity, de => de.MapFrom(o => o.Address.City))
			//	.ForMember(para => para.AddressPostalCode, de => de.MapFrom(o => o.Address.PostalCode))
			//	.ForMember(para => para.AddressLine1, de => de.MapFrom(o => o.Address.Line1))
			//	.ForMember(para => para.AddressLine2, de => de.MapFrom(o => o.Address.Line2))
			//	.ForMember(para => para.AddressState, de => de.MapFrom(o => o.Address.State));


			return true;
		}

		public AccountPayment CreateAccount(IlevusUser user)
		{
			var accountLocal = Mapper.Map<AccountPayment>(user);
			var legalPayment = Mapper.Map<StripeAccountLegalEntityOptions>(accountLocal);

			var accountOptions = new StripeAccountCreateOptions()
			{
				Email = accountLocal.Email,
				Type = StripeAccountType.Custom,
				Country = accountLocal.Country,
				DefaultCurrency = accountLocal.DefaultCurrency,
				TransferScheduleWeeklyAnchor = "monday",
				TransferScheduleInterval = "weekly",
				TosAcceptanceDate = DateTime.Now,
				TosAcceptanceIp = GetLocalIPAddress(),
				LegalEntity = legalPayment
			};

			StripeAccount account = accountService.Create(accountOptions);
			user.Professional.AccountPayment = Mapper.Map<AccountPayment>(account);

			return Mapper.Map<AccountPayment>(account);

		}

		public AccountPayment UpdateAccountWithLegalEntity(IlevusUser user)
		{
			var accountLocal = Mapper.Map<AccountPayment>(user);
			var legalPayment = Mapper.Map<StripeAccountLegalEntityOptions>(accountLocal);

			var accountUpdateOptions = new StripeAccountUpdateOptions
			{
				TosAcceptanceDate = DateTime.Now,
				TosAcceptanceIp = GetLocalIPAddress(),
				LegalEntity = legalPayment
			};

			var account = accountService.Update(accountLocal.Id, accountUpdateOptions);
			return Mapper.Map<AccountPayment>(account);
		}

		public void AddBankAccount(string idStripeAccount, string token)
		{
			StripeAccountBankAccountOptions bankaccount = new StripeAccountBankAccountOptions();
			bankaccount.TokenId = token;
			var accountOptions = new StripeAccountUpdateOptions()
			{
				ExternalBankAccount = bankaccount
			};

			StripeAccount account = accountService.Update(idStripeAccount, accountOptions);

		}

		public void MakePayment(HireServiceModel model, IlevusUserManager userManager)
		{
			UserManager = userManager;
			IlevusUser professionalUser = RetrieveUserByService(model.service.Id);

			UserService servicoToHire = professionalUser.Professional.Services.FirstOrDefault(x => x.Id == model.service.Id);

			BuyAService(servicoToHire, model);

			// Verificando se o profissional ja tem conta no stripe. se nao tem se cria.
			AccountPayment accountStripe = CreateORetrieveStripeAccount(professionalUser);

			TransferToProfessional(servicoToHire.Price, accountStripe);
		}

		private static void TransferToProfessional(double priceService, AccountPayment accountStripe)
		{
			var valueIlevus = Math.Round(priceService, 2);
			// Faco a transferencia para o professional.
			var transferOptions = new StripeTransferCreateOptions()
			{
				Amount = Int32.Parse(valueIlevus.ToString()
					.Replace(",", string.Empty)
					.Replace(".", string.Empty)),
				Currency = "brl",
				Destination = accountStripe.Id,
				TransferGroup = "{ORDER10}",

			};

			var transferService = new StripeTransferService();
			transferService.Create(transferOptions);
		}

		private AccountPayment CreateORetrieveStripeAccount(IlevusUser professionalUser)
		{
			AccountPayment accountStripe = null;
			if (professionalUser.Professional.AccountPayment == null)
			{
				accountStripe = CreateAccount(professionalUser);
				professionalUser.Professional.AccountPayment = accountStripe;
				UserManager.Update(professionalUser);
			}

			return professionalUser.Professional.AccountPayment;
		}

		private void BuyAService(UserService servicoToHire, HireServiceModel payer)
		{
			var customer = CreateOrRetrieveAccountCustomer(payer);
			var finalPrice = PriceManager.FinalPrice(servicoToHire);
			var valueToPay = Int32.Parse(finalPrice.ToString()
				.Replace(",", string.Empty)
				.Replace(".", string.Empty));

			// Recebendo o dinheiro.
			var chargeOptions = new StripeChargeCreateOptions()
			{
				Amount = valueToPay,
				Currency = "brl",
				Description = servicoToHire.Name,
				CustomerId = customer.Id,
				TransferGroup = "{ORDER10}",
			};
			var chargeService = new StripeChargeService();

			PaymentsCustomer payment = new PaymentsCustomer
			{
				Customer = customer,
				Amount = valueToPay,
				PayDay = DateTime.Now
			};

			IlevusDBContext db =  IlevusDBContext.Create();
			db.GetPaymentsCustomerCollection().InsertOne(payment);

		}

		private static IlevusUser RetrieveUserByService(Guid serviceId)
		{

			IlevusDBContext db = IlevusDBContext.Create();

			return db.GetUsersCollection()
				.Find(x => x.Professional.Services
				.Any(y => y.Id == serviceId))
				.FirstOrDefault();
		}

		private AccountCustomer CreateOrRetrieveAccountCustomer(HireServiceModel model)
		{
			if (model.user.AccountCustumer == null)
			{
				var customerOptions = new StripeCustomerCreateOptions()
				{
					Email = model.user.Email,
					SourceToken = model.stripe.Id
				};
				var customerService = new StripeCustomerService();
				StripeCustomer customer = customerService.Create(customerOptions);

				model.user.AccountCustumer = Mapper.Map<AccountCustomer>(customer);
				UserManager.Update(model.user);
			}

			return model.user.AccountCustumer;
		}

		private static string GetLocalIPAddress()
		{
			var host = Dns.GetHostEntry(Dns.GetHostName());
			foreach (var ip in host.AddressList)
			{
				if (ip.AddressFamily == AddressFamily.InterNetwork)
				{
					return ip.ToString();
				}
			}
			throw new Exception("Local IP Address Not Found!");
		}
	}
}
