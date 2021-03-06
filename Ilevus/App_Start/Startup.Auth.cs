﻿using ilevus.App_Start;
using ilevus.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Facebook;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Owin.Security.Providers.LinkedIn;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace ilevus
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthAuthzOpts { get; private set; }
        public static OAuthBearerAuthenticationOptions OAuthBearerOpts { get; private set; }
        public static FacebookAuthenticationOptions facebookAuthOptions { get; private set; }
        public static LinkedInAuthenticationOptions linkedinAuthOptions { get; private set; }

        public static readonly string FacebookAppToken = ConfigurationManager.AppSettings["FacebookAppToken"];
        public static string PublicClientId { get; private set; }

        public void ConfigureAuth(IAppBuilder app)
        {
            app.CreatePerOwinContext(IlevusIdentityContext.Create);
            app.CreatePerOwinContext<IlevusUserManager>(IlevusUserManager.Create);
            app.CreatePerOwinContext<IlevusRoleManager>(IlevusRoleManager.Create);

            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthAuthzOpts = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/api/Token"),
                Provider = new IlevusOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/User/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                AllowInsecureHttp = true
            };
            OAuthBearerOpts = new OAuthBearerAuthenticationOptions
            {
                AuthenticationMode = Microsoft.Owin.Security.AuthenticationMode.Active
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerAuthentication(OAuthBearerOpts);
            app.UseOAuthBearerTokens(OAuthAuthzOpts);

            // Code for third party logins
            linkedinAuthOptions = new LinkedInAuthenticationOptions
            {
                ClientId = ConfigurationManager.AppSettings["LinkedinClient"],
                ClientSecret = ConfigurationManager.AppSettings["LinkedinSecret"]
            };

            facebookAuthOptions = new FacebookAuthenticationOptions()
            {
                AppId = ConfigurationManager.AppSettings["FacebookClient"],
                AppSecret = ConfigurationManager.AppSettings["FacebookSecret"]
            };
            
        }
    }
}