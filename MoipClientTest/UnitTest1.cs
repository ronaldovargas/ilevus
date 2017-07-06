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
                            .With(y => y.TaxDocument = new TaxDocument { Type = "CPF", Number = "61427233349" })
                            .And(y => y.IdentityDocument = Builder<IdentityDocument>.CreateNew().Build())
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
                                Country = "BRA",
                                StreetNumber = "1",
                                District = "Boa Vista",
                                ZipCode = "60861140"
                            })
                            .And(y => y.BirthDate = "1986-05-08")
                        .Build())
                .And(y => y.Email = new Email("eugenio12@gmail.com"))
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
                        Type = "CPF",
                        Number = "61427233349"
                    }
                }

            };

            var contaBancariaCriada = client.CriarContaBancaria(contabancaria).Result;

            Assert.IsTrue(true);
        }
    }
}
