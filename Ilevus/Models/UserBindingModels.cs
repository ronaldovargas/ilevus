using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using ilevus.Resources;

namespace ilevus.Models
{
    // Models used as parameters to AccountController actions.

    public class PermissionBindingModel
    {
        [Required]
        [Display(Name = "Permission")]
        public string Permission { get; set; }
    }

    public class AddExternalLoginBindingModel
    {
        [Required]
        [Display(Name = "External access token")]
        public string ExternalAccessToken { get; set; }
    }
    
    public class ConfirmEmailBindingModel
    {
        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelEmail")]
        public string Email { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(Name = "Confirmation code")]
        public string Code { get; set; }
    }

    public class ChangePasswordBindingModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Current password")]
        public string OldPassword { get; set; }

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

    public class RecoverPasswordViewModel
    {
        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelEmail")]
        public string Email { get; set; }
    }

    public class ResetPasswordBindingModel
    {
        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelEmail")]
        public string Email { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(Name = "Validation code")]
        public string Code { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [StringLength(100, MinimumLength = 6, ErrorMessageResourceName = "ValidationStringLengthMin", ErrorMessageResourceType = typeof(Messages))]
        [DataType(DataType.Password)]
        [Display(ResourceType = typeof(Messages), Name = "LabelPassword")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(ResourceType = typeof(Messages), Name = "LabelPasswordConfirm")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

    public class RegisterBindingModel
    {
        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelEmail")]
        public string Email { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [StringLength(100, MinimumLength = 6, ErrorMessageResourceName = "ValidationStringLengthMin", ErrorMessageResourceType = typeof(Messages))]
        [DataType(DataType.Password)]
        [Display(ResourceType = typeof(Messages), Name = "LabelPassword")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(ResourceType = typeof(Messages), Name = "LabelPasswordConfirm")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelName")]
        public string Name { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelSurname")]
        public string Surname { get; set; }
    }

    public class ProfileBindingModel
    {
        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelEmail")]
        public string Email { get; set; }
        
        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelName")]
        public string Name { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelSurname")]
        public string Surname { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelSex")]
        public string Sex { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelBirthdate")]
        public DateTime Birthdate { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelPhoneNumber")]
        public string PhoneNumber { get; set; }
    }

    public class AddressBindingModel
    {
        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelAddress")]
        public string Address { get; set; }

        public string Complement { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelDistrict")]
        public string District { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelZipcode")]
        public string Zipcode { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelCity")]
        public string City { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelCounty")]
        public string County { get; set; }

        [Required(ErrorMessageResourceType = typeof(Messages), ErrorMessageResourceName = "ValidationRequired")]
        [Display(ResourceType = typeof(Messages), Name = "LabelCountry")]
        public string Country { get; set; }
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
        [Required]
        [Display(Name = "Login provider")]
        public string LoginProvider { get; set; }

        [Required]
        [Display(Name = "Provider key")]
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
