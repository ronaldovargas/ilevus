using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class MeetingSchedule
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        public string UserId { get; set; }
        public string CoacheeFullName { get; set; }
        public string CoacheeEmail { get; set; }
        public string CoacheePhone { get; set; }
        public string Subject { get; set; }
        public DateTime Begin { get; set; }

        public MeetingSchedule()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }
    }

    public class MeetingBindingModel
    {
        public string UserId { get; set; }
        public string CoacheeFullName { get; set; }
        public string CoacheeEmail { get; set; }
        public string CoacheePhone { get; set; }
        public string Subject { get; set; }
        public DateTime Begin { get; set; }
    }
}