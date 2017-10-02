using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ilevus.Models
{
	public class AccountPayment
	{
		public string Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public DateTime DateBirth { get; set; }
		public string Email { get; set; }
		public Address Address { get; set; }
		public string PersonalIdNumber { get; set; }
		public string Country { get; set; }
		public string DefaultCurrency { get; set; }
		public CustomAccountKeys CustomAccountKeys { get; set; }
	}

	public class CustomAccountKeys
	{
		public string Secret { get; set; }
		public string Publishable { get; set; }
	}

	public class Address
	{
		public string City { get; set; }
		public string Country { get; set; }
		public string Line1 { get; set; }
		public string Line2 { get; set; }
		public string PostalCode { get; set; }
		public string State { get; set; }
	}

	public class AccountCustomer
	{
		public string Id { get; set; }
		public string Email { get; set; }
		public string Description { get; set; }
	}

	public class PaymentsCustomer
	{
		public string Id { get; set; }
		public AccountCustomer Customer { get; set; }
		public decimal Amount { get; set; }
		public DateTime PayDay { get; set; }
	}
}