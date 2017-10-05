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
}
