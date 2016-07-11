using ilevus.App_Start;
using ilevus.Models;
using ilevus.Resources;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace ilevus.Providers
{
    public class IlevusOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public IlevusOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }

        public static async Task<JObject> GenerateLocalAccessTokenResponse(IlevusUser user, IlevusUserManager userManager, IOwinContext context)
        {
            ClaimsIdentity cookiesIdentity = await CreateCookieIdentity(user, userManager);
            context.Request.Context.Authentication.SignIn(cookiesIdentity);

            ClaimsIdentity oAuthIdentity = await CreateOAuthIdentity(user, userManager);
            AuthenticationProperties properties = CreateProperties(user.UserName);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);

            var accessToken = Startup.OAuthBearerOpts.AccessTokenFormat.Protect(ticket);

            JObject tokenResponse = new JObject(
                                        new JProperty("userName", user.UserName),
                                        new JProperty("access_token", accessToken),
                                        new JProperty("token_type", "bearer"),
                                        new JProperty("expires_in", Startup.OAuthAuthzOpts.AccessTokenExpireTimeSpan.TotalSeconds.ToString()),
                                        new JProperty(".issued", ticket.Properties.IssuedUtc.ToString()),
                                        new JProperty(".expires", ticket.Properties.ExpiresUtc.ToString())
            );
            return tokenResponse;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            IlevusUserManager userManager = context.OwinContext.GetUserManager<IlevusUserManager>();
            IlevusUser user = await userManager.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("invalid_grant", Messages.AuthInvalidUserCredentials);
                return;
            }

            ClaimsIdentity cookiesIdentity = await CreateCookieIdentity(user, userManager);
            context.Request.Context.Authentication.SignIn(cookiesIdentity);

            ClaimsIdentity oAuthIdentity = await CreateOAuthIdentity(user, userManager);
            AuthenticationProperties properties = CreateProperties(user.UserName);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            context.Validated(ticket);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/api/User/ExternalLogin");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string userName)
        {
            IDictionary<string, string> data = new Dictionary<string, string>
            {
                { "userName", userName }
            };
            var props = new AuthenticationProperties(data);
            props.IssuedUtc = DateTime.UtcNow;
            props.ExpiresUtc = DateTime.UtcNow.Add(Startup.OAuthAuthzOpts.AccessTokenExpireTimeSpan);
            return props;
        }

        protected static async Task<ClaimsIdentity> CreateOAuthIdentity(IlevusUser user, IlevusUserManager userManager)
        {
            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, OAuthDefaults.AuthenticationType);
            oAuthIdentity.AddClaims(IlevusPermissionsProvider.GetPermissionClaims(user, oAuthIdentity));

            return oAuthIdentity;
        }

        protected static async Task<ClaimsIdentity> CreateCookieIdentity(IlevusUser user, IlevusUserManager userManager)
        {
            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, CookieAuthenticationDefaults.AuthenticationType);
            oAuthIdentity.AddClaims(IlevusPermissionsProvider.GetPermissionClaims(user, oAuthIdentity));

            return oAuthIdentity;
        }
    }
}