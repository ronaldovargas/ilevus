using AspNet.Identity.MongoDB;
using ilevus.Controllers;
using ilevus.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using MongoDB.Driver;
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
            var manager = new IlevusUserManager(new IlevusUserStore(context.Get<IlevusIdentityContext>()));

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
            return new IlevusRoleManager(new IlevusRoleStore(context.Get<IlevusIdentityContext>()));
        }
    }

    public class IlevusEmailService : IIdentityMessageService
    {

        public Task SendAsync(IdentityMessage message)
        {
            bool isSystemMessage = false;
            string idUsuario = string.Empty;

            if (message.Destination.Contains("|"))
            {
                idUsuario = message.Destination.Split('|')[0];
                message.Destination = message.Destination.Split('|')[1];
                isSystemMessage = true;
            }

            SmtpClient client = new SmtpClient()
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Host = "progolden.com.br",
                Port = 587,
                EnableSsl = true,
                Credentials = new NetworkCredential("smtp@progolden.com.br", "Test!Smtp2016")
            };
            var email = new MailMessage(new MailAddress("noreply@ilevus.com", "ilevus"), new MailAddress(message.Destination))
            {
                Body = message.Body,
                IsBodyHtml = true,
                Subject = message.Subject
            };

            NotificationsController notC = new NotificationsController();
            notC.SendNotification(new NotificationModel()
            {
                DateNotification = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"),
                From = "system",
                InfoNotification = message.Body,
                Status = false,
                User_id = isSystemMessage ? idUsuario : message.Destination
            });

            return client.SendMailAsync(email);
        }
    }

    public class IlevusDbInitializer
    {
        public static void Initialize(IlevusIdentityContext db)
        {
            IndexChecks.EnsureUniqueIndexOnEmail(db.Users);
            IndexChecks.EnsureUniqueIndexOnUserName(db.Users);
            IndexChecks.EnsureUniqueIndexOnRoleName(db.Roles);
        }

        //Create User=Admin@Admin.com with password=Admin@12345 in the Admin role        
        public static void InitializeIdentity(IlevusIdentityContext db)
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
                user = new IlevusUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,
                    Name = "Administrador",
                    Surname = "do Sistema",
                    Sex = "M",
                    PhoneNumber = "031 999999999",
                    Image = null,

                    Professional = new UserProfessionalProfile()
                    {
                        City = "Belo Horizonte",
                        County = "Minas Gerais",
                        Country = "Brasil",
                        Address = "Sede da Ilevus",
                    }
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
                    EmailConfirmed = true,
                    Name = "Usuário",
                    Surname = "Exemplo",
                    Sex = "M",
                    PhoneNumber = "031 988888888",
                    Image = null,

                    Professional = new UserProfessionalProfile()
                    {
                        City = "Belo Horizonte",
                        County = "Minas Gerais",
                        Country = "Brasil",
                        Address = "Sede da Ilevus",
                    }
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