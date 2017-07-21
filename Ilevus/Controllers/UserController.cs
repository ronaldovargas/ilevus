using Facebook;
using ilevus.App_Start;
using ilevus.Attributes;
using ilevus.Enums;
using ilevus.Helpers;
using ilevus.Models;
using ilevus.Providers;
using ilevus.Resources;
using log4net;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AutoMapper;
using ilevus.MoipClient.Implementation;
using ilevus.MoipClient.Models;

namespace ilevus.Controllers
{
	[IlevusAuthorization]
	[RoutePrefix("api/User")]
	public class UserController : BaseAPIController
	{
		private const string LocalLoginProvider = "Local";

		public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

		public UserController()
		{
		}

		public UserController(IlevusUserManager userManager, ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
		{
			UserManager = userManager;
			AccessTokenFormat = accessTokenFormat;
		}


		// GET api/Account/{id}
		[AllowAnonymous]
		[HttpGet]
		[Route("{Id}")]
		public async Task<IHttpActionResult> GetPublicProfile(string Id)
		{
			if (Id == null)
			{
				return BadRequest();
			}
			var user = await UserManager.FindByIdAsync(Id);
			if (user == null)
			{
				return NotFound();
			}
			return Ok(new PublicProfileViewModel(user));
		}


		// GET api/Account/UserInfo
		[HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
		[Route("UserInfo")]
		public UserInfoViewModel GetUserInfo()
		{
			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var claims = from c in identity.Claims
						 select new
						 {
							 subject = c.Subject.Name,
							 type = c.Type,
							 value = c.Value
						 };
			ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(identity);
			// We wouldn't normally be likely to do this:
			var user = UserManager.FindByName(identity.Name);
			return new UserInfoViewModel(user)
			{
				Permissions = claims.Where(claim => claim.type == "IlevusPermission"),
				Claims = claims
			};
		}

		// GET api/Account/UserInfo
		[Route("ProfessionalProfile")]
		public ProfessionalProfileViewModel GetProfessionalProfile()
		{
			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			// We wouldn't normally be likely to do this:
			var user = UserManager.FindByName(identity.Name);
			return new ProfessionalProfileViewModel(user);
		}

		// POST api/Account/Logout
		[Route("Logout")]
		public IHttpActionResult Logout()
		{
			Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
			return Ok();
		}

		// POST api/Account/ChangePassword
		[Route("ChangePassword")]
		public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
				model.NewPassword);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(true);
		}

		// POST api/Account/SetPassword
		[Route("SetPassword")]
		public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok();
		}

		// POST api/Account/AddExternalLogin
		[Route("AddExternalLogin")]
		public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

			AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

			if (ticket == null || ticket.Identity == null || (ticket.Properties != null
				&& ticket.Properties.ExpiresUtc.HasValue
				&& ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
			{
				return BadRequest("External login failure.");
			}

			ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

			if (externalData == null)
			{
				return BadRequest("The external login is already associated with an account.");
			}

			IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
				new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok();
		}

		// POST api/Account/RemoveLogin
		[Route("RemoveLogin")]
		public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			IdentityResult result;

			if (model.LoginProvider == LocalLoginProvider)
			{
				result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
			}
			else
			{
				result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
					new UserLoginInfo(model.LoginProvider, model.ProviderKey));
			}

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok();
		}

		// POST: /Account/ConfirmEmail
		[AllowAnonymous]
		[Route("ConfirmEmail")]
		public async Task<IHttpActionResult> ConfirmEmail(ConfirmEmailBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var user = await UserManager.FindByEmailAsync(model.Email);
			if (user == null || await UserManager.IsEmailConfirmedAsync(user.Id))
			{
				return BadRequest("Este e-mail não existe ou já foi confirmado.");
			}
			var result = await UserManager.ConfirmEmailAsync(user.Id, model.Code);
			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}
			return Ok("E-mail confirmado com sucesso.");
		}

		[AllowAnonymous]
		[Route("ConfirmEmailChange")]
		public async Task<IHttpActionResult> ConfirmEmailChange(ConfirmEmailBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var user = await UserManager.FindByEmailAsync(model.Email);
			if (user == null || string.IsNullOrEmpty(user.EmailChange))
			{
				return BadRequest("Este e-mail não existe ou já foi confirmado.");
			}
			if (!model.Code.Equals(user.EmailChangeToken, StringComparison.InvariantCultureIgnoreCase))
			{
				return BadRequest("Código de confirmação inválido.");
			}
			user.Email = user.EmailChange;
			user.UserName = user.EmailChange;
			user.EmailChange = null;
			user.EmailChangeToken = null;
			var result = await UserManager.UpdateAsync(user);
			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}
			return Ok("E-mail confirmado com sucesso.");
		}

		// POST: /Account/EmailConfirmation
		[Route("EmailConfirmation")]
		public async Task<IHttpActionResult> EmailConfirmation()
		{
			var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
			if (await UserManager.IsEmailConfirmedAsync(user.Id))
			{
				return BadRequest(Messages.TextEmailAlreadyConfirmed);
			}

			CultureInfo culture = Thread.CurrentThread.CurrentCulture;
			var implemented = CultureHelper.GetImplementedCulture(culture.Name);
			var code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);

			string link = BaseURL + "#/confirm-email/"
					+ Uri.EscapeDataString(user.Email) + "/"
					+ Uri.EscapeDataString(code);
			string subject;
			string message;
			if ("en".Equals(implemented, StringComparison.InvariantCultureIgnoreCase))
			{
				subject = IlevusDBContext.SystemConfiguration.EmailValidationMessages.en.Subject;
				message = IlevusDBContext.SystemConfiguration.EmailValidationMessages.en.Template;
			}
			else if ("es".Equals(implemented, StringComparison.InvariantCultureIgnoreCase))
			{
				subject = IlevusDBContext.SystemConfiguration.EmailValidationMessages.es.Subject;
				message = IlevusDBContext.SystemConfiguration.EmailValidationMessages.es.Template;
			}
			else
			{
				subject = IlevusDBContext.SystemConfiguration.EmailValidationMessages.pt_br.Subject;
				message = IlevusDBContext.SystemConfiguration.EmailValidationMessages.pt_br.Template;
			}
			await UserManager.SendEmailAsync(user.Id,
				subject,
				string.Format(
					message,
					user.Name,
					"<a href='" + link + "'>" + link + "</a>"
				)
			);
			return Ok(true);
		}

		// POST: /Account/RecoverPassword
		[AllowAnonymous]
		[Route("RecoverPassword")]
		public async Task<IHttpActionResult> RecoverPassword(RecoverPasswordViewModel model)
		{
			if (ModelState.IsValid)
			{
				var user = await UserManager.FindByNameAsync(model.Email);
				if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
				{
					return BadRequest("Este e-mail não está cadastrado no sistema.");
				}

				var code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);

				string link = BaseURL + "#/reset-password/"
							+ Uri.EscapeDataString(user.Email) + "/"
							+ Uri.EscapeDataString(code);
				await UserManager.SendEmailAsync(user.Id,
					Messages.EmailRecoverPasswordSubject,
					string.Format(
						Messages.EmailRecoverPasswordBody,
						user.Name,
						"<a href='" + link + "'>" + link + "</a>"
					)
				);
				return Ok(true);
			}

			return BadRequest(ModelState);
		}

		//
		// POST: /Account/ResetPassword
		[AllowAnonymous]
		[Route("ResetPassword")]
		public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var user = await UserManager.FindByNameAsync(model.Email);
			if (user == null)
			{
				// Don't reveal that the user does not exist
				return NotFound();
			}
			var result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
			if (result.Succeeded)
			{
				return Ok("Senha redefinida com sucesso.");
			}

			return GetErrorResult(result);
		}

		// POST api/Account/Register
		[AllowAnonymous]
		[Route("Register")]
		public async Task<IHttpActionResult> Register(RegisterBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			var existent = await UserManager.FindByEmailAsync(model.Email);
			if (existent != null)
			{
				return BadRequest(Messages.ValidationEmailExists);
			}
			var user = new IlevusUser()
			{
				UserName = model.Email,
				Email = model.Email,
				Name = model.Name,
				Surname = model.Surname
			};

			IdentityResult result = await UserManager.CreateAsync(user, model.Password);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(new UserInfoViewModel(user));
		}

		// GET api/Account/Picture/{UserId}/{Checksum}
		[HttpGet]
		[AllowAnonymous]
		[Route("Picture/{Id}")]
		public async Task<HttpResponseMessage> GetPicture(string Id)
		{
			HttpServerUtility Server = HttpContext.Current.Server;
			IlevusDBContext db = IlevusDBContext.Create();
			var collection = db.GetPicturesCollection();
			IlevusPicture picture = await collection.Find(pic => pic.Id == Id).FirstOrDefaultAsync();
			if (picture == null)
			{
				return new HttpResponseMessage(HttpStatusCode.NotFound);
			}
			HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
			result.Content = new ByteArrayContent(File.ReadAllBytes(IlevusBlobHelper.GetPictureUrl(Server, picture.Checksum)));
			result.Content.Headers.ContentType = new MediaTypeHeaderValue(picture.Mime);
			return result;
		}

		// POST api/Account/UpdatePicture
		[HttpPost]
		[Route("UpdatePicture")]
		public async Task<IHttpActionResult> UpdatePicture()
		{
			// Check if the request contains multipart/form-data.
			if (!Request.Content.IsMimeMultipartContent())
			{
				return BadRequest();
			}

			HttpServerUtility Server = HttpContext.Current.Server;
			string multipartDataPath = Server.MapPath("~/App_Data");

			MultipartFormDataStreamProvider provider = new MultipartFormDataStreamProvider(multipartDataPath);

			// Read the form data.
			await Request.Content.ReadAsMultipartAsync(provider);

			// This illustrates how to get the file names.
			MultipartFileData file = provider.FileData.Single();
			string mime = file.Headers.ContentType.ToString();
			if (!IlevusBlobHelper.isValidMimeType(mime))
			{
				File.Delete(file.LocalFileName);
				return BadRequest(Messages.ValidationPictureType);
			}

			var blob = File.ReadAllBytes(file.LocalFileName);
			if (!IlevusBlobHelper.isValidSize(blob.Length))
			{
				File.Delete(file.LocalFileName);
				return BadRequest(Messages.ValidationPictureMaxSize);
			}

			var sha = new SHA256Managed();
			string checksum = BitConverter.ToString(sha.ComputeHash(blob)).Replace("-", String.Empty);

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);
			IlevusDBContext db = IlevusDBContext.Create();
			var collection = db.GetPicturesCollection();
			IlevusPicture picture = await collection.Find(pic => pic.Checksum == checksum).FirstOrDefaultAsync();
			if (picture == null)
			{
				File.Move(file.LocalFileName, IlevusBlobHelper.GetPictureUrl(Server, checksum));
				picture = new IlevusPicture()
				{
					Mime = mime,
					OriginalName = file.Headers.ContentDisposition.FileName,
					Checksum = checksum,
					UserId = user.Id
				};
				await collection.InsertOneAsync(picture);
			}

			user.Image = "/api/User/Picture/" + picture.Id;
			var result = await UserManager.UpdateAsync(user);
			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(picture);
		}

		[HttpPost]
		[Route("RemovePicture")]
		public async Task<IHttpActionResult> RemovePicture()
		{
			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);
			user.Image = null;
			var result = await UserManager.UpdateAsync(user);
			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(true);
		}

		// GET api/Account/UpdateProfile
		[HttpPost]
		[Route("UpdateProfile")]
		public async Task<IHttpActionResult> UpdateProfile(ProfileBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);

			user.Birthdate = model.Birthdate;
			user.Name = model.Name;
			user.PhoneNumber = model.PhoneNumber;
			user.Sex = model.Sex;
			user.Surname = model.Surname;

			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(new UserInfoViewModel(user));
		}

		// GET api/Account/UpdateAddress
		[HttpPost]
		[Route("UpdateAddress")]
		public async Task<IHttpActionResult> UpdateAddress(AddressBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);

			user.Professional.AddressInfo = true;
			user.Professional.Address = model.Address;
			user.Professional.City = model.City;
			user.Professional.Complement = model.Complement;
			user.Professional.Country = model.Country;
			user.Professional.County = model.County;
			user.Professional.District = model.District;
			user.Professional.Zipcode = model.Zipcode;
			user.IsProfessional = user.Professional.AddressInfo && user.Professional.BasicInfo && user.Professional.CareerInfo &&
				user.Professional.EducationInfo && user.Professional.ServicesInfo;

			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(new UserInfoViewModel(user));
		}

		[HttpPost]
		[Route("UpdateEmail")]
		public async Task<IHttpActionResult> UpdateEmail(ChangeEmailBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest("Digite o e-mail.");
			}

			CultureInfo culture = Thread.CurrentThread.CurrentCulture;
			var implemented = CultureHelper.GetImplementedCulture(culture.Name);

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);

			if (user.EmailConfirmed)
			{
				var str = user.Email + model.Email + DateTime.Now.Ticks.ToString();
				user.EmailChangeToken = BitConverter.ToString(new SHA1Managed().ComputeHash(Encoding.ASCII.GetBytes(str)));
				user.EmailChange = model.Email;

				string link = BaseURL + "#/confirm-email-change/"
						+ Uri.EscapeDataString(user.Email) + "/"
						+ Uri.EscapeDataString(user.EmailChangeToken);
				string subject;
				string message;
				if ("en".Equals(implemented, StringComparison.InvariantCultureIgnoreCase))
				{
					subject = IlevusDBContext.SystemConfiguration.EmailValidationMessages.en.Subject;
					message = IlevusDBContext.SystemConfiguration.EmailValidationMessages.en.Template;
				}
				else if ("es".Equals(implemented, StringComparison.InvariantCultureIgnoreCase))
				{
					subject = IlevusDBContext.SystemConfiguration.EmailValidationMessages.es.Subject;
					message = IlevusDBContext.SystemConfiguration.EmailValidationMessages.es.Template;
				}
				else
				{
					subject = IlevusDBContext.SystemConfiguration.EmailValidationMessages.pt_br.Subject;
					message = IlevusDBContext.SystemConfiguration.EmailValidationMessages.pt_br.Template;
				}
				var mailService = new IlevusEmailService();
				await mailService.SendAsync(new IdentityMessage()
				{
					Destination = user.EmailChange,
					Subject = subject,
					Body = string.Format(
						message,
						user.Name,
						"<a href='" + link + "'>" + link + "</a>"
					)
				});
			}
			else
			{
				user.Email = model.Email;
				user.UserName = model.Email;
			}
			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}
			//var newPrincipal = IlevusOAuthProvider.GenerateLocalAccessTokenResponse(user);
			JObject accessTokenResponse = await IlevusOAuthProvider.GenerateLocalAccessTokenResponse(user, UserManager, Request.GetOwinContext());

			return Ok(accessTokenResponse);
		}


		// GET api/Account/UpdateAddress
		[HttpPost]
		[Route("UpdateProfessionalBasic")]
		public async Task<IHttpActionResult> UpdateProfessionalBasic(ProfessionalBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);
			var professional = user.Professional;

			professional.Industry = model.Industry;
			professional.Headline = model.Headline;
			professional.Specialties = model.Specialties;
			professional.Summary = model.Summary;
			professional.SpokenLanguages = model.SpokenLanguages;
			professional.Phone = model.Phone;
			user.Birthdate = model.BirthDate;
			professional.BasicInfo = true;
			professional.Financial = model.Financial;
			user.IsProfessional = professional.AddressInfo && professional.BasicInfo && professional.CareerInfo &&
				professional.EducationInfo && professional.ServicesInfo;
			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(new ProfessionalProfileViewModel(user));
		}

		// GET api/Account/UpdateAddress
		[HttpPost]
		[Route("UpdateProfessionalEducation")]
		public async Task<IHttpActionResult> UpdateProfessionalEducation(ProfessionalBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);
			var professional = user.Professional;

			professional.Education = model.Education;
			professional.EducationInfo = true;
			user.IsProfessional = professional.AddressInfo && professional.BasicInfo && professional.CareerInfo &&
				professional.EducationInfo && professional.ServicesInfo;

			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(new ProfessionalProfileViewModel(user));
		}

		// GET api/Account/UpdateAddress
		[HttpPost]
		[Route("UpdateProfessionalCareer")]
		public async Task<IHttpActionResult> UpdateProfessionalCareer(ProfessionalBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);
			var professional = user.Professional;

			professional.Career = model.Career;
			professional.CareerInfo = true;
			user.IsProfessional = professional.AddressInfo && professional.BasicInfo && professional.CareerInfo &&
				professional.EducationInfo && professional.ServicesInfo;

			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(new ProfessionalProfileViewModel(user));
		}

		// GET api/Account/UpdateAddress
		[HttpPost]
		[Route("UpdateProfessionalServices")]
		public async Task<IHttpActionResult> UpdateProfessionalServices(ProfessionalBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);
			var professional = user.Professional;

			professional.Services = model.Services;
			professional.ServicesInfo = true;
			user.IsProfessional = professional.AddressInfo && professional.BasicInfo && professional.CareerInfo &&
				professional.EducationInfo && professional.ServicesInfo;

			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(new ProfessionalProfileViewModel(user));
		}

		[HttpPost]
		[Route("UpdateProfessionalBankAccount")]
		public async Task<IHttpActionResult> UpdateProfessionalBankAccount(BankAccount model)
		{
			try
			{


				if (!ModelState.IsValid)
				{
					return BadRequest(ModelState);
				}

				ClaimsIdentity identity = User.Identity as ClaimsIdentity;
				var user = await UserManager.FindByNameAsync(identity.Name);
				var financial = user.Professional.Financial;
				var clientMoip = new MoipApiClient();
				var contaMoip = Mapper.Map<IlevusUser, ContaMoip>(user);


				var conta = await clientMoip.CriarContaMoip(contaMoip);
				user.Professional.MoipAccount = conta;
				financial.BankAccount = model;
				var clientBankAccount = new MoipApiClient(conta.AccessToken);
				var bankAccount = clientBankAccount.CriarContaBancaria(Mapper.Map<BankAccount,ContaBancaria>(model));

				IdentityResult result = await UserManager.UpdateAsync(user);

				if (!result.Succeeded)
				{
					return GetErrorResult(result);
				}

				return Ok(new ProfessionalProfileViewModel(user));
			}
			catch (Exception e)
			{

				throw e;
			}
		}

		[HttpPost]
		[Route("UpdateProcessSteps")]
		public async Task<IHttpActionResult> UpdateProcessSteps(List<CoachingProcessStep> model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);
			var professional = user.Professional;

			professional.ProcessSteps = model;

			IdentityResult result = await UserManager.UpdateAsync(user);
			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return Ok(model);
		}

		// GET api/Account/UpdateProfile
		[HttpPost]
		[Route("ChangeCulture")]
		public async Task<IHttpActionResult> ChangeCulture(ChangeCultureBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ClaimsIdentity identity = User.Identity as ClaimsIdentity;
			var user = await UserManager.FindByNameAsync(identity.Name);

			user.Culture = model.Culture;

			IdentityResult result = await UserManager.UpdateAsync(user);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}
			//var newPrincipal = IlevusOAuthProvider.GenerateLocalAccessTokenResponse(user);
			JObject accessTokenResponse = await IlevusOAuthProvider.GenerateLocalAccessTokenResponse(user, UserManager, Request.GetOwinContext());

			return Ok(accessTokenResponse);
		}

		[HttpPost]
		[Route("Favorite/{Id}")]
		public async Task<IHttpActionResult> FavoriteUser(string Id)
		{
			var user = await UserManager.FindByNameAsync(User.Identity.Name);
			if ((user == null) || string.IsNullOrEmpty(Id))
			{
				return NotFound();
			}
			if (!user.Favorites.Contains(Id))
			{
				user.Favorites.Add(Id);
				await UserManager.UpdateAsync(user);
			}
			return Ok(true);
		}

		[HttpPost]
		[Route("Unfavorite/{Id}")]
		public async Task<IHttpActionResult> UnfavoriteUser(string Id)
		{
			var user = await UserManager.FindByNameAsync(User.Identity.Name);
			if ((user == null) || string.IsNullOrEmpty(Id))
			{
				return NotFound();
			}
			if (user.Favorites.Contains(Id))
			{
				user.Favorites.Remove(Id);
				await UserManager.UpdateAsync(user);
			}
			return Ok(true);
		}

		[AllowAnonymous]
		[HttpPost]
		[Route("LoginWithFacebook")]
		public async Task<IHttpActionResult> LoginWithFacebook(SocialLoginBindingModel model)
		{
			if (string.IsNullOrEmpty(model.AccessToken))
			{
				return BadRequest("An access token must be provided.");
			}
			FacebookClient client = new FacebookClient(model.AccessToken);
			FacebookUser facebookUser = client.Get<FacebookUser>(
				"https://graph.facebook.com/me?fields=email,id,first_name,last_name,locale,location,work,verified"
			);

			IlevusUser user = await UserManager.FindAsync(new UserLoginInfo("Facebook", facebookUser.id));

			bool hasRegistered = user != null;

			if (!hasRegistered)
			{
				user = await UserManager.FindByEmailAsync(facebookUser.email);
			}

			if (user == null)
			{
				user = new IlevusUser()
				{
					UserName = facebookUser.email,
					Email = facebookUser.email,
					EmailConfirmed = facebookUser.verified,
					Name = facebookUser.first_name,
					Surname = facebookUser.last_name,
					Image = "https://graph.facebook.com/" + facebookUser.id + "/picture?height=160&width=160",
					Culture = CultureHelper.GetImplementedCulture(facebookUser.locale)
				};

				IdentityResult result = await UserManager.CreateAsync(user);
				if (!result.Succeeded)
				{
					return GetErrorResult(result);
				}
			}

			if (!hasRegistered)
			{
				var info = new ExternalLoginInfo()
				{
					DefaultUserName = user.UserName,
					Login = new UserLoginInfo("Facebook", facebookUser.id)
				};

				IdentityResult result = await UserManager.AddLoginAsync(user.Id, info.Login);
				if (!result.Succeeded)
				{
					return GetErrorResult(result);
				}
			}

			//generate access token response
			JObject accessTokenResponse = await IlevusOAuthProvider.GenerateLocalAccessTokenResponse(user, UserManager, Request.GetOwinContext());

			return Ok(accessTokenResponse);
		}

		[AllowAnonymous]
		[HttpGet]
		[Route("LoginWithLinkedin")]
		public IHttpActionResult LoginWithLinkedin()
		{
			string redirect = Uri.EscapeDataString(BaseURL + "api/User/LoginWithLinkedinCallback");
			string str = Startup.linkedinAuthOptions.ClientId + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString();
			var state = BitConverter.ToString(new SHA1Managed().ComputeHash(Encoding.ASCII.GetBytes(str)));

			return Redirect("https://www.linkedin.com/oauth/v2/authorization"
				+ "?response_type=code"
				+ "&client_id=" + Startup.linkedinAuthOptions.ClientId
				+ "&redirect_uri=" + redirect
				+ "&state=" + state
				+ "&scope=r_basicprofile%20r_emailaddress"
			);
		}
		[AllowAnonymous]
		[HttpGet]
		[Route("LoginWithLinkedinCallback")]
		public async Task<IHttpActionResult> GetLoginWithLinkedinCallback(string code, string state)
		{
			if (string.IsNullOrEmpty(code))
			{
				return BadRequest("A code must be provided.");
			}
			string str = Startup.linkedinAuthOptions.ClientId + DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString();
			var stateCalc = BitConverter.ToString(new SHA1Managed().ComputeHash(Encoding.ASCII.GetBytes(str)));
			if (!stateCalc.Equals(state, StringComparison.OrdinalIgnoreCase))
			{
				return BadRequest("Invalid request state.");
			}

			LinkedinClient client = await LinkedinClient.Create(code, Startup.linkedinAuthOptions.ClientId,
				Startup.linkedinAuthOptions.ClientSecret, BaseURL + "api/User/LoginWithLinkedinCallback");

			if (client == null)
			{
				return BadRequest("Error retrieving the access token for linkedin.");
			}
			var linkedinUser = await client.Get<LinkedinUser>(
				"https://api.linkedin.com/v1/people/~"
				+ ":(id,first-name,last-name,headline,picture-url,email-address,summary,specialties,industry,public-profile-url)"
			);
			var linkedinPictures = await client.Get<LinkedinPictures>(
			   "https://api.linkedin.com/v1/people/~/picture-urls::(original)"
		   );

			IlevusUser user = await UserManager.FindAsync(new UserLoginInfo("Linkedin", linkedinUser.id));

			bool hasRegistered = user != null;

			if (!hasRegistered)
			{
				user = await UserManager.FindByEmailAsync(linkedinUser.emailAddress);
			}

			if (user == null)
			{
				user = new IlevusUser()
				{
					UserName = linkedinUser.emailAddress,
					Email = linkedinUser.emailAddress,
					EmailConfirmed = true,
					Name = linkedinUser.firstName,
					Surname = linkedinUser.lastName,
					Image = linkedinPictures.values.FirstOrDefault(),
					Professional = new UserProfessionalProfile()
					{
						Industry = linkedinUser.industry,
						Headline = linkedinUser.headline,
						Summary = linkedinUser.summary,
						Specialties = linkedinUser.specialties
					},
					LinkedinProfileUrl = linkedinUser.publicProfileUrl
				};

				IdentityResult result = await UserManager.CreateAsync(user);
				if (!result.Succeeded)
				{
					return GetErrorResult(result);
				}
			}
			else
			{
				user.Image = linkedinPictures.values.FirstOrDefault();
				await UserManager.UpdateAsync(user);
			}

			if (!hasRegistered)
			{
				var info = new ExternalLoginInfo()
				{
					DefaultUserName = user.UserName,
					Login = new UserLoginInfo("Linkedin", linkedinUser.id)
				};

				IdentityResult result = await UserManager.AddLoginAsync(user.Id, info.Login);
				if (!result.Succeeded)
				{
					return GetErrorResult(result);
				}
			}

			//generate access token response
			JObject accessTokenResponse = await IlevusOAuthProvider.GenerateLocalAccessTokenResponse(user, UserManager, Request.GetOwinContext());

			return Redirect(BaseURL + "#/auth-callback/"
				+ Uri.EscapeDataString(accessTokenResponse.GetValue("access_token").ToString())
			);
		}

		public class SocialLoginBindingModel
		{
			public string AccessToken { get; set; }
		}

		class FacebookUser
		{
			public string id { get; set; }
			public string first_name { get; set; }
			public string last_name { get; set; }
			public string email { get; set; }
			public string locale { get; set; }
			public bool verified { get; set; }
			public object location { get; set; }
			public object work { get; set; }
		}







		#region Helpers

		public class ParsedExternalAccessToken
		{
			public string user_id { get; set; }
			public string app_id { get; set; }
		}

		private async Task<ParsedExternalAccessToken> VerifyExternalAccessToken(string provider, string accessToken)
		{
			ParsedExternalAccessToken parsedToken = new ParsedExternalAccessToken();

			var verifyTokenEndPoint = "";

			if (provider == "Facebook")
			{
				//You can get it from here: https://developers.facebook.com/tools/accesstoken/
				//More about debug_tokn here: http://stackoverflow.com/questions/16641083/how-does-one-get-the-app-access-token-for-debug-token-inspection-on-facebook
				verifyTokenEndPoint = string.Format("https://graph.facebook.com/debug_token?input_token={0}&access_token={1}",
					accessToken, Startup.FacebookAppToken);
			}

			var client = new HttpClient();
			var uri = new Uri(verifyTokenEndPoint);
			var response = await client.GetAsync(uri);

			if (response.IsSuccessStatusCode)
			{
				var content = await response.Content.ReadAsStringAsync();

				dynamic jObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(content);

				parsedToken = new ParsedExternalAccessToken();

				if (provider == "Facebook")
				{
					parsedToken.user_id = jObj["data"]["user_id"];
					parsedToken.app_id = jObj["data"]["app_id"];

					if (!string.Equals(Startup.facebookAuthOptions.AppId, parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
					{
						return null;
					}
				}
				else
				{


				}

			}

			return parsedToken;
		}

		private string ValidateClientAndRedirectUri(HttpRequestMessage request, ref string redirectUriOutput)
		{

			Uri redirectUri;

			var redirectUriString = GetQueryString(Request, "redirect_uri");

			if (string.IsNullOrWhiteSpace(redirectUriString))
			{
				return "redirect_uri is required";
			}

			bool validUri = Uri.TryCreate(redirectUriString, UriKind.Absolute, out redirectUri);

			if (!validUri)
			{
				return "redirect_uri is invalid";
			}

			var clientId = GetQueryString(Request, "client_id");

			if (string.IsNullOrWhiteSpace(clientId))
			{
				return "client_Id is required";
			}
			/*
			var client = UserManager.FindClient(clientId);

			if (client == null)
			{
				return string.Format("Client_id '{0}' is not registered in the system.", clientId);
			}

			if (!string.Equals(client.AllowedOrigin, redirectUri.GetLeftPart(UriPartial.Authority), StringComparison.OrdinalIgnoreCase))
			{
				return string.Format("The given URL is not allowed by Client_id '{0}' configuration.", clientId);
			}
			*/
			redirectUriOutput = redirectUri.AbsoluteUri;

			return string.Empty;

		}

		private string GetQueryString(HttpRequestMessage request, string key)
		{
			var queryStrings = request.GetQueryNameValuePairs();

			if (queryStrings == null) return null;

			var match = queryStrings.FirstOrDefault(keyValue => string.Compare(keyValue.Key, key, true) == 0);

			if (string.IsNullOrEmpty(match.Value)) return null;

			return match.Value;
		}

		private IAuthenticationManager Authentication
		{
			get { return Request.GetOwinContext().Authentication; }
		}

		private class ExternalLoginData
		{
			public string LoginProvider { get; set; }
			public string ProviderKey { get; set; }
			public string ProviderId { get; set; }
			public string UserName { get; set; }
			public string Name { get; set; }
			public string Picture { get; set; }
			public string ExternalAccessToken { get; set; }

			public IList<Claim> GetClaims()
			{
				IList<Claim> claims = new List<Claim>();
				claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

				if (UserName != null)
				{
					claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
				}

				return claims;
			}

			public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
			{
				if (identity == null)
				{
					return null;
				}

				Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

				if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer) || String.IsNullOrEmpty(providerKeyClaim.Value))
				{
					return null;
				}

				if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
				{
					return null;
				}

				return new ExternalLoginData
				{
					LoginProvider = providerKeyClaim.Issuer,
					ProviderKey = providerKeyClaim.Value,
					ProviderId = identity.FindFirstValue("ExternalId"),
					UserName = identity.FindFirstValue("ExternalEmail"),
					ExternalAccessToken = identity.FindFirstValue("ExternalAccessToken"),
					Name = identity.FindFirstValue("ExternalName"),
					Picture = identity.FindFirstValue("ExternalPicture")
				};
			}
		}

		#endregion
	}
}
