using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class Ad
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Headline { get; set; }

        public string Campain { get; set; }

        public string Image { get; set; }

        public string ImageDesktop { get; set; }
        public string ImageMobile { get; set; }

        public IEnumerable<string> Keywords { get; set; }
        public string Link { get; set; }

        public double DailyBudgetCap { get; set; }

        public int Category { get; set; }
        public long Hits { get; set; }
        public long Views { get; set; }
        public bool Active { get; set; }
        public DateTime Begin { get; set; }
        public DateTime End { get; set; }
        public DateTime Creation { get; set; }

        public string AdLanguage { get; set; }

        public UserModerator Moderator { get; set; }

        public string Status { get; set; }

        public Ad()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Active = false;
            Hits = 0;
            Views = 0;
            Keywords = new List<string>();
            AdLanguage = "portuguese";
            Creation = DateTime.Now;
        }
    }

    public class AdBalance
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        public float Balance { get; set; }
    }

    public class UserModerator
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public DateTime? AnalysisHour { get; set; }
    }

    public class CountPreviewModeration
    {
        public int dailyCount { get; set; }
        public int monthCount { get; set; }
        public int prevMonthCount { get; set; }
    }

    public class AdBindingModel
    {
        public string Id { get; set; }
        public string Headline { get; set; }

        public string Campain { get; set; }

        public string Image { get; set; }

        public string Image_Desktop { get; set; }
        public string Image_Mobile { get; set; }
        public string Image_Desktop_old { get; set; }
        public string Image_Mobile_old { get; set; }

        public string DailyBudgetCap { get; set; }

        public string Link { get; set; }
        public IEnumerable<string> Keywords { get; set; }
        public bool Active { get; set; }
    }

    public class AdLogModeration
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string user_id { get; set; }

        public string user_nome { get; set; }

        public string user_email { get; set; }

        public string ad_id { get; set; }

        public string status { get; set; }

        public DateTime date { get; set; }
    }
}