using ilevus.Helpers;
using ilevus.Resources;
using Microsoft.Owin.Security.Cookies;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Globalization;
using System.Resources;
using System.Threading;
using System.Web.Http;

namespace ilevus.Controllers
{
    public class MessagesController : BaseAPIController
    {
        // GET /api/Messages
        public IHttpActionResult Get(string lang = null)
        {
            CultureInfo culture = Thread.CurrentThread.CurrentCulture;
            /*if (!string.IsNullOrEmpty(lang))
            {
                culture = new CultureInfo(CultureHelper.GetImplementedCulture(lang));
            }*/
            JObject resourceObject = new JObject();

            resourceObject.Add("Culture", Thread.CurrentThread.CurrentCulture.Name);
            ResourceSet resourceSet = IlevusResources.Manager.GetResourceSet(culture, true, true);
            IDictionaryEnumerator enumerator = resourceSet.GetEnumerator();
            while (enumerator.MoveNext())
            {
                resourceObject.Add(enumerator.Key.ToString(), enumerator.Value.ToString());
            }
            resourceObject.Add("LinkedinClientId", Startup.linkedinAuthOptions.ClientId);
            resourceObject.Add("FacebookClientId", Startup.facebookAuthOptions.AppId);

            return Ok(resourceObject);
        }
    }
}