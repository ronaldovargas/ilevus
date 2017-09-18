using System.Collections.Generic;
using ilevus.Models.CoachingTools;
using MongoRepository;

namespace ilevus.Models
{
	public class UserProfessionalProfile
	{
		public UserProfessionalProfile()
		{
			BasicInfo = false;
			AddressInfo = false;
			EducationInfo = false;
			CareerInfo = false;
			ServicesInfo = false;
			ServicesInfo = false;
			BankAccountInfo = false;
			MoipInfo = false;
			ProcessSteps = new List<CoachingProcessStep>();
			CoachingToolsConfigs = new CoachingToolsConfigurations();
			Financial = new UserFinancialProfile();
			Phone = new PhoneModel();
		}

		// Wizard steps concluded?
		public bool BasicInfo { get; set; }
		public bool AddressInfo { get; set; }
		public bool EducationInfo { get; set; }
		public bool CareerInfo { get; set; }
		public bool ServicesInfo { get; set; }
		public bool BankAccountInfo { get; set; }
		public bool MoipInfo { get; set; }

		// Basic professional info
		public string Headline { get; set; }
		public string Industry { get; set; }
		public string Specialties { get; set; }
		public string Summary { get; set; }
		public IEnumerable<string> SpokenLanguages { get; set; }
		public string BirthDate { get; set; }

		// Address info
		public string Address { get; set; }
		public string Complement { get; set; }
		public string District { get; set; }
		public string Zipcode { get; set; }
		public string City { get; set; }
		public string County { get; set; }
		public string Country { get; set; }

		// Education info
		public IEnumerable<UserEducation> Education { get; set; }

		// Education info
		public IEnumerable<UserCareer> Career { get; set; }

		// Education info
		public IEnumerable<UserService> Services { get; set; }

		// Passos do processo de coaching
		public List<CoachingProcessStep> ProcessSteps { get; set; }

		public CoachingToolsConfigurations CoachingToolsConfigs { get; set; }

		public PhoneModel Phone { get; set; }

		public UserFinancialProfile Financial { get; set; }

		//public ContaMoip MoipAccount { get; set; }
		public string StreetNumber { get; set; }
	}
}