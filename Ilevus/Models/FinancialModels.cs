using Moip.Net;
using Moip.Net.Assinaturas;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ilevus.Models
{
    public class IlevusSubscription
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string UserId { get; set; }
        public int Amount { get; set; }
        
        public Invoice Invoice { get; set; }
        public MoipDate NextInvoiceDate { get; set; }

        public Subscription.SubscriptionStatus Status { get; set; }

        public DateTime Creation { get; set; }

        public IlevusSubscription()
        {
            Id = ObjectId.GenerateNewId().ToString();
            Creation = DateTime.Now;
        }
    }
    
    public class MoipSubscriptionBindingModel
    {
        public string Id { get; set; }
        public CustomerRequest Customer { get; set; }
    }

}