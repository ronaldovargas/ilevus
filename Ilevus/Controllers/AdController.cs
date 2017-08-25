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
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Resources;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
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

                    if (!string.IsNullOrEmpty(model.Image_Desktop))
                    {
                        var asdf = IlevusDBContext.SystemDefinitions;
                        updates.Set("Image_Desktop", stroreImage(model.Image_Desktop));
                    }

                    if (!string.IsNullOrEmpty(model.Image_Mobile))
                    {
                        var asdf = IlevusDBContext.SystemDefinitions;
                        updates.Set("ImageMobile", stroreImage(model.Image_Mobile));
                    }

                    var result = await collection.UpdateOneAsync(
                        filters.Eq("Id", model.Id),
                        updates.Combine(
                            updates.Set("Active", model.Active),
                            updates.Set("Headline", model.Headline),
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
                    Keywords = model.Keywords,
                    Link = model.Link
                };

                if (!string.IsNullOrEmpty(model.Image_Desktop))
                {
                    var asdf = IlevusDBContext.SystemDefinitions;
                    ad.ImageDesktop = stroreImage(model.Image_Desktop);
                }

                if (!string.IsNullOrEmpty(model.Image_Mobile))
                {
                    var asdf = IlevusDBContext.SystemDefinitions;
                    ad.ImageMobile = stroreImage(model.Image_Mobile);
                }

                await collection.InsertOneAsync(ad);
                return Ok(ad);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        #region Métodos para salvar as imagens dos anúncios

        public KeyValuePair<System.Drawing.Imaging.ImageFormat, Image> LoadImage(string strBase64)
        {
            Regex DataUriPattern = new Regex(@"^data\:(?<type>image\/(png|tiff|jpg|jpeg|gif));base64,(?<data>[A-Z0-9\+\/\=]+)$", RegexOptions.Compiled | RegexOptions.ExplicitCapture | RegexOptions.IgnoreCase);
            Match match = DataUriPattern.Match(strBase64);

            System.Drawing.Imaging.ImageFormat mimeType = System.Drawing.Imaging.ImageFormat.Jpeg;
            switch (match.Groups["type"].Value)
            {
                case "image/png":
                    mimeType = System.Drawing.Imaging.ImageFormat.Png;
                    break;
                case "image/tiff":
                    mimeType = System.Drawing.Imaging.ImageFormat.Tiff;
                    break;
                case "image/gif":
                    mimeType = System.Drawing.Imaging.ImageFormat.Gif;
                    break;
                case "image/jpeg":
                case "image/jpg":
                    mimeType = System.Drawing.Imaging.ImageFormat.Jpeg;
                    break;
            }
            string base64Data = match.Groups["data"].Value;

            byte[] bytes = Convert.FromBase64String(base64Data);

            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }

            return new KeyValuePair<System.Drawing.Imaging.ImageFormat, Image>(mimeType, image);
        }

        public string stroreImage(string strBase64Image)
        {
            var kvImage = LoadImage(strBase64Image);
            Bitmap desktop = new Bitmap(kvImage.Value);

            JToken token = JObject.Parse(IlevusDBContext.SystemDefinitions.definitions);
            string path = token.SelectToken("PathAds").ToString();
            path = (!path.EndsWith(@"/") ? path + "/" : path);

            string ext = "jpg";
            if (kvImage.Key == System.Drawing.Imaging.ImageFormat.Png)
                ext = "png";
            else if (kvImage.Key == System.Drawing.Imaging.ImageFormat.Tiff)
                ext = "tiff";
            else if (kvImage.Key == System.Drawing.Imaging.ImageFormat.Gif)
                ext = "gif";
            else if (kvImage.Key == System.Drawing.Imaging.ImageFormat.Jpeg)
                ext = "jpg";

            string name_image = Guid.NewGuid().ToString("D");
            desktop.Save(HttpContext.Current.Server.MapPath(path) + desktop.RawFormat.Guid + "." + ext, kvImage.Key);
            return desktop.RawFormat.Guid + "." + ext;
        }

        #endregion





        [HttpGet]
        [Route("Search")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> SearchAds(string Keyword)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var collection = db.GetAdsCollection();
            try
            {
                List<Ad> ads = null;
                if (!string.IsNullOrEmpty(Keyword))
                {
                    var directed = await collection.FindAsync(
                        filters.And(
                            filters.Eq("Active", true),
                            filters.Text(Keyword)
                        )
                    );
                    ads = await directed.ToListAsync();
                }

                if (ads == null || ads.Count < 3)
                {
                    var results = await collection.FindAsync(
                        filters.Eq("Active", true)
                    );
                    var all = await results.ToListAsync();
                    if (all != null)
                    {
                        if (ads == null)
                            ads = all;
                        else
                            ads.AddRange(all);
                        return Ok(ads);
                    }
                    return Ok(new List<Ad>());
                }
                return Ok(ads);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("View")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ViewAdImage(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();
            try
            {
                var result = await collection.FindAsync(filters.Eq("Id", Id));
                var ad = await result.FirstOrDefaultAsync();
                if (ad == null)
                {
                    return NotFound();
                }
                collection.UpdateOneAsync(
                    filters.Eq("Id", Id),
                    updates.Inc("Views", 1)
                );
                return Redirect(ad.Image);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("Click")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ClickAd(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();
            try
            {
                var result = await collection.FindAsync(filters.Eq("Id", Id));
                var ad = await result.FirstOrDefaultAsync();
                if (ad == null)
                {
                    return NotFound();
                }
                collection.UpdateOneAsync(
                    filters.Eq("Id", Id),
                    updates.Inc("Hits", 1)
                );
                return Redirect(ad.Link);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}