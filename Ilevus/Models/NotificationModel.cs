using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace ilevus.Models
{
    public class NotificationModel
    {

        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string User_id { get; set; }
        public string From { get; set; }
        public string InfoNotification { get; set; }
        public string DateNotification { get; set; }
        public bool Status { get; set; }
        public string Subject { get; set; }

        public NotificationModel()
        {
            Id = ObjectId.GenerateNewId().ToString();
            User_id = "";
            From = "";
            InfoNotification = "";
            DateNotification = "";
            Status = false;
            Subject = "";
        }
    }
}