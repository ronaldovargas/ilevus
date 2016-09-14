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
        
        public SystemTranslatedEmail WelcomeMessages { get; set; }
        public SystemTranslatedEmail EmailValidationMessages { get; set; }
        public SystemTranslatedEmail AccountBlockingMessages { get; set; }
        public SystemTranslatedEmail RecoverPasswordMessages { get; set; }

        public SystemConfig()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }
    }

    public class SystemTranslatedEmail
    {
        public SystemEmail pt_br { get; set; }
        public SystemEmail en { get; set; }
        public SystemEmail es { get; set; }

        public SystemEmail GetByCulture(string culture)
        {
            if ("en".Equals(culture))
                return en;
            else if ("es".Equals(culture))
                return es;
            return pt_br;
        }
    }

    public class SystemEmail
    {
        public string Subject { get; set; }
        public string Template { get; set; }
    }
}