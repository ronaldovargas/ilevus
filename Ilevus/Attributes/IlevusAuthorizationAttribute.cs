﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace ilevus.Attributes
{
    public class IlevusAuthorizationAttribute : AuthorizationFilterAttribute
    {
        public string Permission { get; set; }

        public override Task OnAuthorizationAsync(HttpActionContext actionContext, System.Threading.CancellationToken cancellationToken)
        {

            var principal = actionContext.RequestContext.Principal as ClaimsPrincipal;

            if (!principal.Identity.IsAuthenticated)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
                return Task.FromResult<object>(null);
            }

            if (Permission != null)
            {
                if (!(principal.HasClaim(claim => claim.Type == "IlevusPermission" && ((claim.Value == "All") || (claim.Value == Permission)))))
                {
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized);
                    return Task.FromResult<object>(null);
                }
            }
            
            //User is Authorized, complete execution
            return Task.FromResult<object>(null);

        }
    }
}