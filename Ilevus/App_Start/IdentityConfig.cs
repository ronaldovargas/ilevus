using ElCamino.AspNet.Identity.Dynamo;
using ilevus.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace ilevus.App_Start
{
    public class IlevusUserManager : UserManager<IlevusUser, string>
    {
        public IlevusUserManager(IlevusUserStore store)
            : base(store)
        {
        }

        public static IlevusUserManager Create(
            IdentityFactoryOptions<IlevusUserManager> options,
            IOwinContext context)
        {
            var manager = new IlevusUserManager(new IlevusUserStore(context.Get<IlevusDbContext>()));

            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<IlevusUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = false
            };

            // Configure user lockout defaults
            manager.UserLockoutEnabledByDefault = true;
            manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            manager.MaxFailedAccessAttemptsBeforeLockout = 5;

            manager.EmailService = new IlevusEmailService();

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<IlevusUser>(
                        dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }
    }


    public class IlevusRoleManager : RoleManager<IlevusRole, string>
    {
        public IlevusRoleManager(IlevusRoleStore roleStore)
            : base(roleStore)
        {
        }

        public static IlevusRoleManager Create(
            IdentityFactoryOptions<IlevusRoleManager> options,
            IOwinContext context)
        {
            return new IlevusRoleManager(new IlevusRoleStore(context.Get<IlevusDbContext>()));
        }
    }

    public class IlevusEmailService : IIdentityMessageService
    {
        
        public Task SendAsync(IdentityMessage message)
        {
            SmtpClient client = new SmtpClient() {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Host = "progolden.com.br",
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential("smtp@progolden.com.br", "Test!Smtp2016")
            };
            return client.SendMailAsync("noreply@ilevus.com", message.Destination, message.Subject, message.Body);
        }
    }

    public class IlevusDbInitializer
    {
        public static void Initialize(IlevusDbContext db)
        {
            //ElCamino - Creates the DynamoDb Tables
            var userStore = new IlevusUserStore(db);
            var task = userStore.CreateCustomTablesIfNotExists();
            task.Wait();
            var roleStore = new IlevusRoleStore(db);
            task = roleStore.CreateTableIfNotExistsAsync();
            task.Wait();
            //safe to remove after tables are created once.
        }

        //Create User=Admin@Admin.com with password=Admin@12345 in the Admin role        
        public static void InitializeIdentity(IlevusDbContext db)
        {
            var userManager = new IlevusUserManager(new IlevusUserStore(db));
            var roleManager = new IlevusRoleManager(new IlevusRoleStore(db));

            const string email = "admin@ilevus.com";
            const string password = "Admin@12345";

            const string roleName = "SysAdmin";

            //Create Role Admin if it does not exist
            var role = roleManager.FindByName(roleName);
            if (role == null)
            {
                role = new IlevusRole(roleName)
                {
                    Description = "Todas as permissões do sistema."
                };
                var roleresult = roleManager.Create(role);
            }

            var user = userManager.FindByName(email);
            if (user == null)
            {
                user = new IlevusUser {
                    UserName = email,
                    Email = email,
                    Name = "Administrador",
                    Surname = "do Sistema",
                    Keywords = "administrador do sistema belo horizonte",
                    City = "Belo Horizonte",
                    Address = "Sede da Ilevus",
                    Sex = "N/A",
                    PhoneNumber = "+55 31 9 9999-9999",
                    Image = "http://ichef.bbci.co.uk/news/976/mcs/media/images/82639000/jpg/_82639965_game-of-thrones-season-2-jon-snow.jpg"
                };
                var result = userManager.Create(user, password);
                result = userManager.SetLockoutEnabled(user.Id, false);
            }

            // Add user admin to Role Admin if not already added
            var rolesForUser = userManager.GetRoles(user.Id);
            if (!rolesForUser.Contains(role.Name))
            {
                var result = userManager.AddToRole(user.Id, role.Name);
            }


            const string userEmail = "user@ilevus.com";
            const string userPassword = "User@12345";

            const string userRoleName = "User";

            //Create Role Admin if it does not exist
            var userRole = roleManager.FindByName(userRoleName);
            if (userRole == null)
            {
                userRole = new IlevusRole(userRoleName)
                {
                    Description = "Usuário comum do sistema."
                };
                roleManager.Create(userRole);
            }

            var commonUser = userManager.FindByName(userEmail);
            if (commonUser == null)
            {
                commonUser = new IlevusUser
                {
                    UserName = userEmail,
                    Email = userEmail,
                    Name = "Usuário",
                    Surname = "Exemplo",
                    Address = "Sede da Ilevus",
                    Sex = "N/A",
                    PhoneNumber = "+55 31 9 8888-8888",
                    Image = "http://ichef.bbci.co.uk/news/976/mcs/media/images/82639000/jpg/_82639965_game-of-thrones-season-2-jon-snow.jpg"
                };
                var result = userManager.Create(commonUser, userPassword);
                result = userManager.SetLockoutEnabled(commonUser.Id, false);
            }

            // Add user admin to Role Admin if not already added
            var rolesForCommonUser = userManager.GetRoles(commonUser.Id);
            if (!rolesForCommonUser.Contains(userRole.Name))
            {
                var result = userManager.AddToRole(commonUser.Id, userRole.Name);
            }
        }
    }
}