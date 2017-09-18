using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Identity.MongoDB;
using ilevus.Enums;
using ilevus.Helpers;
using MongoRepository;

namespace ilevus.Models
{
	public class IlevusUser : IdentityUser, IEntity<string>
	{
		public string Name { get; set; }
		public string Surname { get; set; }
		public string Sex { get; set; }
		public DateTime Birthdate { get; set; }

		public UserScheduleConfig ScheduleConfig { get; set; }
		public UserProfessionalProfile Professional { get; set; }
		public UserPremiumMembership Premium { get; set; }
		public bool IsProfessional { get; set; }

		public string LinkedinProfileUrl { get; set; }

		public string Culture { get; set; }

		public string Image { get; set; }

		public DateTime Creation { get; set; }
		public UserType Type { get; set; }
		public EmailVisibility EmailVisibility { get; set; }
		public UserStatus Status { get; set; }

		public string SearchLanguage { get; set; }
		public double SearchRelevance { get; set; }

		public string EmailChangeToken { get; set; }
		public string EmailChange { get; set; }

		public List<string> Favorites { get; set; }

		public IlevusUser()
		{
			this.Type = UserType.Client;
			this.EmailVisibility = EmailVisibility.Public;
			this.Status = UserStatus.Active;
			this.Creation = DateTime.Now;
			this.SearchLanguage = "portuguese";
			this.Culture = CultureHelper.GetDefaultCulture();
			this.ScheduleConfig = new UserScheduleConfig();
			this.Professional = new UserProfessionalProfile();
			this.IsProfessional = false;
			this.Favorites = new List<string>();
		}
	}
}
