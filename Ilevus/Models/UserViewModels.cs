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
        public PublicProfileViewModel(IlevusUser user)
        {
            Id = user.Id;
            Creation = user.Creation;
            Image = user.Image;
            Name = user.Name;
            Sex = user.Sex;
            Surname = user.Surname;
            
            City = user.City;
            County = user.County;
            Country = user.Country;

            EmailVisibility = user.EmailVisibility;
            Type = user.Type;
        }
        public string Id { get; set; }

        public string Name { get; set; }
        public string Surname { get; set; }
        public string Sex { get; set; }
        
        public string City { get; set; }
        public string County { get; set; }
        public string Country { get; set; }

        public string Image { get; set; }
        public DateTime Creation { get; set; }

        public UserType Type { get; set; }
        public EmailVisibility EmailVisibility { get; set; }
    }

    public class UserInfoViewModel
    {
        public UserInfoViewModel(IlevusUser user)
        {
            Id = user.Id;
            Email = user.Email;
            Birthdate = user.Birthdate;
            Creation = user.Creation;
            EmailVisibility = user.EmailVisibility;
            Image = user.Image;
            Name = user.Name;
            PhoneNumber = user.PhoneNumber;
            Sex = user.Sex;
            Status = user.Status;
            Surname = user.Surname;
            Type = user.Type;
            
            Address = user.Address;
            City = user.City;
            Complement = user.Complement;
            County = user.County;
            Country = user.Country;
            District = user.District;
            Zipcode = user.Zipcode;
        }
        public string Id { get; set; }
        public string Email { get; set; }
        public bool HasRegistered { get; set; }
        public string LoginProvider { get; set; }

        public string Name { get; set; }
        public string Surname { get; set; }
        public string Sex { get; set; }
        public DateTime Birthdate { get; set; }
        public string PhoneNumber { get; set; }

        public string Address { get; set; }
        public string City { get; set; }
        public string Complement { get; set; }
        public string County { get; set; }
        public string Country { get; set; }
        public string District { get; set; }
        public string Zipcode { get; set; }

        public string Image { get; set; }
        public DateTime Creation { get; set; }

        public UserType Type { get; set; }
        public EmailVisibility EmailVisibility { get; set; }
        public UserStatus Status { get; set; }

        public IEnumerable Permissions { get; set; }
    }

    public class UserLoginInfoViewModel
    {
        public string LoginProvider { get; set; }

        public string ProviderKey { get; set; }
    }
}
