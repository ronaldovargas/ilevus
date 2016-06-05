using ilevus.Helpers;
using Newtonsoft.Json.Linq;
using System.Collections;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ilevus.Controllers
{
    public class SearchController : BaseAPIController
    {
        // GET /api/Search
        public async Task<IHttpActionResult> Search()
        {
            
            return Ok();
        }
    }
}