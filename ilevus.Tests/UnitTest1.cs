//using System;
//using System.Net;
//using System.Net.Sockets;
//using AutoMapper;
//using ilevus.App_Start;
//using ilevus.Controllers;
//using ilevus.Maps;
//using ilevus.Models;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using Stripe;

//namespace ilevus.Tests
//{
//	[TestClass]
//	public class UnitTest1
//	{

//		[TestMethod]
//		public void TestMethod1()
//		{
//			try
//			{
//				IlevusUserManager controller = new IlevusUserManager(new IlevusUserStore(IlevusIdentityContext.Create()));
//				var user = controller.FindByNameAsync("eugenio05@gmail.com").Result;
//				StripeConfiguration.SetApiKey("sk_test_oUBTbeU0cX5yhj2bq0g1l1qS");

//				Mapper.Initialize(x => x.AddProfile(typeof(PaymentAccountProfile)));

//				var accountLocal = Mapper.Map<AccountPayment>(user);
//				var legalPayment = Mapper.Map<StripeAccountLegalEntityOptions>(accountLocal);

//				var accountService = new StripeAccountService();
//				var accountOptions = new StripeAccountCreateOptions()
//				{
//					Email = accountLocal.Email,
//					Type = StripeAccountType.Custom,
//					Country = accountLocal.Country,
//					DefaultCurrency = accountLocal.DefaultCurrency
//				};

//				//StripeAccount account = accountService.Create(accountOptions);
//				var account = accountService.Get("acct_1AxluGF5qM0zeKSO");


//				var accountUpdateOptions = new StripeAccountUpdateOptions
//				{
//					TosAcceptanceDate = DateTime.Now,
//					TosAcceptanceIp= GetLocalIPAddress(),
//					LegalEntity = legalPayment
//				};

//				account = accountService.Update("acct_1AxluGF5qM0zeKSO", accountUpdateOptions);

//				// //account = accountService.Update("acct_1AxluGF5qM0zeKSO", accountUpdateOptions2);

//				//var chargeOptions = new StripeChargeCreateOptions()
//				//{
//				//	Amount = 2000,
//				//	Currency = "brl",
//				//	Description = "Charge for aiden.davis@example.com",
//				//	SourceCard = new SourceCard
//				//	{
//				//		Number = "4000 0000 0000 0077",
//				//		ExpirationYear = 2020,
//				//		ExpirationMonth = 01
//				//	},

//				//	TransferGroup = "{ORDER10}",
//				//};
//				//var chargeService = new StripeChargeService();
//				//StripeCharge charge = chargeService.Create(chargeOptions);


//				//var transferOptions = new StripeTransferCreateOptions()
//				//{
//				//	Amount = 400,
//				//	Currency = "USD",
//				//	Destination = "acct_1AwHpBBnTjJq2v5j",
//				//	TransferGroup = "{ORDER10}",

//				//};


//				// Criar um historico local de compras.
//				// Id do usuario do comprador, Servico.
//				// Id Ilevus, Id Servico, [avaliado].
//				//

//				//var transferService = new StripeTransferService();
//				//StripeTransfer stripeTransfer = transferService.Create(transferOptions);

//				//var transferOptions2 = new StripeTransferCreateOptions()
//				//{
//				//	Amount = 400,
//				//	Currency = "brl",
//				//	Destination = "acct_1AwI9NGmE0vnHTPo",
//				//	TransferGroup = "{ORDER10}"
//				//};

//				//var transferService2 = new StripeTransferService();
//				//StripeTransfer stripeTransfer2 = transferService.Create(transferOptions2);

//			}
//			catch (Exception e)
//			{

//				throw;
//			}
//			Assert.IsTrue(true);
//		}
//		public static string GetLocalIPAddress()
//		{
//			var host = Dns.GetHostEntry(Dns.GetHostName());
//			foreach (var ip in host.AddressList)
//			{
//				if (ip.AddressFamily == AddressFamily.InterNetwork)
//				{
//					return ip.ToString();
//				}
//			}
//			throw new Exception("Local IP Address Not Found!");
//		}
//	}
//}
