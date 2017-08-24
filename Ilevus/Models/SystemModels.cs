using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections;
using System.Collections.Concurrent;
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
        public SystemTranslatedEmail SystemMessage { get; set; }

        public string MoipBaseUrl { get; set; }
        public string MoipToken { get; set; }
        public string MoipKey { get; set; }
        public string MoipSubscriptionKey { get; set; }
        public string MoipSubscriptionCode { get; set; }
        public string MoipCryptoPublicKey { get; set; }

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

    public class SystemMessages
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        public string Language { get; set; }
        public ConcurrentDictionary<string, SystemLabel> Messages { get; set; }

        public SystemMessages()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Messages = new ConcurrentDictionary<string, SystemLabel>();
        }
        
        public void Add(string key, SystemLabel label)
        {
            Messages.AddOrUpdate(key, (theKey) => {
                return label;
            }, (theKey, value) => {
                return label;
            });
        }
    }

    public class SystemLabel
    {
        public bool Reviewed { get; set; }
        public bool New { get; set; }
        public DateTime LastModified { get; set; }
        public string Content { get; set; }

        public SystemLabel()
        {
            New = true;
            Reviewed = false;
            LastModified = DateTime.Now;
        }

    }

    public class MessageBindingModel
    {
        public string Key { get; set; }
        public string OldKey { get; set; }
        public string Content { get; set; }
        public string Lang { get; set; }
    }

    public class SystemApisConfigsBindingModel
    {
        public string MoipBaseUrl { get; set; }
        public string MoipToken { get; set; }
        public string MoipKey { get; set; }
        public string MoipSubscriptionKey { get; set; }
        public string MoipSubscriptionCode { get; set; }
        public string MoipCryptoPublicKey { get; set; }
    }

    public class SystemDefinitions
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public SystemTranslatedEmail WelcomeMessages { get; set; }
        public SystemTranslatedEmail EmailValidationMessages { get; set; }
        public SystemTranslatedEmail AccountBlockingMessages { get; set; }
        public SystemTranslatedEmail RecoverPasswordMessages { get; set; }
        public SystemTranslatedEmail SystemMessage { get; set; }

        //public string PathAds { get; set; }
        public string definitions { get; set; }

        public SystemDefinitions() //(string FixedId)
        {
            //Id = FixedId;
            Id = ObjectId.GenerateNewId().ToString();
        }
    }

    public class SystemDefinitionsConfigsBindingModel
    {
        public string PathAds { get; set; }

    }


}