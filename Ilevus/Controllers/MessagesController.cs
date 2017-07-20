using ilevus.Helpers;
using ilevus.Models;
using ilevus.Resources;
using Microsoft.Owin.Security.Cookies;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Globalization;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ilevus.Controllers
{

    [RoutePrefix("api/Messages")]
    public class MessagesController : BaseAPIController
    {
        // GET /api/Messages/Current
        [HttpGet]
        [Route("Current")]
        public IHttpActionResult GetForCurrentCulture(string lang = null)
        {
            try
            {
                CultureInfo culture = Thread.CurrentThread.CurrentCulture;
                var implemented = CultureHelper.GetImplementedCulture(culture.Name);
                var messages = IlevusDBContext.Messages[implemented].Messages;
                var resourceObject = new JObject();
                resourceObject.Add("_Culture", culture.Name);
                resourceObject.Add("LinkedinClientId", Startup.linkedinAuthOptions.ClientId);
                resourceObject.Add("_FacebookClientId", Startup.facebookAuthOptions.AppId);
                foreach (var item in messages)
                {
                    resourceObject.Add(item.Key, item.Value.Content);
                }

                return Ok(resourceObject);
            } catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // POST /api/Messages
        [HttpPost]
        [Route("Report")]
        public async Task<IHttpActionResult> ReportKey(string key)
        {
            if (string.IsNullOrWhiteSpace(key) || key.StartsWith("_"))
            {
                return BadRequest("You must provide a key.");
            }
            var db = IlevusDBContext.Create();
            try
            {
                if (await db.AddSystemMessagesKey(key))
                {
                    return Ok("New key added.");
                }
                else
                {
                    return BadRequest("Um problema inesperado ocorreu.");
                }
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}