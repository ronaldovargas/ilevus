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
using System.Linq;
using System.Text;

namespace ilevus.Controllers
{
    [RoutePrefix("api/Report")]
    [IlevusAuthorization]
    public class ReportsController : BaseAPIController
    {
        [HttpPost]
        [Route("DownloadProductivityReport")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> DownloadProductivityReportCSV(string dtInit, string dtEnd, string searchTerm = "")
        {
            var db = IlevusDBContext.Create();
            //var filters = Builders<AdLogModeration>.Filter;
            
            var builder = Builders<AdLogModeration>.Filter;

            var collection = db.GetAdsLogCollection();
                        
            try
            {
                DateTime dtStart;
                if (!DateTime.TryParseExact(dtInit, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtStart))
                    dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.AddMonths(-1).Month, 1, 0, 0, 0);

                DateTime dtEnds;
                if (!DateTime.TryParseExact(dtEnd, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtEnds))
                    dtEnds = new DateTime(DateTime.Today.Year, dtStart.Month, dtStart.AddMonths(1).AddDays(-dtStart.Day).Day, 23, 59, 59);
                else
                    dtEnds = dtEnds.AddHours(23).AddMinutes(59).AddSeconds(59);

                var filters = builder.And(
                    builder.Gte("date", dtStart),
                    builder.Lte("date", dtEnds)
                );

                if (!string.IsNullOrEmpty(searchTerm))
                {
                    filters = builder.Or(
                        builder.Regex("user_nome", searchTerm),
                        builder.Regex("user_email", searchTerm)
                    );
                }

                var directed = collection.Find(filters);
                var ads = await directed.ToListAsync();

                var users = ads.Select(x => x.user_id).Distinct().ToList();
                
                StringBuilder csv = new StringBuilder();
                csv.Append(string.Format("{0};{1};{2};{3};{4}", "Nome", "Email", "Dt. Inícial", "Dt. Final", "Quantidade de Moderações") + Environment.NewLine);

                foreach (string user_id in users)
                {
                    //var user = ads.Where(y => y.user_id == user_id).Select(x => x.ToString()).ToList();
                    var user = (from s in ads.Where(x => x.user_id == user_id) select s).ToList();

                    csv.Append(string.Format("{0};{1};{2};{3};{4}", user[0].user_nome, user[0].user_email, dtStart.ToString("dd/MM/yyyy"), dtEnds.ToString("dd/MM/yyyy"), user.Count()) + Environment.NewLine);
                    //csv += String.Join(",", ads.Select(x => x.ToString()).ToArray());
                }

                //string csv = String.Join(",", ads.Select(x => x.ToString()).ToArray());

                //string attachment = "attachment; filename=ProdMod_" +  + ".csv";
                string attachment = "attachment; filename=ProdMod_" + User.Identity.GetUserId().Substring(0, 5) + ".csv";
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.ClearHeaders();
                HttpContext.Current.Response.ClearContent();
                HttpContext.Current.Response.AddHeader("content-disposition", attachment);
                HttpContext.Current.Response.ContentType = "text/csv";
                HttpContext.Current.Response.ContentEncoding = Encoding.GetEncoding("Windows-1252"); // Encoding.GetEncoding("UTF-8");
                HttpContext.Current.Response.AddHeader("Pragma", "public");

                /*var sb = new StringBuilder();
                foreach (var line in DataToExportToCSV)
                    sb.AppendLine(TransformDataLineIntoCsv(line));*/

                HttpContext.Current.Response.Write(csv.ToString());

                return Ok();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("AdsClicks_Views")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> AdsClicks_Views(string Id, string modeView, string DtIni, string DtEnd, string Click_View)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AdsReport>.Filter;
            var collection = db.GetAdsReport();

            if (string.IsNullOrEmpty(modeView))
                modeView = "m";

            DateTime dtStart;
            if (string.IsNullOrEmpty(DtIni))
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0);
            else if (!DateTime.TryParseExact(DtIni, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtStart))
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0);

            DateTime dtEnds;
            if (string.IsNullOrEmpty(DtEnd))
                dtEnds = new DateTime(DateTime.Today.Year, DateTime.Today.Month, (DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month)), 23, 59, 59);
            else if (!DateTime.TryParseExact(DtEnd, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtEnds))
                dtEnds = new DateTime(DateTime.Today.Year, DateTime.Today.Month, (DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month)), 23, 59, 59);
            else
                dtEnds = dtEnds.AddHours(23).AddMinutes(59).AddSeconds(59);

            List<AdsReport> lReturn = null;

            try
            {
                var directed = collection.Find(
                    filters.And(
                        filters.Eq("ad_id", Id),
                        filters.Eq("ad_event", Click_View),
                        filters.Lte("date", dtEnds),
                        filters.Gte("date", dtStart)
                        
                    )
                );

                lReturn = directed.ToList();

                List<KeyValuePair<string, string>> Valores = new List<KeyValuePair<string, string>>();

                switch (modeView)
                {
                    case "m":

                        int iDeference = Math.Abs((dtStart.Month - dtEnds.Month) + 12 * (dtStart.Year - dtEnds.Year));
                        
                        for (var iCont = 0; iCont <= iDeference; iCont++)
                        {
                            var dt = new DateTime(dtStart.AddMonths(iCont).Year, dtStart.AddMonths(iCont).Month, DateTime.DaysInMonth(dtStart.AddMonths(iCont).Year, dtStart.AddMonths(iCont).Month));
                            
                            var totalFiltro = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, 1) && x.date <= dt).Count();
                            Valores.Add(new KeyValuePair<string, string>(dt.ToString("MM/yyyy"), totalFiltro.ToString()));
                        }

                        break;
                    case "w":
                        break;
                    case "d":

                        TimeSpan date = Convert.ToDateTime(dtEnds) - Convert.ToDateTime(dtStart);

                        int totalDias = date.Days;

                        for (var iCont = 0; iCont <= date.Days; iCont++)
                        {
                            var dt = new DateTime(dtStart.AddDays(iCont).Year, dtStart.AddDays(iCont).Month, dtStart.AddDays(iCont).Day);

                            var totalFiltro = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, dt.Day) && x.date <= dt).Count();
                            Valores.Add(new KeyValuePair<string, string>(dt.ToString("dd/MM/yyyy"), totalFiltro.ToString()));
                        }

                        break;
                }

                return Ok(Valores);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("AdsEfficiency")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> AdsEfficiency(string Id, string modeView, string DtIni, string DtEnd)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AdsReport>.Filter;
            var collection = db.GetAdsReport();

            if (string.IsNullOrEmpty(modeView))
                modeView = "m";

            DateTime dtStart;
            if (string.IsNullOrEmpty(DtIni))
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0);
            else if (!DateTime.TryParseExact(DtIni, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtStart))
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0);

            DateTime dtEnds;
            if (string.IsNullOrEmpty(DtEnd))
                dtEnds = new DateTime(DateTime.Today.Year, DateTime.Today.Month, (DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month)), 23, 59, 59);
            else if (!DateTime.TryParseExact(DtEnd, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtEnds))
                dtEnds = new DateTime(DateTime.Today.Year, DateTime.Today.Month, (DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month)), 23, 59, 59);
            else
                dtEnds = dtEnds.AddHours(23).AddMinutes(59).AddSeconds(59);

            List<AdsReport> lReturn = null;

            try
            {
                var directed = collection.Find(
                    filters.And(
                        filters.Eq("ad_id", Id),
                        //filters.Eq("ad_event", Click_View),
                        filters.Lte("date", dtEnds),
                        filters.Gte("date", dtStart)

                    )
                );

                lReturn = directed.ToList();

                List<KeyValuePair<string, string>> Valores = new List<KeyValuePair<string, string>>();

                switch (modeView)
                {
                    case "m":

                        int iDeference = Math.Abs((dtStart.Month - dtEnds.Month) + 12 * (dtStart.Year - dtEnds.Year));

                        for (var iCont = 0; iCont <= iDeference; iCont++)
                        {
                            var dt = new DateTime(dtStart.AddMonths(iCont).Year, dtStart.AddMonths(iCont).Month, DateTime.DaysInMonth(dtStart.AddMonths(iCont).Year, dtStart.AddMonths(iCont).Month));

                            //var totalFiltro = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, 1)

                            var totalClicks = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, 1) && x.date <= dt && x.ad_event == "click").Count();
                            var totalViews = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, 1) && x.date <= dt && x.ad_event == "view").Count();

                            if (totalViews == 0)
                                Valores.Add(new KeyValuePair<string, string>(dt.ToString("MM/yyyy"), "0"));
                            else
                                Valores.Add(new KeyValuePair<string, string>(dt.ToString("MM/yyyy"), string.Format("{0:0.##}", (Convert.ToDecimal(totalClicks) / Convert.ToDecimal(totalViews))).ToString().Replace(",", ".")));
                        }

                        break;
                    case "w":
                        break;
                    case "d":

                        TimeSpan date = Convert.ToDateTime(dtEnds) - Convert.ToDateTime(dtStart);

                        int totalDias = date.Days;

                        for (var iCont = 0; iCont <= date.Days; iCont++)
                        {
                            var dt = new DateTime(dtStart.AddDays(iCont).Year, dtStart.AddDays(iCont).Month, dtStart.AddDays(iCont).Day);

                            var totalClicks = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, dt.Day) && x.date <= dt && x.ad_event == "click").Count();
                            var totalViews = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, dt.Day) && x.date <= dt && x.ad_event == "view").Count();

                            if (totalViews == 0)
                                Valores.Add(new KeyValuePair<string, string>(dt.ToString("dd/MM/yyyy"), "0"));
                            else
                                Valores.Add(new KeyValuePair<string, string>(dt.ToString("dd/MM/yyyy"), string.Format("{0:0.##}", (Convert.ToDecimal(totalClicks) / Convert.ToDecimal(totalViews))).ToString().Replace(",", ".")));
                        }

                        break;
                }

                //lReturn.GroupBy(x => x.date.ToString("yyyy-M-dd"));



                return Ok(Valores);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [HttpGet]
        [Route("AdsConsumption")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> AdsConsumption(string Id, string modeView, string DtIni, string DtEnd)
        {
            var db = IlevusDBContext.Create();
            var filters = Builders<AdsReport>.Filter;
            var collection = db.GetAdsReport();

            if (string.IsNullOrEmpty(modeView))
                modeView = "m";

            DateTime dtStart;
            if (string.IsNullOrEmpty(DtIni))
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0);
            else if (!DateTime.TryParseExact(DtIni, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtStart))
                dtStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1, 0, 0, 0);

            DateTime dtEnds;
            if (string.IsNullOrEmpty(DtEnd))
                dtEnds = new DateTime(DateTime.Today.Year, DateTime.Today.Month, (DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month)), 23, 59, 59);
            else if (!DateTime.TryParseExact(DtEnd, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dtEnds))
                dtEnds = new DateTime(DateTime.Today.Year, DateTime.Today.Month, (DateTime.DaysInMonth(DateTime.Today.Year, DateTime.Today.Month)), 23, 59, 59);
            else
                dtEnds = dtEnds.AddHours(23).AddMinutes(59).AddSeconds(59);

            List<AdsReport> lReturn = null;

            try
            {
                var directed = collection.Find(
                    filters.And(
                        filters.Eq("ad_id", Id),
                        //filters.Eq("ad_event", Click_View),
                        filters.Lte("date", dtEnds),
                        filters.Gte("date", dtStart)

                    )
                );

                lReturn = directed.ToList();

                List<KeyValuePair<string, string>> Valores = new List<KeyValuePair<string, string>>();

                switch (modeView)
                {
                    case "m":

                        int iDeference = Math.Abs((dtStart.Month - dtEnds.Month) + 12 * (dtStart.Year - dtEnds.Year));

                        for (var iCont = 0; iCont <= iDeference; iCont++)
                        {
                            var dt = new DateTime(dtStart.AddMonths(iCont).Year, dtStart.AddMonths(iCont).Month, DateTime.DaysInMonth(dtStart.AddMonths(iCont).Year, dtStart.AddMonths(iCont).Month));

                            var filtrado = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, 1) && x.date <= dt).Sum(y => y.cost);
                            //var views = lReturn.Where(x => x.date >= dtStart && x.date <= dtStart.AddMonths(iCont) && x.ad_event == "view");

                            Valores.Add(new KeyValuePair<string, string>(dt.ToString("MM/yyyy"), string.Format("{0:0.##}", (Convert.ToDecimal(filtrado))).ToString().Replace(",", ".")));
                        }

                        break;
                    case "w":
                        break;
                    case "d":
                        TimeSpan date = Convert.ToDateTime(dtEnds) - Convert.ToDateTime(dtStart);

                        int totalDias = date.Days;

                        for (var iCont = 0; iCont <= date.Days; iCont++)
                        {
                            var dt = new DateTime(dtStart.AddDays(iCont).Year, dtStart.AddDays(iCont).Month, dtStart.AddDays(iCont).Day);

                            var filtrado = lReturn.Where(x => x.date >= new DateTime(dt.Year, dt.Month, dt.Day) && x.date <= dt).Sum(y => y.cost);

                            Valores.Add(new KeyValuePair<string, string>(dt.ToString("dd/MM/yyyy"), string.Format("{0:0.##}", (Convert.ToDecimal(filtrado))).ToString().Replace(",", ".")));
                        }

                        break;
                }

                return Ok(Valores);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

    }
}