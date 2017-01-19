using ilevus.Attributes;
using ilevus.Helpers;
using ilevus.Models;
using ilevus.Resources;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.Cookies;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Resources;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace ilevus.Controllers
{

    [RoutePrefix("api/Ad")]
    [IlevusAuthorization]
    public class AdController : BaseAPIController
    {

        [HttpGet]
        [Route("Retrieve")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetAds()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var collection = db.GetAdsCollection();
            try
            {
                var results = await collection.FindAsync(filters.Empty);
                var ads = await results.ToListAsync();
                if (ads != null)
                {
                    return Ok(ads);
                }
                return Ok(new List<Ad>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        
        [HttpPost]
        [Route("Save")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> SaveAd(AdBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var collection = IlevusDBContext.Create().GetAdsCollection();
            var filters = Builders<Ad>.Filter;
            try
            {
                if (model.Id != null)
                {
                    var updates = Builders<Ad>.Update;
                    var result = await collection.UpdateOneAsync(
                        filters.Eq("Id", model.Id),
                        updates.Combine(
                            updates.Set("Active", model.Active),
                            updates.Set("Headline", model.Headline),
                            updates.Set("Image", model.Image),
                            updates.Set("Keywords", model.Keywords),
                            updates.Set("Link", model.Link)
                        )
                    );
                    if (result.MatchedCount == 0)
                    {
                        return BadRequest("Ad not found.");
                    }
                    return Ok(true);
                }
                Ad ad = new Ad()
                {
                    Active = model.Active,
                    Headline = model.Headline,
                    Image = model.Image,
                    Keywords = model.Keywords,
                    Link = model.Link
                };
                await collection.InsertOneAsync(ad);
                return Ok(ad);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        
    }
}