using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class SystemConfig
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        public IEnumerable<SystemEmail> WelcomeMessages { get; set; }
        public IEnumerable<SystemEmail> EmailValidationMessages { get; set; }
        public IEnumerable<SystemEmail> EmailValidationReminderMessages { get; set; }
        public IEnumerable<SystemEmail> RecoverPasswordMessages { get; set; }

        public SystemConfig()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }
    }

    public class SystemEmail
    {
        public string Template { get; set; }
        public string Language { get; set; }
        public bool Html { get; set; }
    }
}