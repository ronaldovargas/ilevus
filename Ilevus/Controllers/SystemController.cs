using ilevus.App_Start;
using ilevus.Attributes;
using ilevus.Enums;
using ilevus.Models;
using ilevus.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace ilevus.Controllers
{
    [IlevusAuthorization]
    [RoutePrefix("api/System")]
    public class SystemController : BaseAPIController
    {
        private const string LocalLoginProvider = "Local";
        private IlevusUserManager _userManager;
        public IlevusUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<IlevusUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }


        public SystemController()
        {
        }

        public SystemController(IlevusUserManager userManager)
        {
            UserManager = userManager;
        }


        [IlevusAuthorization]
        [Route("Config")]
        [HttpGet]
        public IHttpActionResult GetConfig()
        {
            return Ok(IlevusDBContext.SystemConfiguration);
        }

        [IlevusAuthorization]
        [Route("Config/Welcome")]
        [HttpPost]
        public async Task<IHttpActionResult> UpdateWelcomeEmail(SystemTranslatedEmail model)
        {
            IlevusDBContext.SystemConfiguration.WelcomeMessages = model;
            if (await IlevusDBContext.Create().UpdateSystemConfig())
                return Ok(IlevusDBContext.SystemConfiguration);
            return BadRequest();
        }
        [IlevusAuthorization]
        [Route("Config/EmailValidation")]
        [HttpPost]
        public async Task<IHttpActionResult> UpdateEmailValidationEmail(SystemTranslatedEmail model)
        {
            IlevusDBContext.SystemConfiguration.EmailValidationMessages = model;
            if (await IlevusDBContext.Create().UpdateSystemConfig())
                return Ok(IlevusDBContext.SystemConfiguration);
            return BadRequest();
        }
        [IlevusAuthorization]
        [Route("Config/RecoverPassword")]
        [HttpPost]
        public async Task<IHttpActionResult> UpdateRecoverPasswordEmail(SystemTranslatedEmail model)
        {
            IlevusDBContext.SystemConfiguration.RecoverPasswordMessages = model;
            if (await IlevusDBContext.Create().UpdateSystemConfig())
                return Ok(IlevusDBContext.SystemConfiguration);
            return BadRequest();
        }
        [IlevusAuthorization]
        [Route("Config/AccountBlocking")]
        [HttpPost]
        public async Task<IHttpActionResult> UpdateAccountBlockingEmail(SystemTranslatedEmail model)
        {
            IlevusDBContext.SystemConfiguration.AccountBlockingMessages = model;
            if (await IlevusDBContext.Create().UpdateSystemConfig())
                return Ok(IlevusDBContext.SystemConfiguration);
            return BadRequest();
        }

        [IlevusAuthorization(Permission = UserPermissions.ManageUserPermissions)]
        [Route("User/{id:guid}/assignperms")]
        [HttpPut]
        public async Task<IHttpActionResult> AssignClaimsToUser([FromUri] string id, [FromBody] List<PermissionBindingModel> permsToAssign)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var appUser = await this.UserManager.FindByIdAsync(id);

            if (appUser == null)
            {
                return NotFound();
            }

            foreach (PermissionBindingModel permModel in permsToAssign)
            {
                if (!appUser.Claims.Any(p => p.Type == "IlevusPermission" && p.Value == permModel.Permission))
                {

                    await this.UserManager.AddClaimAsync(id, IlevusPermissionsProvider.CreateClaim(permModel.Permission));
                }
            }

            return Ok();
        }

        [IlevusAuthorization(Permission = UserPermissions.ManageUserPermissions)]
        [Route("User/{id:guid}/removeperms")]
        [HttpPut]
        public async Task<IHttpActionResult> RemoveClaimsFromUser([FromUri] string id, [FromBody] List<PermissionBindingModel> permsToRemove)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var appUser = await this.UserManager.FindByIdAsync(id);

            if (appUser == null)
            {
                return NotFound();
            }

            foreach (PermissionBindingModel permModel in permsToRemove)
            {
                if (appUser.Claims.Any(p => p.Type == "IlevusPermission" && p.Value == permModel.Permission))
                {

                    await this.UserManager.RemoveClaimAsync(id, IlevusPermissionsProvider.CreateClaim(permModel.Permission));
                }
            }

            return Ok();
        }

        [HostAuthentication(DefaultAuthenticationTypes.ApplicationCookie)]
        [Route("User/ManageInfo")]
        public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        {
            IlevusUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            if (user == null)
            {
                return null;
            }

            List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();
            foreach (UserLoginInfo linkedAccount in user.Logins)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = linkedAccount.LoginProvider,
                    ProviderKey = linkedAccount.ProviderKey
                });
            }

            if (user.PasswordHash != null)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = LocalLoginProvider,
                    ProviderKey = user.UserName,
                });
            }

            return new ManageInfoViewModel
            {
                LocalLoginProvider = LocalLoginProvider,
                Email = user.UserName,
                Logins = logins,
                ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
            };
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }



        #region Helpers

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }


        #endregion
    }
}