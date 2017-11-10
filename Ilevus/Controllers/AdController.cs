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
using ilevus.Enums;

namespace ilevus.Controllers
{

    [RoutePrefix("api/Ad")]
    [IlevusAuthorization]
    public class AdController : BaseAPIController
    {
        static Regex MobileCheck = new Regex(@"android|(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.Compiled);
        static Regex MobileVersionCheck = new Regex(@"1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-", RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.Compiled);

        [HttpGet]
        [Route("RetrieveBalance")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetAdsBalance()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AdBalance>.Filter;
            var collection = db.GetAdsBalanceCollection();
            try
            {
                var results = await collection.FindAsync(filters.Empty);
                var ads = await results.ToListAsync();
                if (ads != null)
                {
                    return Ok(ads);
                }
                return Ok(new List<AdBalance>());
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

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

                    var strDesktopImageName = model.Image_Desktop_old;
                    if (!string.IsNullOrEmpty(model.Image_Desktop))
                    {
                        var sd = IlevusDBContext.SystemDefinitions;
                        strDesktopImageName = stroreImage(model.Image_Desktop);

                        JToken token = JObject.Parse(IlevusDBContext.SystemDefinitions.definitions);
                        string path = token.SelectToken("PathAds").ToString();
                        path = (!path.EndsWith(@"/") ? path + "/" : path);

                        if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(path) + model.Image_Desktop_old))
                            System.IO.File.Delete(HttpContext.Current.Server.MapPath(path) + model.Image_Desktop_old);
                    }

                    var strMobileImageName = model.Image_Mobile_old;
                    if (!string.IsNullOrEmpty(model.Image_Mobile))
                    {
                        var sd = IlevusDBContext.SystemDefinitions;
                        //updates.Set("ImageMobile", stroreImage(model.Image_Mobile));
                        strMobileImageName = stroreImage(model.Image_Mobile);

                        JToken token = JObject.Parse(IlevusDBContext.SystemDefinitions.definitions);
                        string path = token.SelectToken("PathAds").ToString();
                        path = (!path.EndsWith(@"/") ? path + "/" : path);

                        if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(path) + model.Image_Mobile_old))
                            System.IO.File.Delete(HttpContext.Current.Server.MapPath(path) + model.Image_Mobile_old);
                    }

                    var result = await collection.UpdateOneAsync(
                        filters.Eq("Id", model.Id),
                        updates.Combine(
                            updates.Set("Active", model.Active),
                            updates.Set("Headline", model.Headline),
                            updates.Set("Campaign", model.Campaign),
                            updates.Set("Keywords", model.Keywords),
                            updates.Set("DailyBudgetCap", Convert.ToDouble(model.DailyBudgetCap.Replace("R$", "").Replace(".", "").Trim())),
                            updates.Set("Link", model.Link),
                            updates.Set("ImageDesktop", strDesktopImageName),
                            updates.Set("ImageMobile", strMobileImageName),
                            updates.Set("Status", Enums.ModerationAds.WaitingAnalysis),
                            updates.Set("Moderator", new UserModerator()
                            {
                                AnalysisHour = null,
                                Email = "",
                                Id = ""
                            })
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
                    Campaign = model.Campaign,
                    Keywords = model.Keywords,
                    Link = model.Link,
                    DailyBudgetCap = Convert.ToDouble(model.DailyBudgetCap.Replace("R$", "").Replace(".", "").Trim()),
                    Status = Enums.ModerationAds.WaitingAnalysis
                };

                if (!string.IsNullOrEmpty(model.Image_Desktop))
                {
                    var sd = IlevusDBContext.SystemDefinitions;
                    ad.ImageDesktop = stroreImage(model.Image_Desktop);
                }

                if (!string.IsNullOrEmpty(model.Image_Mobile))
                {
                    var sd = IlevusDBContext.SystemDefinitions;
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

        [HttpPost]
        [Route("ChageAdStatus")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ChageAdStatus(AdBindingModel model)
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
                            updates.Set("Active", model.Active)
                        )
                    );
                    if (result.MatchedCount == 0)
                    {
                        return BadRequest("Ad not found.");
                    }
                    return Ok(true);
                }
                else
                {
                    return BadRequest("Ad not found.");
                }
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
            desktop.Save(HttpContext.Current.Server.MapPath(path) + name_image + "." + ext, kvImage.Key);
            return name_image + "." + ext;
        }

        #endregion

        public static bool fBrowserIsMobile()
        {
            System.Diagnostics.Debug.Assert(HttpContext.Current != null);

            if (HttpContext.Current.Request != null && HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"] != null)
            {
                var u = HttpContext.Current.Request.ServerVariables["HTTP_USER_AGENT"].ToString();

                if (u.Length < 4)
                    return false;

                if (MobileCheck.IsMatch(u) || MobileVersionCheck.IsMatch(u.Substring(0, 4)))
                    return true;
            }

            return false;
        }

        [HttpGet]
        [Route("Search")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> SearchAds(string Keyword, int Limit = 1, bool isMobile = false)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var collection = db.GetAdsCollection();

            try
            {
                List<Ad> ads = null;

                string ImagePosition = (isMobile ? "ImageMobile" : "ImageDesktop");

                if (!isMobile && fBrowserIsMobile())
                    return Ok(new List<Ad>());

                if (isMobile && !fBrowserIsMobile())
                    return Ok(new List<Ad>());

                if (!string.IsNullOrEmpty(Keyword))
                {
                    var directed = collection.Find(
                        filters.And(
                            filters.Eq("Active", true),
                            filters.Eq("Status", Enums.ModerationAds.Approved),
                            filters.Gt("DailyBudgetCap", 0),
                            filters.Ne(ImagePosition, MongoDB.Bson.BsonNull.Value),
                            filters.Exists(ImagePosition),
                            filters.Text(Keyword)
                        )
                    );

                    int iCont = Convert.ToInt32(directed.Count());


                    directed.Options.Limit = Limit;
                    directed.Skip(new Random().Next(0, iCont));

                    ads = await directed.ToListAsync();

                }

                if (ads == null)
                {
                    var directed = collection.Find(
                        filters.And(
                            filters.Eq("Active", true),
                            filters.Ne(ImagePosition, MongoDB.Bson.BsonNull.Value),
                            filters.Exists(ImagePosition),
                            filters.Text(Keyword)
                        )
                    );

                    int iCont = Convert.ToInt32(directed.Count());

                    directed.Options.Limit = Limit;
                    directed.Skip(new Random().Next(1, iCont));

                    var all = await directed.ToListAsync();
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
        public async Task<IHttpActionResult> ViewAdImage(string Id, string Position = "desktop")
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();
            var collectionReport = db.GetAdsReport();

            var cBalance = db.GetAdsBalanceCollection();
            var filtersBalance = Builders<AdBalance>.Filter;
            var updatesBalance = Builders<AdBalance>.Update;

            try
            {
                var rBalance = cBalance.Find(filtersBalance.Empty);
                var balance = rBalance.FirstOrDefault();

                var _idBalance = balance.Id;

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

                JToken token = JObject.Parse(IlevusDBContext.SystemDefinitions.definitions);

                CultureInfo culture = Thread.CurrentThread.CurrentCulture;
                var implemented = CultureHelper.GetImplementedCulture(culture.Name).Replace("-", "_");

                cBalance.UpdateOne(
                    filtersBalance.Eq("Id", _idBalance),
                    updatesBalance.Set("Balance", balance.Balance - Convert.ToDouble(token.SelectToken("CostPerView_" + implemented)))
                );


                string url = token.SelectToken("UrlRetriviedAds").ToString();
                url = (!url.EndsWith(@"/") ? url + "/" : url);


                AdsReport adReport = new AdsReport()
                {
                    ad_event = "view",
                    ad_id = Id,
                    cost = Convert.ToDouble(token.SelectToken("CostPerView_" + implemented)),
                    date = DateTime.Now
                };

                collectionReport.InsertOne(adReport);


                if (Position == "desktop")
                    return Redirect(url + ad.ImageDesktop);
                else if (Position == "mobile")
                    return Redirect(url + ad.ImageMobile);
                else
                    return Redirect(url + ad.ImageDesktop);
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
            var collectionReport = db.GetAdsReport();

            var cBalance = db.GetAdsBalanceCollection();
            var filtersBalance = Builders<AdBalance>.Filter;
            var updatesBalance = Builders<AdBalance>.Update;

            try
            {
                var rBalance = cBalance.Find(filtersBalance.Empty);
                var balance = rBalance.FirstOrDefault();

                var _idBalance = balance.Id;

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

                JToken token = JObject.Parse(IlevusDBContext.SystemDefinitions.definitions);

                CultureInfo culture = Thread.CurrentThread.CurrentCulture;
                var implemented = CultureHelper.GetImplementedCulture(culture.Name).Replace("-", "_");

                cBalance.UpdateOne(
                    filtersBalance.Eq("Id", _idBalance),
                    updatesBalance.Set("Balance", balance.Balance - Convert.ToDouble(token.SelectToken("CostPerClick_" + implemented)))
                );

                AdsReport adReport = new AdsReport()
                {
                    ad_event = "click",
                    ad_id = Id,
                    cost = Convert.ToDouble(token.SelectToken("CostPerClick_" + implemented)),
                    date = DateTime.Now
                };

                collectionReport.InsertOne(adReport);

                return Redirect(ad.Link);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        #region Moderação de anúncios

        [HttpGet]
        [Route("CheckPendingModerations")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> CheckModerationsAds()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var collection = db.GetAdsCollection();
            try
            {

                var directed = collection.Find(
                    filters.And(
                        filters.Eq("Active", true),

                        filters.Or(
                            filters.Eq("Status", Enums.ModerationAds.WaitingAnalysis),
                            filters.Eq("Status", Enums.ModerationAds.OnAnalysing)
                        ),
                        filters.Lt("Moderator.AnalysisHour", DateTime.Now.AddMinutes(-5))
                    )
                );

                var ads = await directed.ToListAsync();

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

        [HttpGet]
        [Route("RetrievePendingModerations")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> GetModerationsAds()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var collection = db.GetAdsCollection();
            try
            {
                //var directed = collection.Find(
                var ads = collection.Find(
                    filters.And(
                        filters.Eq("Active", true),
                        filters.Not(
                            filters.Or(
                                filters.Eq("Status", Enums.ModerationAds.Approved),
                                filters.Eq("Status", Enums.ModerationAds.Denied)
                            )
                        ),
                        filters.Or(
                            filters.Eq("Status", Enums.ModerationAds.WaitingAnalysis),

                            filters.And(
                                filters.Eq("Status", Enums.ModerationAds.OnAnalysing),
                                filters.Lt("Moderator.AnalysisHour", DateTime.Now.AddMinutes(-5))
                            )
                        )

                    )
                ).FirstOrDefault();

                //var ads = await directed.ToListAsync();

                if (ads != null)
                {
                    await this.CatchModerationAd(ads.Id, Enums.ModerationAds.OnAnalysing);
                    return Ok(ads);
                }
                //return Ok(new List<Ad>());
                return Ok(false);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("CatchAdModeration")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> CatchModerationAd(string Id, string Status)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();

            try
            {
                var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                var Moderator = new UserModerator()
                {
                    AnalysisHour = DateTime.Now,
                    Email = user.Email,
                    Id = user.Id
                };

                var result = await collection.UpdateOneAsync(
                    filters.Eq("Id", Id),
                    updates.Combine(
                        updates.Set("Status", Status),
                        updates.Set("Moderator", Moderator)
                    )
                );

                return Ok();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("SaveAdModeration")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> SaveModerationAd(string Id, string Status)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();

            try
            {
                var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                /*var Moderator = new UserModerator()
                {
                    AnalysisHour = DateTime.Now,
                    Email = user.Email,
                    Id = user.Id
                };*/

                var result = await collection.UpdateOneAsync(
                    filters.Eq("Id", Id),
                    updates.Combine(
                        updates.Set("Status", Status),
                        updates.Set("Moderator", new UserModerator()
                        {
                            AnalysisHour = null,
                            Email = "",
                            Id = ""
                        })
                    )
                );

                //Adicionar Log
                var collectionLog = db.GetAdsLogCollection();
                AdLogModeration adLog = new AdLogModeration()
                {
                    user_id = user.Id,
                    user_nome = user.Name,
                    user_email = user.Email,
                    ad_id = Id,
                    status = Status,
                    date = DateTime.Now
                };

                await collectionLog.InsertOneAsync(adLog);

                return Ok(true);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("LeaveAdModeration")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> LeaveModerationAd(string Id)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<Ad>.Filter;
            var updates = Builders<Ad>.Update;
            var collection = db.GetAdsCollection();

            try
            {
                var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                var Moderator = new UserModerator()
                {
                    AnalysisHour = DateTime.Now,
                    Email = user.Email,
                    Id = user.Id
                };

                var result = await collection.UpdateOneAsync(
                    filters.Eq("Id", Id),
                    updates.Combine(
                        updates.Set("Status", "WaitingAnalysis"),
                        updates.Set("Moderator", new UserModerator()
                        {
                            AnalysisHour = null,
                            Email = "",
                            Id = ""
                        })
                    )
                );

                return Ok(true);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("CountPreviewsModeration")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> CountPreviewsModerationAds()
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AdLogModeration>.Filter;
            var countModerations = new CountPreviewModeration();
            var collection = db.GetAdsLogCollection();

            try
            {
                var user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

                //Somatório Dia
                var dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 0, 0, 0);
                var dtEnd = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day, 23, 59, 59);
                var result = collection.Find(
                    filters.And(
                        filters.Eq("user_id", user.Id),
                        filters.Gte("date", dtStart),
                        filters.Lte("date", dtEnd)
                    )
                );
                countModerations.dailyCount = Convert.ToInt32(result.Count());

                //Somatório Mês
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0);
                dtEnd = new DateTime(DateTime.Today.Year, DateTime.Today.Month, dtStart.AddMonths(1).AddDays(-1).Day, 23, 59, 59);
                result = collection.Find(
                    filters.And(
                        filters.Eq("user_id", user.Id),
                        filters.Gte("date", dtStart),
                        filters.Lte("date", dtEnd)
                    )
                );
                countModerations.monthCount = Convert.ToInt32(result.Count());

                //Somatório Mês Anterior
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.AddMonths(-1).Month, 1, 0, 0, 0);
                dtEnd = new DateTime(DateTime.Today.Year, dtStart.Month, dtStart.AddMonths(1).AddDays(-1).Day, 23, 59, 59);
                result = collection.Find(
                    filters.And(
                        filters.Eq("user_id", user.Id),
                        filters.Gte("date", dtStart),
                        filters.Lte("date", dtEnd)
                    )
                );
                countModerations.prevMonthCount = Convert.ToInt32(result.Count());

                return Ok(countModerations);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        #endregion
    }
}