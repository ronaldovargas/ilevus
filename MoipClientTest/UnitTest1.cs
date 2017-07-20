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
        public void TestMethod1()
        {
            var client = new MoipApiClient();
            var conta = Builder<ContaMoip>.CreateNew()
                .With(x => x.Person = Builder<Person>.CreateNew()
							.With(y => y.TaxDocument = new TaxDocument { Number = "68501617504" })
                            .And(y => y.IdentityDocument = Builder<IdentityDocument>.CreateNew()
										.With(z=> z.IssueDate="2000-12-12")
										.And(z=> z.Issuer="SSP")
										.And(z=>z.Number= "434322344").Build())
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
				.And(y => y.Email = new Email("eugenio18@gmail.com"))
                .Build();
            conta.Id = Guid.NewGuid().ToString();

            var teste = client.CriarContaMoip(conta).Result;
            var contaCompleta = client.ConsultarContaMoip(teste.Id).Result;

            var contabancaria = new ContaBancaria
            {
                AccountId = contaCompleta.Id,
                BankNumber = "1",
                AccountNumber = "35003-6",
                AgencyNumber = "29378",
                Holder = new Holder
                {
                    fullname = "Eugenio Tavares Silva Filho",
                    taxDocument = new TaxDocument
                    {
                        Number = "68501617504"
					}
                }

            };

			var clientBankAccount = new MoipApiClient(conta.AccessToken);
			var contaBancariaCriada = clientBankAccount.CriarContaBancaria(contabancaria).Result;

            Assert.IsTrue(true);
        }
    }
}
