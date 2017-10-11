using ilevus.Attributes;
using ilevus.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace ilevus.Controllers
{
    [RoutePrefix("api/Sitemap")]
    [IlevusAuthorization]
    public class SitemapController: BaseAPIController
    {
        [HttpGet]
        [Route("GetLog")]
        public async Task<IHttpActionResult> GetLogs()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<SiteMapLogModel>.Filter;
            var collection = db.GetSiteMapLogCollection();
            try
            {
                var result = await collection.FindAsync(filters.Empty);
                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result.ToListAsync());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("GenerateNow")]
        public async Task<IHttpActionResult> GenerateNow()
        {
            try
            {
                var res = await WebApiConfig.CreateSiteMap();
                return Ok<bool>(res);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpDelete]
        [Route("RemoveAll")]
        public async Task<IHttpActionResult> RemoveAll()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<SiteMapLogModel>.Filter;
            var collection = db.GetSiteMapLogCollection();
            try
            {
                var result = await collection.DeleteManyAsync(filters.Empty);
                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result.DeletedCount);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}