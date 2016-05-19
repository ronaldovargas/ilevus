using ilevus.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;

namespace ilevus.Providers
{
    public class IlevusPermissionsProvider
    {
        public static IEnumerable<Claim> GetPermissionClaims(IlevusUser user, ClaimsIdentity identity)
        {

            List<Claim> claims = new List<Claim>();

            if (identity.HasClaim(ClaimTypes.Role, "SysAdmin"))
            {
                claims.Add(CreateClaim("All"));
            }

            return claims;
        }

        public static Claim CreateClaim(string permission)
        {
            return new Claim("IlevusPermission", permission, ClaimValueTypes.String);
        }
    }
}