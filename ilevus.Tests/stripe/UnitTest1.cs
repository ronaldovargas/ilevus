using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Stripe;

namespace ilevus.Tests.stripe
{
	[TestClass]
	public class UnitTest1
	{
		[TestMethod]
		public void TestMethod1()
		{
			try
			{

				StripeConfiguration.SetApiKey("sk_test_oUBTbeU0cX5yhj2bq0g1l1qS");

				//var accountOptions = new StripeAccountCreateOptions()
				//{
				//	Email = "bob@example.com",
				//	Type = StripeAccountType.Custom,
				//	Country = "BR"
				//};

				//var accountService = new StripeAccountService();
				//StripeAccount account = accountService.Create(accountOptions);

				var chargeOptions = new StripeChargeCreateOptions()
				{
					Amount = 2000,
					Currency = "brl",
					Description = "Charge for aiden.davis@example.com",
					SourceCard = new SourceCard
					{
						Number = "4000 0000 0000 0077",
						ExpirationYear = 2020,
						ExpirationMonth =01
					},

					TransferGroup = "{ORDER10}",
				};
				var chargeService = new StripeChargeService();
				StripeCharge charge = chargeService.Create(chargeOptions);


				var transferOptions = new StripeTransferCreateOptions()
				{
					Amount = 400,
					Currency = "USD",
					Destination = "acct_1AwHpBBnTjJq2v5j",
					TransferGroup = "{ORDER10}",
					
				};


				// Criar um historico local de compras.
				// Id do usuario do comprador, Servico.
				// Id Ilevus, Id Servico, [avaliado].
				// 

				var transferService = new StripeTransferService();
				StripeTransfer stripeTransfer = transferService.Create(transferOptions);

				var transferOptions2 = new StripeTransferCreateOptions()
				{
					Amount = 400,
					Currency = "brl",
					Destination = "acct_1AwI9NGmE0vnHTPo",
					TransferGroup = "{ORDER10}"
				};

				var transferService2 = new StripeTransferService();
				StripeTransfer stripeTransfer2 = transferService.Create(transferOptions2);

			}
			catch (Exception e)
			{

				throw;
			}
			Assert.IsTrue(true);
		}
	}
}
