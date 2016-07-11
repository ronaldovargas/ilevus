using ilevus.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace ilevus
{
    public class Global : HttpApplication
    {

        protected void Application_PostAuthenticateRequest(object sender, EventArgs e)
        {
            if (User.Identity.IsAuthenticated)
            {
                var identity = (User.Identity as ClaimsIdentity);
                Claim cult = identity.Claims.Where(claim => claim.Type == IlevusClaimTypes.UserCulture)
                    .FirstOrDefault();
                if (cult != null)
                {
                    var cultureName = cult.Value;
                    // Validate culture name
                    cultureName = CultureHelper.GetImplementedCulture(cultureName); // This is safe

                    // Modify current thread's cultures            
                    Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(cultureName);
                    Thread.CurrentThread.CurrentUICulture = Thread.CurrentThread.CurrentCulture;
                }
            }
        }
        
    }
}