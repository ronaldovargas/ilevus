using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Identity.MongoDB;
using ilevus.App_Start;
using ilevus.Enums;
using ilevus.Helpers;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using Newtonsoft.Json;
using System.Linq;

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

	public class UserScheduleConfig
	{
		public bool Enabled { get; set; }
		public int Interval { get; set; }
		public int Antecedence { get; set; }
		public string HourConfig { get; set; }

		public UserScheduleConfig()
		{
			this.Enabled = false;
			this.Interval = 30;
			this.Antecedence = 12;
			this.HourConfig = "[]";
		}
	}

	public class UserPremiumMembership
	{
		public bool Active { get; set; }
		public bool Late { get; set; }
		public bool Suspended { get; set; }
		public DateTime PayedUntil { get; set; }
	}

	public class BankAccount
	{
		public string BankNumber { get; set; }
		public string AgencyNumber { get; set; }
		public string AgencyCheckNumber { get; set; }
		public string AccountNumber { get; set; }
		public string AccountCheckNumber { get; set; }
		public string Token { get; set; }

	}

	public class PhoneModel
	{
		public string CountryCode { get; } = "55";

		private string areaCode;
		public string AreaCode
		{
			get { return areaCode; }
			set {
                try
                {
                    areaCode = new string(value.Where(c => char.IsDigit(c)).ToArray());
                } catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    areaCode = string.Empty;
                }
            }
		}

		public string Number { get; set; }
	}

	public class UserEducation
	{
		public bool Finished { get; set; }
		public string Institution { get; set; }
		public string Area { get; set; }
		public string Type { get; set; }
		public string Begin { get; set; }
		public string End { get; set; }
		public string Description { get; set; }
	}

	public class UserCareer
	{
		public bool Finished { get; set; }
		public string Institution { get; set; }
		public string Role { get; set; }
		public string Location { get; set; }
		public string Begin { get; set; }
		public string End { get; set; }
		public string Description { get; set; }
	}

	public class UserService
	{
		[BsonId(IdGenerator = typeof(GuidGenerator))]
		public Guid Id { get; set; }
		public string Name { get; set; }
		public double Price { get; set; }
		public double FinalPrice { get; set; }
	}

	public class IlevusRole : IdentityRole
	{
		public string Description { get; set; }

		public IlevusRole()
		{
		}

		public IlevusRole(string name)
			: this()
		{
			this.Name = name;
		}

	}


	public class IlevusUserClaim : IdentityUserClaim { }

	public class IlevusUserStore : UserStore<IlevusUser>
	{
		public IlevusUserStore(IlevusIdentityContext context)
			: base(new UsersContext<IlevusUser>(context.Users))
		{
		}
	}

	public class IlevusRoleStore : RoleStore<IlevusRole>
	{
		public IlevusRoleStore(IlevusIdentityContext context)
			: base(new RolesContext<IlevusRole>(context.Roles))
		{
		}
	}
}
