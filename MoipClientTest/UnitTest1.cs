using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using RestSharp;
using ilevus.MoipClient.Models;
using FizzWare.NBuilder;
using RestSharp.Authenticators;
using RestSharp.Extensions.MonoHttp;
using System.Net;
using System.Diagnostics;
using System.Collections.Specialized;
using ilevus.MoipClient.Implementation;

namespace MoipClientTest
{
	[TestClass]
	public class UnitTest1
	{
		[TestMethod]
		public void testGet()
		{
			var client = new MoipApiClient();
			client.Get("APP-ZMOLXLHH7YZ7", "http://4af95bf3.ngrok.io/moipcallback");
		}

		[TestMethod]
		public void TestMethod1()
		{
			Random rand = new Random();
			var cpf = CpfUtils.GerarCpf();
			var client = new MoipApiClient();
			var conta = Builder<ContaMoip>.CreateNew()
				.With(x => x.Person = Builder<Person>.CreateNew()
							.With(y => y.TaxDocument = new TaxDocument { Number = cpf })
							.And(y => y.IdentityDocument = Builder<IdentityDocument>.CreateNew()
										.With(z => z.IssueDate = "2000-12-12")
										.And(z => z.Issuer = "SSP")
										.And(z => z.Number = "434322344").Build())
							.And(y => y.Phone = new Phone
							{
								AreaCode = "85",
								Number = "999738004"
							})
							.And(y => y.Address = new Address
							{
								City = "Fortaleza",
								State = "ce",
								Street = "Rua tal",
								StreetNumber = "1",
								District = "Boa Vista",
								ZipCode = "60861140"
							})
							.And(y => y.BirthDate = "1990-01-01")
						.Build())
						.And(x => x.AccessToken = null)
						.And(x => x.createdAt = null)
						.And(x => x.Login = null)
				.And(y => y.Email = new Email($"eugenio{rand.Next(30, 1000)}@gmail.com"))
				.Build();
			conta.Id = Guid.NewGuid().ToString();

			var teste = client.CriarContaMoip(conta).Result;
			//var contaCompleta = client.ConsultarContaMoip(teste.Id).Result;

			var t2 = client.CriarSenha(teste);
			var te1 = client.LogarViaHtml(teste.Login, "https://connect-sandbox.moip.com.br/oauth/authorize?response_type=code&client_id=APP-5Z9IAV7C1RSL&redirect_uri=http://272bed72.ngrok.io/moipcallback&scope=RECEIVE_FUNDS");

			client.AutorizarUso("https://connect-sandbox.moip.com.br/oauth/authorize?response_type=code&client_id=APP-5Z9IAV7C1RSL&redirect_uri=http://272bed72.ngrok.io/moipcallback&scope=RECEIVE_FUNDS");
			var contabancaria = new ContaBancaria
			{
				AccountId = teste.Id,
				BankNumber = "1",
				AccountNumber = "35003-6",
				AgencyNumber = "29378",
				Holder = new Holder
				{
					fullname = "Eugenio Tavares Silva Filho",
					taxDocument = new TaxDocument
					{
						Number = cpf
					}
				}

			};

			client.Get("APP-5Z9IAV7C1RSL", "http://272bed72.ngrok.io/moipcallback");

			var clientBankAccount = new MoipApiClient(teste.AccessToken);
			var contaBancariaCriada = clientBankAccount.CriarContaBancaria(contabancaria).Result;

			Assert.IsTrue(true);
		}

	}

	public static class CpfUtils
	{
		public static String GerarCpf()
		{
			int soma = 0, resto = 0;
			int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
			int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

			Random rnd = new Random();
			string semente = rnd.Next(100000000, 999999999).ToString();

			for (int i = 0; i < 9; i++)
				soma += int.Parse(semente[i].ToString()) * multiplicador1[i];

			resto = soma % 11;
			if (resto < 2)
				resto = 0;
			else
				resto = 11 - resto;

			semente = semente + resto;
			soma = 0;

			for (int i = 0; i < 10; i++)
				soma += int.Parse(semente[i].ToString()) * multiplicador2[i];

			resto = soma % 11;

			if (resto < 2)
				resto = 0;
			else
				resto = 11 - resto;

			semente = semente + resto;
			return semente;
		}
	}
}
