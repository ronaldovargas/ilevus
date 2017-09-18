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

		public AccountPayment CreateAccount(IlevusUser user)
		{
			var accountLocal = Mapper.Map<AccountPayment>(user);

			var accountOptions = new StripeAccountCreateOptions()
			{
				Email = accountLocal.Email,
				Type = StripeAccountType.Custom,
				Country = accountLocal.Country,
				DefaultCurrency = accountLocal.DefaultCurrency
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

		public void AddBankAccount()
		{

		}

		public void MakePayment(HireServiceModel model, IlevusUserManager userManager)
		{


			IlevusDBContext db = IlevusDBContext.Create();

			// Recuperar o profissional que tem aquele servico.
			IlevusUser professional = db.GetUsersCollection()
				.Find(x => x.Professional.Services
					.Any(y => y.Id == model.service.Id))
				.FirstOrDefault();
			UserService servicoToHire = professional.Professional.Services.FirstOrDefault(x => x.Id == model.service.Id);

			// Calcula o preco final.
			var finalPrice = PriceManager.FinalPrice(servicoToHire);
			var valueToPay = Int32.Parse(finalPrice.ToString()
				.Replace(",", string.Empty)
				.Replace(".", string.Empty));

			// Calcula o valor para transferir.
			var valueIlevus = Math.Round(servicoToHire.Price, 2);

			// Recebendo o dinheiro.
			var chargeOptions = new StripeChargeCreateOptions()
			{
				Amount = valueToPay,
				Currency = "brl",
				Description = servicoToHire.Name,

				SourceTokenOrExistingSourceId = model.stripe.Id,
				TransferGroup = "{ORDER10}",
			};
			var chargeService = new StripeChargeService();
			StripeCharge charge = chargeService.Create(chargeOptions);

			// Verificando se o profissional ja tem conta no stripe. se nao tem se cria.
			AccountPayment accountStripe = professional.Professional.AccountPayment ?? CreateAccount(professional);
			professional.Professional.AccountPayment = accountStripe;
			userManager.Update(professional);

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

		public Customer CreateCustomer()
		{
			//var customerOptions = new StripeCustomerCreateOptions()
			//{
			//	Description = "Customer for zoey.wilson@example.com",
			//	SourceToken = "tok_amex"
			//};

			//StripeCustomer customer = customerService.Create(customerOptions);
			//return Mapper.Map<Customer>(customer);
			return null;
		}

		public void SaveCreditCard()
		{

			//var tokenOptions = new StripeTokenCreateOptions()
			//{
			//	Card = new StripeCreditCardOptions()
			//	{
			//		Number = "4242424242424242",
			//		ExpirationYear = 2018,
			//		ExpirationMonth = 9,
			//		Cvc = "123"
			//	}
			//};

			//var tokenService = new StripeTokenService();
			//StripeToken stripeToken = tokenService.Create(tokenOptions);
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
