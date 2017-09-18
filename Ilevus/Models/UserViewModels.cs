using ilevus.Enums;
using System;
using System.Collections;
using System.Collections.Generic;

namespace ilevus.Models
{
	// Models returned by AccountController actions.

	public class ExternalLoginViewModel
	{
		public string Name { get; set; }

		public string Url { get; set; }

		public string State { get; set; }
	}

	public class ManageInfoViewModel
	{
		public string LocalLoginProvider { get; set; }

		public string Email { get; set; }

		public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

		public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
	}

	public class PublicProfileViewModel
	{
		public PublicProfileViewModel(IlevusUser user, int qtdeAssessments = 0, int mediaAssessments = 0)
		{
			Id = user.Id;
			Creation = user.Creation;
			Culture = user.Culture;
			Image = user.Image;
			Name = user.Name;
			Sex = user.Sex;
			Surname = user.Surname;
			PhoneNumber = user.PhoneNumber;

            Assessments = qtdeAssessments;
            MediaRating = mediaAssessments;

            ScheduleConfig = user.ScheduleConfig;
			Professional = new ProfessionalProfileViewModel(user);

			LinkedinProfileUrl = user.LinkedinProfileUrl;

			EmailVisibility = user.EmailVisibility;
			Type = user.Type;
		}
		public string Id { get; set; }

		public string Name { get; set; }
		public string Surname { get; set; }
		public string Sex { get; set; }
		public string PhoneNumber { get; set; }


		public string City { get; set; }
		public string County { get; set; }
		public string Country { get; set; }

		public UserScheduleConfig ScheduleConfig { get; set; }
		public ProfessionalProfileViewModel Professional { get; set; }

		public string LinkedinProfileUrl { get; set; }

		public string Culture { get; set; }
		public string Image { get; set; }
		public DateTime Creation { get; set; }

        public int? Assessments { get; set; }
        public int? MediaRating { get; set; }

        public UserType Type { get; set; }
		public EmailVisibility EmailVisibility { get; set; }
	}

	public class UserInfoViewModel
	{
		public UserInfoViewModel(IlevusUser user)
		{
			Id = user.Id;
			Email = user.Email;
			EmailChange = user.EmailChange;
			EmailConfirmed = user.EmailConfirmed;
			Birthdate = user.Birthdate;
			Creation = user.Creation;
			Culture = user.Culture;
			EmailVisibility = user.EmailVisibility;
			Image = user.Image;
			Name = user.Name;
			PhoneNumber = user.PhoneNumber;
			Sex = user.Sex;
			Status = user.Status;
			Surname = user.Surname;
			Type = user.Type;

			Favorites = user.Favorites;

			ScheduleConfig = user.ScheduleConfig;
			Professional = new ProfessionalProfileViewModel(user);
			Premium = user.Premium;
			IsProfessional = user.IsProfessional;

		}
		public string Id { get; set; }
		public string Email { get; set; }
		public string EmailChange { get; set; }
		public bool EmailConfirmed { get; set; }
		public bool HasRegistered { get; set; }
		public string LoginProvider { get; set; }

		public string Name { get; set; }
		public string Surname { get; set; }
		public string Sex { get; set; }
		public DateTime Birthdate { get; set; }
		public string PhoneNumber { get; set; }

		public UserScheduleConfig ScheduleConfig { get; set; }
		public ProfessionalProfileViewModel Professional { get; set; }
		public UserPremiumMembership Premium { get; set; }
		public bool IsProfessional { get; set; }

		public string Culture { get; set; }
		public string Image { get; set; }
		public DateTime Creation { get; set; }

		public UserType Type { get; set; }
		public EmailVisibility EmailVisibility { get; set; }
		public UserStatus Status { get; set; }

		public IEnumerable<string> Favorites { get; set; }

		public IEnumerable Permissions { get; set; }
		public IEnumerable Claims { get; set; }
	}

	public class ProfessionalProfileViewModel
	{
		public ProfessionalProfileViewModel(IlevusUser user)
		{
			Id = user.Id;
			this.BirthDate = user.Birthdate.ToString("dd/MM/yyyy");
			Professional = user.Professional ?? new UserProfessionalEntity();
			Professional.BirthDate = this.BirthDate;
		}

		public string BirthDate { get; set; }
		public string Id { get; set; }
		public UserProfessionalEntity Professional { get; set; }
	}


	public class UserLoginInfoViewModel
	{
		public string LoginProvider { get; set; }

		public string ProviderKey { get; set; }
	}
}
