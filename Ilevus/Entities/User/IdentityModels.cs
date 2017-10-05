using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Identity.MongoDB;
using ilevus.App_Start;
using ilevus.Enums;
using ilevus.Helpers;
using Newtonsoft.Json;

namespace ilevus.Models
{
	public class IlevusUser : IdentityUser
	{
		public string Name { get; set; }
		public string Surname { get; set; }
		public string Sex { get; set; }

		private DateTime birthdate;
		public DateTime Birthdate
		{
			get
			{
				return string.IsNullOrEmpty(this.Professional.BirthDate) ? birthdate : DateTime.Parse(this.Professional.BirthDate);
			}
			set
			{
				birthdate = value;
			}
		}

		public UserScheduleConfig ScheduleConfig { get; set; }
		public UserProfessionalEntity Professional { get; set; }
		public UserPremiumMembership Premium { get; set; }
		public bool IsProfessional { get; set; }
		public AccountCustomer AccountCustumer { get; set; }
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
			this.Professional = new UserProfessionalEntity();
			this.IsProfessional = false;
			this.Favorites = new List<string>();
		}

		public async Task<ClaimsIdentity> GenerateUserIdentityAsync(IlevusUserManager manager, string authenticationType)
		{
			var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
			// Add custom user claims here
			userIdentity.AddClaim(new Claim(IlevusClaimTypes.UserCulture, this.Culture, ClaimValueTypes.String));

			return userIdentity;
		}

	}
}
