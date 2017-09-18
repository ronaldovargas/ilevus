namespace ilevus.Models
{
	public class UserFinancialProfile
	{
		public UserFinancialProfile()
		{
			IdentityDocument = new IdentityDocumentModel();
			BankAccount = new BankAccount();
		}
		// Document info
		public string TaxDocument { get; set; }
		public IdentityDocumentModel IdentityDocument { get; set; }
		public BankAccount BankAccount { get; set; }
	}
}