using System;

namespace ilevus.Models
{
	public class PaymentsCustomer 
	{
		public string Id { get; set; }
		public AccountCustomer Customer { get; set; }
		public decimal Amount { get; set; }
		public DateTime PayDay { get; set; }
	}
}
