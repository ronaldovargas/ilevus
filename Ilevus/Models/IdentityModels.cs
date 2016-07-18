using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using ilevus.App_Start;
using ilevus.Enums;
using AspNet.Identity.MongoDB;
using MongoDB.Driver;
using ilevus.Helpers;
using System.Collections.Generic;

namespace ilevus.Models
{
    public class IlevusUser : IdentityUser
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Sex { get; set; }
        public DateTime Birthdate { get; set; }

        public string Address { get; set; }
        public string Complement { get; set; }
        public string District { get; set; }
        public string Zipcode { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string Country { get; set; }

        public UserProfessionalProfile Professional { get; set; }

        public string LinkedinProfileUrl { get; set; }

        public string Culture { get; set; }

        public string Image { get; set; }

        public DateTime Creation { get; set; }
        public UserType Type { get; set; }
        public EmailVisibility EmailVisibility { get; set; }
        public UserStatus Status { get; set; }

        public string SearchLanguage { get; set; }
        public double SearchRelevance { get; set; }

        public IlevusUser()
        {
            this.Type = UserType.Client;
            this.EmailVisibility = EmailVisibility.Public;
            this.Status = UserStatus.Active;
            this.Creation = DateTime.Now;
            this.SearchLanguage = "portuguese";
            this.Culture = CultureHelper.GetDefaultCulture();
            this.Professional = new UserProfessionalProfile();
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(IlevusUserManager manager, string authenticationType)
        {
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            userIdentity.AddClaim(new Claim(IlevusClaimTypes.UserCulture, this.Culture, ClaimValueTypes.String));

            return userIdentity;
        }
        
    }

    public class UserProfessionalProfile
    {
        public UserProfessionalProfile()
        {
            BasicInfo = false;
            EducationInfo = false;
            CareerInfo = false;
            ServicesInfo = false;
        }

        // Wizard steps concluded?
        public bool BasicInfo { get; set; }
        public bool EducationInfo { get; set; }
        public bool CareerInfo { get; set; }
        public bool ServicesInfo { get; set; }

        // Basic professional info
        public string Headline { get; set; }
        public string Industry { get; set; }
        public string Specialties { get; set; }
        public string Summary { get; set; }
        public IEnumerable<string> SpokenLanguages { get; set; }

        // Education info
        public IEnumerable<UserEducation> Education { get; set; }

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