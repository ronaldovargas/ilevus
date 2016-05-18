﻿using ElCamino.AspNet.Identity.Dynamo;
using ilevus.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
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


    public class IlevusDbInitializer
    {
        public static void Initialize(IlevusDbContext db)
        {
            //ElCamino - Creates the DynamoDb Tables
            var userStore = new IlevusUserStore(db);
            var task = userStore.CreateTablesIfNotExists();
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

            const string name = "admin@ilevus.com";
            const string password = "Admin@12345";
            const string roleName = "SysAdmin";

            //Create Role Admin if it does not exist
            var role = roleManager.FindByName(roleName);
            if (role == null)
            {
                role = new IlevusRole(roleName);
                var roleresult = roleManager.Create(role);
            }

            var user = userManager.FindByName(name);
            if (user == null)
            {
                user = new IlevusUser { UserName = name, Email = name };
                var result = userManager.Create(user, password);
                result = userManager.SetLockoutEnabled(user.Id, false);
            }

            // Add user admin to Role Admin if not already added
            var rolesForUser = userManager.GetRoles(user.Id);
            if (!rolesForUser.Contains(role.Name))
            {
                var result = userManager.AddToRole(user.Id, role.Name);
            }
        }
    }
}