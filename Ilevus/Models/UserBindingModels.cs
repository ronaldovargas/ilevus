using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using ilevus.Resources;
using System.Collections.Generic;

namespace ilevus.Models
{
    // Models used as parameters to AccountController actions.

    public class PermissionBindingModel
    {
        public string Permission { get; set; }
    }

    public class AddExternalLoginBindingModel
    {
        public string ExternalAccessToken { get; set; }
    }
    
    public class ConfirmEmailBindingModel
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }

    public class ChangeCultureBindingModel
    {
        public string Culture { get; set; }
    }

    public class ChangeEmailBindingModel
    {
        public string Email { get; set; }
    }

    public class ChangePasswordBindingModel
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class RecoverPasswordViewModel
    {
        public string Email { get; set; }
    }

    public class ResetPasswordBindingModel
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }

    public class RegisterBindingModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
    }

    public class ProfileBindingModel
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Sex { get; set; }
        public DateTime Birthdate { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class AddressBindingModel
    {
        public string Address { get; set; }
        public string Complement { get; set; }
        public string District { get; set; }
        public string Zipcode { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string Country { get; set; }
        public string StreetNumber { get; set; }
	}

    public class ProfessionalBindingModel
    {
        // Basic professional info
        public string Headline { get; set; }
        public string Industry { get; set; }
        public string Specialties { get; set; }
        public string Summary { get; set; }

		public DateTime BirthDate { get; set; }

		public IEnumerable<string> SpokenLanguages { get; set; }

        public IEnumerable<UserEducation> Education { get; set; }

        public IEnumerable<UserCareer> Career { get; set; }

        public IEnumerable<UserService> Services { get; set; }

		public PhoneModel Phone { get;  set; }

		public UserFinancialProfile Financial  { get; set; }
	}

    public class RegisterExternalBindingModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Provider { get; set; }

        [Required]
        public string ExternalAccessToken { get; set; }

    }

    public class RemoveLoginBindingModel
    {
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
    }

    public class SetPasswordBindingModel
    {
        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "New password")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm new password")]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
