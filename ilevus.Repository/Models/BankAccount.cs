using MongoRepository;

namespace ilevus.Models
{
	public class BankAccount
	{
		public string BankNumber { get; set; }
		public string AgencyNumber { get; set; }
		public string AgencyCheckNumber { get; set; }
		public string AccountNumber { get; set; }
		public string AccountCheckNumber { get; set; }

	}
}